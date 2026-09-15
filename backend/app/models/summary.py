from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), unique=True, nullable=False)
    overview = Column(Text, nullable=False)
    key_concepts = Column(Text, nullable=False)     # JSON string or newline delimited
    definitions = Column(Text, nullable=False)      # JSON string of terms & definitions
    key_takeaways = Column(Text, nullable=False)    # JSON string or newline delimited
    topic_summaries = Column(Text, nullable=True)   # JSON string of list of {topic, points}
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    document = relationship("Document", back_populates="summary")
