from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.database import get_db
from app.models.user import User
from app.models.flashcard import Flashcard
from app.models.activity import UserActivity
from app.auth.deps import get_current_user
from app.schemas.schemas import APIResponse, FlashcardOut, FlashcardUpdate

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

@router.get("", response_model=APIResponse[List[FlashcardOut]])
def get_flashcards(
    document_id: Optional[int] = None,
    topic: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Flashcard).filter(Flashcard.user_id == current_user.id)
    if document_id:
        query = query.filter(Flashcard.document_id == document_id)
    if topic and topic.lower() != "all":
        query = query.filter(Flashcard.topic == topic)

    cards = query.order_by(Flashcard.created_at.desc()).all()
    return APIResponse(
        success=True,
        message="Flashcards retrieved",
        data=[FlashcardOut.from_orm(c) for c in cards]
    )

@router.put("/{card_id}", response_model=APIResponse[FlashcardOut])
def update_flashcard(
    card_id: int,
    update_data: FlashcardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(Flashcard.id == card_id, Flashcard.user_id == current_user.id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    if update_data.known is not None:
        card.known = update_data.known
        card.review_required = not update_data.known
    if update_data.review_required is not None:
        card.review_required = update_data.review_required

    db.commit()
    db.refresh(card)

    return APIResponse(
        success=True,
        message="Flashcard status updated",
        data=FlashcardOut.from_orm(card)
    )

@router.delete("/{card_id}", response_model=APIResponse[dict])
def delete_flashcard(
    card_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(Flashcard.id == card_id, Flashcard.user_id == current_user.id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    db.delete(card)
    db.commit()
    return APIResponse(success=True, message="Flashcard removed", data={"id": card_id})
