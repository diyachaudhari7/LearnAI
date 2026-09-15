from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.competency import Competency
from app.auth.deps import get_current_user
from app.schemas.schemas import APIResponse, CompetencyOut, CompetencyAnalysisOut
from app.services.competency_service import competency_service

router = APIRouter(prefix="/competency", tags=["Competency Analysis"])

@router.get("", response_model=APIResponse[CompetencyAnalysisOut])
def get_competency_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = competency_service.get_competency_analysis(db, current_user.id)
    out = CompetencyAnalysisOut(
        competencies=[CompetencyOut.from_orm(c) for c in analysis["competencies"]],
        strongest_skill=analysis["strongest_skill"],
        weakest_skill=analysis["weakest_skill"],
        ai_analysis=analysis["ai_analysis"],
        recommended_focus=analysis["recommended_focus"]
    )
    return APIResponse(success=True, message="Competency analysis retrieved", data=out)

@router.post("/recalculate", response_model=APIResponse[CompetencyAnalysisOut])
def recalculate_competency(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    competency_service.recalculate_user_competencies(db, current_user.id)
    analysis = competency_service.get_competency_analysis(db, current_user.id)
    out = CompetencyAnalysisOut(
        competencies=[CompetencyOut.from_orm(c) for c in analysis["competencies"]],
        strongest_skill=analysis["strongest_skill"],
        weakest_skill=analysis["weakest_skill"],
        ai_analysis=analysis["ai_analysis"],
        recommended_focus=analysis["recommended_focus"]
    )
    return APIResponse(success=True, message="Competencies recalculated from quiz performance", data=out)
