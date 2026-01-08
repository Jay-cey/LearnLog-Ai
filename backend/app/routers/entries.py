from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import date
from uuid import UUID
from ..database import get_db
from ..models.entry import Entry, RejectionLog
from ..schemas.entry import EntryCreate, EntryResponse
from ..services.ai_validator import ai_validator

router = APIRouter(prefix="/entries", tags=["entries"])

@router.post("/", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry: EntryCreate,
    user_id: UUID, # TODO: Remove this once Auth is implemented
    db: AsyncSession = Depends(get_db)
):
    # Validate with AI
    is_valid, reason, feedback = await ai_validator.validate_entry(
        entry.content, user_id, db
    )
    
    if not is_valid:
        # Log rejection
        rejection = RejectionLog(
            user_id=user_id,
            content=entry.content,
            reason=reason,
            similarity_score=0.9 # Placeholder
        )
        db.add(rejection)
        await db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                'reason': reason,
                'feedback': feedback
            }
        )
    
    # Create entry
    embedding = ai_validator.model.encode(entry.content)
    
    new_entry = Entry(
        user_id=user_id,
        content=entry.content,
        embedding=embedding,
        date=entry.date,
        word_count=len(entry.content.split())
    )
    
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    
    return new_entry

@router.get("/", response_model=List[EntryResponse])
async def list_entries(
    user_id: UUID, # TODO: Remove once Auth is ready
    search: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Entry).where(Entry.user_id == user_id)
    
    if search:
        # Simple case-insensitive search on content
        query = query.where(Entry.content.ilike(f"%{search}%"))
    
    if start_date:
        query = query.where(Entry.date >= start_date)
    
    if end_date:
        query = query.where(Entry.date <= end_date)
        
    query = query.order_by(Entry.date.desc())
    
    result = await db.execute(query)
    return result.scalars().all()
