from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID
from ..database import get_db
from ..services.streak_calculator import calculate_streak

router = APIRouter(prefix="/streak", tags=["streak"])

@router.get("/")
async def get_streak(
    user_id: UUID, # TODO: Remove with Auth
    db: AsyncSession = Depends(get_db)
):
    current, longest = await calculate_streak(user_id, db)
    return {
        "current_streak": current, 
        "longest_streak": longest
    }
