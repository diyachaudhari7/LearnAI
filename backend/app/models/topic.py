from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced
    importance = Column(String(50), default="High")          # High, Medium, Low
    description = Column(Text, nullable=True)

    # Relationships
    document = relationship("Document", back_populates="topics")
