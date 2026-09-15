from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Competency(Base):
    __tablename__ = "competencies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill = Column(String(100), nullable=False)
    score = Column(Float, nullable=False, default=0.0)  # 0 to 100
    status = Column(String(50), default="Weak")         # Strong (80-100), Good (60-79), Needs Improvement (40-59), Weak (0-39)
    total_questions = Column(Integer, default=0)
    correct_questions = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="competencies")
