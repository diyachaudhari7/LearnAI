from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.database import get_db
from app.models.user import User
from app.models.document import Document
from app.models.quiz import QuizAttempt
from app.models.competency import Competency
from app.models.flashcard import Flashcard
from app.auth.deps import get_current_user
from app.auth.password import verify_password, get_password_hash
from app.schemas.schemas import APIResponse, UserOut, ProfileUpdateRequest, PasswordChangeRequest

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("", response_model=APIResponse[dict])
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc_count = db.query(Document).filter(Document.user_id == current_user.id).count()
    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == current_user.id).all()
    quiz_count = len(attempts)
    avg_score = round(sum(a.percentage for a in attempts) / quiz_count, 1) if quiz_count > 0 else 0.0
    
    competencies = db.query(Competency).filter(Competency.user_id == current_user.id).all()
    skills_mastered = sum(1 for c in competencies if c.score >= 80.0)
    flashcards_count = db.query(Flashcard).filter(Flashcard.user_id == current_user.id).count()

    profile_data = {
        "user": UserOut.from_orm(current_user).dict(),
        "stats": {
            "documents_uploaded": doc_count,
            "quizzes_completed": quiz_count,
            "average_score": avg_score,
            "skills_mastered": skills_mastered,
            "flashcards_count": flashcards_count,
            "learning_streak_days": 4
        }
    }
    return APIResponse(success=True, message="User profile retrieved", data=profile_data)

@router.put("", response_model=APIResponse[UserOut])
def update_profile(
    update_req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update_req.name:
        current_user.name = update_req.name
    if update_req.role:
        current_user.role = update_req.role
    if update_req.avatar:
        current_user.avatar = update_req.avatar

    db.commit()
    db.refresh(current_user)
    return APIResponse(success=True, message="Profile updated successfully", data=UserOut.from_orm(current_user))

@router.post("/change-password", response_model=APIResponse[dict])
def change_password(
    pwd_req: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(pwd_req.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password does not match.")

    current_user.password_hash = get_password_hash(pwd_req.new_password)
    db.commit()

    return APIResponse(success=True, message="Password updated successfully.", data={"updated": True})
