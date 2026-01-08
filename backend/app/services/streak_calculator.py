from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import date, timedelta
from ..models.entry import Entry
from ..models.streak import StreakData
from uuid import UUID

async def calculate_streak(user_id: UUID, db: AsyncSession):
    # Get all unique entry dates for user, ordered descending
    result = await db.execute(
        select(Entry.date)
        .where(Entry.user_id == user_id)
        .distinct()
        .order_by(desc(Entry.date))
    )
    dates = [row[0] for row in result.fetchall()]
    
    if not dates:
        return 0, 0

    current_streak = 0
    today = date.today()
    
    # Check if last entry was today or yesterday
    if dates[0] == today or dates[0] == today - timedelta(days=1):
        current_streak = 1
        for i in range(len(dates) - 1):
            if dates[i] - dates[i+1] == timedelta(days=1):
                current_streak += 1
            else:
                break
    
    # Update StreakData table
    streak_data = await db.scalar(select(StreakData).where(StreakData.user_id == user_id))
    if not streak_data:
        streak_data = StreakData(user_id=user_id)
        db.add(streak_data)
    
    streak_data.current_streak = current_streak
    streak_data.last_entry_date = dates[0]
    streak_data.total_entries = len(dates) # or count all entries if multiple per day allowed
    
    if current_streak > streak_data.longest_streak:
        streak_data.longest_streak = current_streak
        
    await db.commit()
    return current_streak, streak_data.longest_streak
