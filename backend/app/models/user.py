import uuid
from sqlalchemy import Column, String, DateTime, func, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    image = Column(String(500), nullable=True)
    provider = Column(String(50), nullable=False) # 'google', 'github'
    provider_id = Column(String(255), unique=True, nullable=False)
    
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    entries = relationship("Entry", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user") # Add this line
    streak_data = relationship("StreakData", back_populates="user", uselist=False, cascade="all, delete-orphan")
