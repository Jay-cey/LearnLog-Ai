import asyncio
import os
import sys
import uuid
from datetime import date

# Add the parent directory to sys.path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from backend.app.database import AsyncSessionLocal
from backend.app.models.user import User
from backend.app.models.entry import Entry
from backend.app.services.gamification import gamification_service
from backend.app.models.achievement import UserAchievement, Achievement

from sqlalchemy import select, delete

async def main():
    print("Starting reproduction script...")
    async with AsyncSessionLocal() as db:
        # 1. Create a test user
        user_id = uuid.uuid4()
        print(f"Creating test user {user_id}...")
        
        user = User(
            id=user_id, 
            email=f"test_{user_id}@example.com", 
            name="Test User",
            provider="local",
            provider_id=f"local_{user_id}"
        )
        db.add(user)
        try:
            await db.commit()
            print("User created.")
        except Exception as e:
            print(f"Failed to create user: {e}")
            return
        
        try:
            # 2. Mimic creating an entry
            print("Creating an entry...")
            entry = Entry(
                user_id=user_id,
                content="This is a test entry for achievement debugging.",
                embedding=[0.0] * 384, # Mock embedding, correct dimension
                date=date.today(),
                word_count=10
            )
            db.add(entry)
            await db.commit()
            print("Entry created.")
            
            # 3. Call check_achievements (mimicking entries.py)
            print("Checking achievements...")
            new_unlocks = await gamification_service.check_achievements(user_id, db)
            print(f"New unlocks: {new_unlocks}")
            
            # 4. Verify in DB
            result = await db.execute(
                select(UserAchievement)
                .join(Achievement)
                .where(UserAchievement.user_id == user_id)
            )
            unlocked = result.scalars().all()
            print(f"Total unlocked achievements in DB: {len(unlocked)}")
            
        except Exception as e:
            print(f"Error during testing: {e}")
            import traceback
            traceback.print_exc()
        finally:
            # Cleanup
            print("Cleaning up...")
            try:
                await db.execute(delete(UserAchievement).where(UserAchievement.user_id == user_id))
                await db.execute(delete(Entry).where(Entry.user_id == user_id))
                await db.execute(delete(User).where(User.id == user_id))
                await db.commit()
                print("Cleanup done.")
            except Exception as e:
                print(f"Cleanup failed: {e}")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
