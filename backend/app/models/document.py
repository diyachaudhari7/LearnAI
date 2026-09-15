from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_size = Column(Integer, default=0)
    page_count = Column(Integer, default=1)
    extracted_text = Column(Text, nullable=True)
    status = Column(String(50), default="processed")  # uploaded, processing, processed, failed
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="documents")
    topics = relationship("Topic", back_populates="document", cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="document", uselist=False, cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="document", cascade="all, delete-orphan")
    flashcards = relationship("Flashcard", back_populates="document", cascade="all, delete-orphan")
