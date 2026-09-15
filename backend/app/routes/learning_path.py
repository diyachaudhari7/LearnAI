from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.learning_path import LearningPath, LearningPathWeek, LearningPathTopic
from app.auth.deps import get_current_user
from app.schemas.schemas import APIResponse, LearningPathOut, LearningPathWeekOut, LearningPathTopicOut
from app.services.learning_path_service import learning_path_service

router = APIRouter(prefix="/learning-path", tags=["Learning Path"])

def format_learning_path_out(path: LearningPath, db: Session) -> LearningPathOut:
    weeks = (
        db.query(LearningPathWeek)
        .filter(LearningPathWeek.learning_path_id == path.id)
        .order_by(LearningPathWeek.week_number.asc())
        .all()
    )

    week_outs = []
    for w in weeks:
        topics = (
            db.query(LearningPathTopic)
            .filter(LearningPathTopic.week_id == w.id)
            .order_by(LearningPathTopic.id.asc())
            .all()
        )
        week_outs.append(LearningPathWeekOut(
            id=w.id,
            week_number=w.week_number,
            title=w.title,
            description=w.description,
            status=w.status,
            progress=w.progress,
            estimated_hours=w.estimated_hours,
            difficulty=w.difficulty,
            topics=[LearningPathTopicOut.from_orm(t) for t in topics]
        ))

    return LearningPathOut(
        id=path.id,
        title=path.title,
        overview=path.overview,
        created_at=path.created_at,
        weeks=week_outs
    )

@router.get("", response_model=APIResponse[Optional[LearningPathOut]])
def get_active_learning_path(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    path = (
        db.query(LearningPath)
        .filter(LearningPath.user_id == current_user.id)
        .order_by(LearningPath.created_at.desc())
        .first()
    )
    if not path:
        # Auto generate first path
        path = learning_path_service.generate_personalized_path(db, current_user.id)

    out = format_learning_path_out(path, db)
    return APIResponse(success=True, message="Learning path retrieved", data=out)

@router.post("/generate", response_model=APIResponse[LearningPathOut])
def generate_new_learning_path(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    path = learning_path_service.generate_personalized_path(db, current_user.id)
    out = format_learning_path_out(path, db)
    return APIResponse(success=True, message="Personalized learning path generated", data=out)

@router.post("/week/{week_id}/topic/{topic_id}/toggle", response_model=APIResponse[dict])
def toggle_topic(
    week_id: int,
    topic_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = learning_path_service.toggle_topic_completion(db, current_user.id, week_id, topic_id)
        return APIResponse(success=True, message="Topic completion status updated", data=result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/week/{week_id}/status", response_model=APIResponse[dict])
def update_week_status(
    week_id: int,
    payload: dict = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    week = db.query(LearningPathWeek).filter(LearningPathWeek.id == week_id).first()
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")

    new_status = payload.get("status")
    if new_status in ("Locked", "In Progress", "Completed"):
        week.status = new_status
        if new_status == "Completed":
            week.progress = 100
        db.commit()

    return APIResponse(success=True, message="Week status updated", data={"status": week.status, "progress": week.progress})
