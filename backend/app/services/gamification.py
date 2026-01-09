from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from ..models.achievement import Achievement, UserAchievement
from ..models.streak import StreakData
from ..models.entry import Entry

class GamificationService:
    async def check_achievements(self, user_id: UUID, db: AsyncSession):
        """
        Check and unlock achievements based on user activity.
        This should be called after critical actions (e.g. creating an entry).
        """
        # 1. Get User Data
        streak_data = await db.scalar(select(StreakData).where(StreakData.user_id == user_id))
        entry_count = await db.scalar(select(func.count()).select_from(Entry).where(Entry.user_id == user_id)) or 0
        
        # 2. Define Criteria (Hardcoded for prototype simplicity)
        # (Achievement Code, Condition)
        new_unlocks = []
        
        checks = [
            ("FIRST_STEP", True), # Always unlock on first check if they have an entry (assumed called after entry)
            ("STREAK_3", streak_data and streak_data.current_streak >= 3),
            ("STREAK_7", streak_data and streak_data.current_streak >= 7),
        ]

        # 3. Check against DB
        for code, condition in checks:
            if condition:
                await self._unlock_if_needed(user_id, code, db, new_unlocks)
        
        return new_unlocks

    async def _unlock_if_needed(self, user_id: UUID, code: str, db: AsyncSession, new_unlocks: list):
        # Find achievement definition
        achievement = await db.scalar(select(Achievement).where(Achievement.criteria == code))
        if not achievement:
            return

        # Check if already unlocked
        existing = await db.scalar(
            select(UserAchievement)
            .where(UserAchievement.user_id == user_id, UserAchievement.achievement_id == achievement.id)
        )
        
        if not existing:
            # Unlock!
            ua = UserAchievement(user_id=user_id, achievement_id=achievement.id)
            db.add(ua)
            await db.commit()
            new_unlocks.append(achievement.name)

gamification_service = GamificationService()
