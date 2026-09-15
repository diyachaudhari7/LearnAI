from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), default="Personalized Skill Roadmap")
    overview = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="learning_paths")
    weeks = relationship("LearningPathWeek", back_populates="learning_path", cascade="all, delete-orphan", order_by="LearningPathWeek.week_number")

class LearningPathWeek(Base):
    __tablename__ = "learning_path_weeks"

    id = Column(Integer, primary_key=True, index=True)
    learning_path_id = Column(Integer, ForeignKey("learning_paths.id", ondelete="CASCADE"), nullable=False)
    week_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="Locked")  # Completed, In Progress, Locked
    progress = Column(Integer, default=0)          # 0 to 100 percentage
    estimated_hours = Column(Integer, default=5)
    difficulty = Column(String(50), default="Intermediate")

    # Relationships
    learning_path = relationship("LearningPath", back_populates="weeks")
    topics = relationship("LearningPathTopic", back_populates="week", cascade="all, delete-orphan")

class LearningPathTopic(Base):
    __tablename__ = "learning_path_topics"

    id = Column(Integer, primary_key=True, index=True)
    week_id = Column(Integer, ForeignKey("learning_path_weeks.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    completed = Column(Boolean, default=False)

    # Relationships
    week = relationship("LearningPathWeek", back_populates="topics")
