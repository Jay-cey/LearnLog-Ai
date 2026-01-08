import uuid
from sqlalchemy import Column, Text, Date, DateTime, Integer, Float, ForeignKey, Index, func, String
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from ..database import Base

class Entry(Base):
    __tablename__ = "entries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(384), nullable=False)
    date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Metadata
    word_count = Column(Integer, nullable=False, default=0)
    ai_score = Column(Float, nullable=True)
    tags = Column(JSONB, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="entries")
    
    __table_args__ = (
        Index('idx_user_date', 'user_id', 'date'),
        Index('idx_embedding_ivfflat', 'embedding', postgresql_using='ivfflat', postgresql_with={'lists': 100}),
    )

class RejectionLog(Base):
    __tablename__ = "rejection_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(Text, nullable=False)
    reason = Column(String(50), nullable=False) # 'generic', 'duplicate', 'too_short'
    similarity_score = Column(Float, nullable=True)
    rejected_at = Column(DateTime(timezone=True), server_default=func.now())
