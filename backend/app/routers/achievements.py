from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models.achievement import Achievement, UserAchievement
from uuid import UUID
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/achievements", tags=["achievements"])

class AchievementResponse(BaseModel):
    id: str
    name: str
    description: str
    icon_name: str
    criteria: str
    unlocked: bool
    unlocked_at: datetime | None = None
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[AchievementResponse])
async def get_user_achievements(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get all achievements with unlock status for a user"""
    # Get all achievements
    achievements_result = await db.execute(select(Achievement))
    all_achievements = achievements_result.scalars().all()
    
    # Get user's unlocked achievements
    user_achievements_result = await db.execute(
        select(UserAchievement).where(UserAchievement.user_id == user_id)
    )
    user_achievements = {ua.achievement_id: ua.unlocked_at for ua in user_achievements_result.scalars().all()}
    
    # Build response
    response = []
    for achievement in all_achievements:
        is_unlocked = achievement.id in user_achievements
        response.append(AchievementResponse(
            id=str(achievement.id),
            name=achievement.name,
            description=achievement.description,
            icon_name=achievement.icon_name,
            criteria=achievement.criteria,
            unlocked=is_unlocked,
            unlocked_at=user_achievements.get(achievement.id) if is_unlocked else None
        ))
    
    return response
