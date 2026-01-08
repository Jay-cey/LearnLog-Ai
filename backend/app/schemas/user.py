from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    image: Optional[str] = None

class UserCreate(UserBase):
    provider: str
    provider_id: str

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True
