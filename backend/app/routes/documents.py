import os
import json
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.database import get_db
from app.models.user import User
from app.models.document import Document
from app.models.topic import Topic
from app.models.summary import Summary
from app.models.quiz import Quiz, Question
from app.models.flashcard import Flashcard
from app.models.activity import UserActivity
from app.auth.deps import get_current_user
from app.schemas.schemas import APIResponse, DocumentOut, DocumentDetail, TopicOut, SummaryOut, SummaryDefinition
from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import ai_service
from app.config import settings

router = APIRouter(prefix="/documents", tags=["Documents"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

def format_doc_out(doc: Document, db: Session) -> DocumentOut:
    topics_list = db.query(Topic).filter(Topic.document_id == doc.id).all()
    quiz_count = db.query(Quiz).filter(Quiz.document_id == doc.id).count()
    flashcard_count = db.query(Flashcard).filter(Flashcard.document_id == doc.id).count()
    summary_exists = db.query(Summary).filter(Summary.document_id == doc.id).first() is not None

    return DocumentOut(
        id=doc.id,
        filename=doc.filename,
        file_size=doc.file_size or 0,
        page_count=doc.page_count or 1,
        status=doc.status or "uploaded",
        created_at=doc.created_at,
        topic_count=len(topics_list),
        quiz_count=quiz_count,
        flashcard_count=flashcard_count,
        has_summary=summary_exists,
        topics=[TopicOut.from_orm(t) for t in topics_list]
    )

@router.post("/upload", response_model=APIResponse[DocumentOut])
async def upload_document(
    file: UploadFile = File(...),
    auto_analyze: bool = Form(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf") and not file.filename.lower().endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only PDF and TXT learning materials are supported.")

    file_bytes = await file.read()
    file_size = len(file_bytes)
    if file_size > 25 * 1024 * 1024:  # 25MB limit
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed limit of 25MB.")

    user_upload_dir = os.path.join(settings.UPLOAD_DIR, f"user_{current_user.id}")
    os.makedirs(user_upload_dir, exist_ok=True)
    file_path = os.path.join(user_upload_dir, f"{int(datetime.utcnow().timestamp())}_{file.filename}")

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Extract text
    extraction = extract_text_from_pdf(file_path)

    doc = Document(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_size=file_size,
        page_count=extraction["page_count"],
        extracted_text=extraction["text"],
        status="uploaded",
        created_at=datetime.utcnow()
    )
    db.add(doc)
    db.flush()

    # Log activity
    act = UserActivity(
        user_id=current_user.id,
        activity_type="upload",
        title=f"Uploaded {file.filename}",
        description=f"Extracted {extraction['page_count']} pages ({extraction['char_count']} characters).",
        timestamp=datetime.utcnow()
    )
    db.add(act)
    db.commit()
    db.refresh(doc)

    if auto_analyze:
        # Perform instant analysis
        return await analyze_document(doc.id, current_user, db)

    return APIResponse(
        success=True,
        message="Document uploaded and text extracted successfully.",
        data=format_doc_out(doc, db)
    )

@router.get("", response_model=APIResponse[List[DocumentOut]])
def list_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
    results = [format_doc_out(doc, db) for doc in docs]
    return APIResponse(success=True, message="Documents retrieved", data=results)

@router.get("/{doc_id}", response_model=APIResponse[DocumentDetail])
def get_document(doc_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    base_out = format_doc_out(doc, db)
    summary_rec = db.query(Summary).filter(Summary.document_id == doc.id).first()
    summary_out = None
    if summary_rec:
        key_concepts = json.loads(summary_rec.key_concepts) if isinstance(summary_rec.key_concepts, str) else summary_rec.key_concepts
        raw_defs = json.loads(summary_rec.definitions) if isinstance(summary_rec.definitions, str) else summary_rec.definitions
        key_takeaways = json.loads(summary_rec.key_takeaways) if isinstance(summary_rec.key_takeaways, str) else summary_rec.key_takeaways
        
        defs_list = [SummaryDefinition(term=d.get("term", ""), definition=d.get("definition", "")) for d in raw_defs]
        summary_out = SummaryOut(
            id=summary_rec.id,
            document_id=summary_rec.document_id,
            overview=summary_rec.overview,
            key_concepts=key_concepts,
            definitions=defs_list,
            key_takeaways=key_takeaways,
            created_at=summary_rec.created_at
        )

    detail = DocumentDetail(
        **base_out.dict(),
        extracted_text=doc.extracted_text,
        summary=summary_out
    )
    return APIResponse(success=True, message="Document details retrieved", data=detail)

@router.post("/{doc_id}/analyze", response_model=APIResponse[DocumentDetail])
async def analyze_document(doc_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    text = doc.extracted_text or doc.filename

    # 1. AI Topics Extraction
    raw_topics = ai_service.extract_topics(text, doc.filename)
    # Clear any existing topics for this doc
    db.query(Topic).filter(Topic.document_id == doc.id).delete()
    for t in raw_topics:
        topic_obj = Topic(
            document_id=doc.id,
            name=t.get("name", "Core Concept"),
            difficulty=t.get("difficulty", "Intermediate"),
            importance=t.get("importance", "High"),
            description=t.get("description", "")
        )
        db.add(topic_obj)

    # 2. AI Structured Summary Generation
    raw_summary = ai_service.generate_summary(text, doc.filename)
    db.query(Summary).filter(Summary.document_id == doc.id).delete()
    summary_obj = Summary(
        document_id=doc.id,
        overview=raw_summary.get("overview", "Overview not generated"),
        key_concepts=json.dumps(raw_summary.get("key_concepts", [])),
        definitions=json.dumps(raw_summary.get("definitions", [])),
        key_takeaways=json.dumps(raw_summary.get("key_takeaways", [])),
        created_at=datetime.utcnow()
    )
    db.add(summary_obj)

    # 3. AI Quiz Generation (Generate starter 5-10 question quiz)
    primary_topic = raw_topics[0].get("name", "General") if raw_topics else "General"
    
    # Clean up existing quizzes for this document to prevent duplicates
    old_quizzes = db.query(Quiz).filter(Quiz.document_id == doc.id).all()
    for oq in old_quizzes:
        db.query(Question).filter(Question.quiz_id == oq.id).delete()
        db.delete(oq)
    db.flush()

    raw_quiz_questions = ai_service.generate_quiz(text, primary_topic, count=max(5, min(10, len(text) // 200)))

    
    quiz_obj = Quiz(
        document_id=doc.id,
        user_id=current_user.id,
        title=f"{doc.filename.replace('.pdf', '')} Quiz",
        topic=primary_topic,
        difficulty="Medium",
        created_at=datetime.utcnow()
    )
    db.add(quiz_obj)
    db.flush()

    for q_data in raw_quiz_questions:
        q_item = Question(
            quiz_id=quiz_obj.id,
            question=q_data.get("question", "Question text"),
            options=json.dumps(q_data.get("options", ["Option A", "Option B", "Option C", "Option D"])),
            correct_answer=int(q_data.get("correct_answer", 0)),
            explanation=q_data.get("explanation", ""),
            topic=q_data.get("topic", primary_topic),
            difficulty=q_data.get("difficulty", "Medium")
        )
        db.add(q_item)

    # 4. AI Flashcards Generation
    raw_flashcards = ai_service.generate_flashcards(text, primary_topic, count=8)
    for f_data in raw_flashcards:
        f_card = Flashcard(
            user_id=current_user.id,
            document_id=doc.id,
            front=f_data.get("front", "Front of card"),
            back=f_data.get("back", "Back explanation"),
            topic=f_data.get("topic", primary_topic),
            known=False,
            review_required=True,
            created_at=datetime.utcnow()
        )
        db.add(f_card)

    doc.status = "processed"

    # Activity Log
    act = UserActivity(
        user_id=current_user.id,
        activity_type="topic_mastered",
        title=f"AI Analyzed {doc.filename}",
        description=f"Generated {len(raw_topics)} topics, structured summary, {len(raw_quiz_questions)} quiz questions, and {len(raw_flashcards)} flashcards.",
        timestamp=datetime.utcnow()
    )
    db.add(act)

    db.commit()
    db.refresh(doc)

    return get_document(doc.id, current_user, db)

@router.delete("/{doc_id}", response_model=APIResponse[dict])
def delete_document(doc_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if doc.file_path and os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()

    return APIResponse(success=True, message=f"Document '{doc.filename}' deleted successfully.", data={"deleted_id": doc_id})
