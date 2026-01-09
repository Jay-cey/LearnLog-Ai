import asyncio
import os
import sys

# Add the parent directory to sys.path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from backend.app.database import AsyncSessionLocal
# Import models to ensure they are registered with Base
from backend.app.models.user import User
from backend.app.models.achievement import Achievement, UserAchievement
from backend.app.models.entry import Entry
from backend.app.models.streak import StreakData

from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Achievement))
        achievements = result.scalars().all()
        print(f"Found {len(achievements)} achievements:")
        for a in achievements:
            print(f"- {a.name} (Criteria: {a.criteria})")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
