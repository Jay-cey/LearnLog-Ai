from pydantic import BaseModel, Field
from uuid import UUID
from datetime import date, datetime
from typing import Optional, Dict, Any

class EntryCreate(BaseModel):
    content: str = Field(..., min_length=10, max_length=2000)
    date: date

class EntryResponse(BaseModel):
    id: UUID
    content: str
    date: date
    word_count: int
    created_at: datetime
    ai_score: Optional[float] = None
    tags: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True
