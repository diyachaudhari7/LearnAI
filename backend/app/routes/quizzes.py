import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.quiz import Quiz, Question, QuizAttempt
from app.auth.deps import get_current_user
from app.schemas.schemas import APIResponse, QuizOut, QuizDetail, QuestionOut, QuizSubmitRequest, QuizSubmitResult, QuizAttemptOut
from app.services.quiz_service import quiz_service

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

def format_quiz_out(quiz: Quiz, db: Session, user_id: int) -> QuizOut:
    q_count = db.query(Question).filter(Question.quiz_id == quiz.id).count()
    last_attempt = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.quiz_id == quiz.id, QuizAttempt.user_id == user_id)
        .order_by(QuizAttempt.completed_at.desc())
        .first()
    )
    attempts_count = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.quiz_id == quiz.id, QuizAttempt.user_id == user_id)
        .count()
    )

    return QuizOut(
        id=quiz.id,
        document_id=quiz.document_id,
        title=quiz.title,
        topic=quiz.topic or "General",
        difficulty=quiz.difficulty or "Medium",
        question_count=q_count,
        created_at=quiz.created_at,
        last_score=last_attempt.percentage if last_attempt else None,
        attempts_count=attempts_count
    )

@router.get("", response_model=APIResponse[List[QuizOut]])
def get_quizzes(
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Quiz).filter(Quiz.user_id == current_user.id)
    if topic and topic.lower() != "all":
        query = query.filter(Quiz.topic == topic)
    if difficulty and difficulty.lower() != "all":
        query = query.filter(Quiz.difficulty == difficulty)

    quizzes = query.order_by(Quiz.created_at.desc()).all()
    results = [format_quiz_out(q, db, current_user.id) for q in quizzes]
    return APIResponse(success=True, message="Quizzes retrieved", data=results)

@router.get("/{quiz_id}", response_model=APIResponse[QuizDetail])
def get_quiz_detail(quiz_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    base = format_quiz_out(quiz, db, current_user.id)
    questions = db.query(Question).filter(Question.quiz_id == quiz.id).all()
    q_outs = []
    for q in questions:
        opts = json.loads(q.options) if isinstance(q.options, str) else q.options
        q_outs.append(QuestionOut(
            id=q.id,
            quiz_id=q.quiz_id,
            question=q.question,
            options=opts,
            explanation=None,  # hidden until submission
            topic=q.topic or "General",
            difficulty=q.difficulty or "Medium"
        ))

    return APIResponse(
        success=True,
        message="Quiz details retrieved",
        data=QuizDetail(**base.dict(), questions=q_outs)
    )

@router.post("/{quiz_id}/submit", response_model=APIResponse[QuizSubmitResult])
def submit_quiz(
    quiz_id: int,
    submission: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = quiz_service.evaluate_quiz_submission(db, current_user.id, quiz_id, submission)
        return APIResponse(success=True, message="Quiz graded successfully", data=result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Grading error: {str(e)}")

@router.get("/{quiz_id}/attempts", response_model=APIResponse[List[QuizAttemptOut]])
def get_quiz_attempts(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.quiz_id == quiz_id, QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.completed_at.desc())
        .all()
    )

    results = [
        QuizAttemptOut(
            id=a.id,
            quiz_id=a.quiz_id,
            quiz_title=quiz.title,
            score=a.score,
            total_questions=a.total_questions,
            percentage=a.percentage,
            time_taken_seconds=a.time_taken_seconds,
            completed_at=a.completed_at
        )
        for a in attempts
    ]
    return APIResponse(success=True, message="Attempts retrieved", data=results)

@router.delete("/{quiz_id}", response_model=APIResponse[dict])
def delete_quiz(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Delete questions and attempts
    db.query(Question).filter(Question.quiz_id == quiz.id).delete()
    attempts = db.query(QuizAttempt).filter(QuizAttempt.quiz_id == quiz.id).all()
    for att in attempts:
        db.query(QuizAttemptAnswer).filter(QuizAttemptAnswer.attempt_id == att.id).delete()
        db.delete(att)
    db.delete(quiz)
    db.commit()

    return APIResponse(success=True, message=f"Quiz '{quiz.title}' deleted successfully", data={"deleted_id": quiz_id})

@router.post("/{quiz_id}/regenerate", response_model=APIResponse[dict])
def regenerate_quiz(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.document import Document
    from app.services.ai_service import ai_service

    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    text = ""
    if quiz.document_id:
        doc = db.query(Document).filter(Document.id == quiz.document_id).first()
        if doc and doc.extracted_text:
            text = doc.extracted_text

    if not text:
        text = f"Study material focusing on {quiz.topic} fundamentals, concepts, syntax, and applications."

    existing_q_count = db.query(Question).filter(Question.quiz_id == quiz.id).count()
    target_count = max(5, existing_q_count or 5)

    new_questions = ai_service.generate_quiz(text, quiz.topic, count=target_count)

    # Remove old questions
    db.query(Question).filter(Question.quiz_id == quiz.id).delete()

    for q in new_questions:
        q_rec = Question(
            quiz_id=quiz.id,
            question=q.get("question", "Question"),
            options=json.dumps(q.get("options", ["A", "B", "C", "D"])),
            correct_answer=int(q.get("correct_answer", 0)),
            explanation=q.get("explanation", ""),
            topic=q.get("topic", quiz.topic),
            difficulty=q.get("difficulty", quiz.difficulty or "Medium")
        )
        db.add(q_rec)

    db.commit()

    return APIResponse(
        success=True,
        message=f"Regenerated {len(new_questions)} questions for '{quiz.title}'",
        data={"quiz_id": quiz.id, "question_count": len(new_questions)}
    )

