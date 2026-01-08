import uuid
from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base

class StreakData(Base):
    __tablename__ = "streak_data"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_entries = Column(Integer, default=0)
    last_entry_date = Column(Date, nullable=True)
    
    user = relationship("User", back_populates="streak_data")
