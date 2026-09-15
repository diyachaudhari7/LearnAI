from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.auth.deps import get_current_user
from app.schemas.schemas import APIResponse, SettingsUpdateRequest, UserOut

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("", response_model=APIResponse[dict])
def get_settings(current_user: User = Depends(get_current_user)):
    return APIResponse(
        success=True,
        message="Settings retrieved",
        data={
            "daily_goal_minutes": current_user.daily_goal_minutes,
            "preferred_difficulty": current_user.preferred_difficulty,
            "dark_mode": current_user.dark_mode,
            "email_notifications": current_user.email_notifications,
            "learning_reminders": current_user.learning_reminders,
            "quiz_reminders": current_user.quiz_reminders
        }
    )

@router.put("", response_model=APIResponse[dict])
def update_settings(
    settings_in: SettingsUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if settings_in.daily_goal_minutes is not None:
        current_user.daily_goal_minutes = settings_in.daily_goal_minutes
    if settings_in.preferred_difficulty is not None:
        current_user.preferred_difficulty = settings_in.preferred_difficulty
    if settings_in.dark_mode is not None:
        current_user.dark_mode = settings_in.dark_mode
    if settings_in.email_notifications is not None:
        current_user.email_notifications = settings_in.email_notifications
    if settings_in.learning_reminders is not None:
        current_user.learning_reminders = settings_in.learning_reminders
    if settings_in.quiz_reminders is not None:
        current_user.quiz_reminders = settings_in.quiz_reminders

    db.commit()
    db.refresh(current_user)

    return APIResponse(
        success=True,
        message="Settings saved successfully",
        data={
            "daily_goal_minutes": current_user.daily_goal_minutes,
            "preferred_difficulty": current_user.preferred_difficulty,
            "dark_mode": current_user.dark_mode,
            "email_notifications": current_user.email_notifications,
            "learning_reminders": current_user.learning_reminders,
            "quiz_reminders": current_user.quiz_reminders
        }
    )
