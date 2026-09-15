from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    topic = Column(String(100), default="General")
    difficulty = Column(String(50), default="Medium")  # Easy, Medium, Hard
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    document = relationship("Document", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(Text, nullable=False)  # JSON string array of 4 choices
    correct_answer = Column(Integer, nullable=False)  # 0, 1, 2, or 3
    explanation = Column(Text, nullable=True)
    topic = Column(String(100), default="General")
    difficulty = Column(String(50), default="Medium")

    # Relationships
    quiz = relationship("Quiz", back_populates="questions")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    time_taken_seconds = Column(Integer, default=0)
    topic_breakdown = Column(Text, nullable=True)  # JSON string of topic scores
    completed_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")
    answers = relationship("QuizAttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")

class QuizAttemptAnswer(Base):
    __tablename__ = "quiz_attempt_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, nullable=False)
    selected_option = Column(Integer, nullable=False)
    is_correct = Column(Integer, nullable=False)  # 1 or 0

    # Relationships
    attempt = relationship("QuizAttempt", back_populates="answers")
