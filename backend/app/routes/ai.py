import json
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.database.database import get_db
from app.models.user import User
from app.models.document import Document
from app.models.summary import Summary
from app.models.quiz import Quiz, Question
from app.models.flashcard import Flashcard
from app.auth.deps import get_current_user
from app.schemas.schemas import APIResponse, SummaryOut, SummaryDefinition, QuizOut, FlashcardOut, LearningPathOut
from app.services.ai_service import ai_service
from app.services.learning_path_service import learning_path_service

router = APIRouter(prefix="/ai", tags=["AI Generation"])

@router.post("/summary", response_model=APIResponse[SummaryOut])
def generate_or_regenerate_summary(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc_id = payload.get("document_id")
    raw_text = payload.get("text", "")

    filename = ""
    if doc_id:
        doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        raw_text = doc.extracted_text or doc.filename
        filename = doc.filename

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Text or document_id is required.")

    summary_data = ai_service.generate_summary(raw_text, filename)

    if doc_id:
        existing = db.query(Summary).filter(Summary.document_id == doc_id).first()
        if existing:
            existing.overview = summary_data["overview"]
            existing.key_concepts = json.dumps(summary_data["key_concepts"])
            existing.definitions = json.dumps(summary_data["definitions"])
            existing.key_takeaways = json.dumps(summary_data["key_takeaways"])
            existing.created_at = datetime.utcnow()
            summary_obj = existing
        else:
            summary_obj = Summary(
                document_id=doc_id,
                overview=summary_data["overview"],
                key_concepts=json.dumps(summary_data["key_concepts"]),
                definitions=json.dumps(summary_data["definitions"]),
                key_takeaways=json.dumps(summary_data["key_takeaways"]),
                created_at=datetime.utcnow()
            )
            db.add(summary_obj)
        db.commit()
        db.refresh(summary_obj)
        summary_id = summary_obj.id
        created_at = summary_obj.created_at
    else:
        summary_id = 0
        created_at = datetime.utcnow()

    defs_list = [
        SummaryDefinition(term=d.get("term", ""), definition=d.get("definition", ""))
        for d in summary_data.get("definitions", [])
    ]

    out = SummaryOut(
        id=summary_id,
        document_id=doc_id or 0,
        overview=summary_data["overview"],
        key_concepts=summary_data["key_concepts"],
        definitions=defs_list,
        key_takeaways=summary_data["key_takeaways"],
        created_at=created_at
    )
    return APIResponse(success=True, message="Summary generated successfully", data=out)

@router.post("/generate-quiz", response_model=APIResponse[dict])
def generate_custom_quiz(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc_id = payload.get("document_id")
    topic = payload.get("topic", "General")
    count = min(max(int(payload.get("count", 10)), 3), 20)

    text = ""
    if doc_id:
        doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
        if doc:
            text = doc.extracted_text or doc.filename

    if not text:
        text = f"Study material focusing on {topic} fundamentals, concepts, algorithms, and practical application."

    questions_data = ai_service.generate_quiz(text, topic, count)

    quiz = Quiz(
        document_id=doc_id,
        user_id=current_user.id,
        title=payload.get("title", f"{topic} Mastery Quiz"),
        topic=topic,
        difficulty=payload.get("difficulty", "Medium"),
        created_at=datetime.utcnow()
    )
    db.add(quiz)
    db.flush()

    for q in questions_data:
        q_rec = Question(
            quiz_id=quiz.id,
            question=q.get("question", "Question"),
            options=json.dumps(q.get("options", ["A", "B", "C", "D"])),
            correct_answer=int(q.get("correct_answer", 0)),
            explanation=q.get("explanation", ""),
            topic=q.get("topic", topic),
            difficulty=q.get("difficulty", "Medium")
        )
        db.add(q_rec)

    db.commit()
    db.refresh(quiz)

    return APIResponse(
        success=True,
        message=f"Generated new quiz '{quiz.title}' with {len(questions_data)} questions.",
        data={"quiz_id": quiz.id, "title": quiz.title, "question_count": len(questions_data)}
    )

@router.post("/generate-flashcards", response_model=APIResponse[dict])
def generate_custom_flashcards(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc_id = payload.get("document_id")
    topic = payload.get("topic", "General")
    count = min(max(int(payload.get("count", 10)), 4), 25)

    text = ""
    if doc_id:
        doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
        if doc:
            text = doc.extracted_text or doc.filename

    if not text:
        text = f"Key definitions, terms, principles, and concepts related to {topic}."

    cards_data = ai_service.generate_flashcards(text, topic, count)
    created_count = 0
    for c in cards_data:
        card = Flashcard(
            user_id=current_user.id,
            document_id=doc_id,
            front=c.get("front", ""),
            back=c.get("back", ""),
            topic=c.get("topic", topic),
            known=False,
            review_required=True,
            created_at=datetime.utcnow()
        )
        db.add(card)
        created_count += 1

    db.commit()

    return APIResponse(
        success=True,
        message=f"Successfully generated {created_count} flashcards for '{topic}'.",
        data={"topic": topic, "count": created_count}
    )

@router.post("/generate-learning-path", response_model=APIResponse[dict])
def generate_learning_path_ai(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    path = learning_path_service.generate_personalized_path(db, current_user.id)
    return APIResponse(
        success=True,
        message="Personalized learning path generated from competency gaps.",
        data={"learning_path_id": path.id, "title": path.title}
    )
