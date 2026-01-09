from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, timedelta
from uuid import UUID
from ..database import get_db
from ..models.entry import Entry

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary")
async def get_analytics_summary(
    user_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    today = date.today()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Entries this week
    week_entries = await db.scalar(
        select(func.count(Entry.id))
        .where(Entry.user_id == user_id, Entry.date >= week_ago)
    )
    
    # Entries this month
    month_entries = await db.scalar(
        select(func.count(Entry.id))
        .where(Entry.user_id == user_id, Entry.date >= month_ago)
    )
    
    # Average word count
    avg_words = await db.scalar(
        select(func.avg(Entry.word_count))
        .where(Entry.user_id == user_id)
    )
    
    return {
        "entries_this_week": week_entries or 0,
        "entries_this_month": month_entries or 0,
        "avg_word_count": round(avg_words or 0, 1),
        "top_topics": ["Learning", "Coding", "Growth"] 
    }

@router.get("/stats")
async def get_user_stats(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get overall user statistics for dashboard"""
    # Total entries
    total_entries = await db.scalar(
        select(func.count(Entry.id)).where(Entry.user_id == user_id)
    )
    
    # Total words
    total_words = await db.scalar(
        select(func.sum(Entry.word_count)).where(Entry.user_id == user_id)
    )
    
    # Calculate level (1 level per 10 entries, starting at level 1)
    level = max(1, (total_entries or 0) // 10 + 1)
    
    return {
        "total_entries": total_entries or 0,
        "total_words": total_words or 0,
        "level": level,
    }

@router.get("/activity")
async def get_weekly_activity(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Returns daily word count and entry count for the last 7 days.
    """
    today = date.today()
    week_ago = today - timedelta(days=6) # Include today
    
    # Get entries
    entries = await db.execute(
        select(Entry.date, Entry.word_count)
        .where(Entry.user_id == user_id, Entry.date >= week_ago)
        .order_by(Entry.date)
    )
    
    # Process into daily map
    data_map = { (week_ago + timedelta(days=i)): {"date": (week_ago + timedelta(days=i)).strftime("%a"), "words": 0, "entries": 0} for i in range(7) }
    
    for row in entries.fetchall():
        entry_date = row.date
        if entry_date in data_map:
            data_map[entry_date]["words"] += row.word_count
            data_map[entry_date]["entries"] += 1
            
    return list(data_map.values())
