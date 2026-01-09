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
from backend.app.models.achievement import Achievement
from backend.app.services.gamification import gamification_service
from sqlalchemy import delete, select

async def main():
    print("Starting achievement verification...")
    async with AsyncSessionLocal() as db:
        # Seed first to make sure new achievements exist
        seeds = [
            Achievement(name="Wordsmith", description="Wrote 1000 total words.", icon_name="Feather", criteria="WORDS_1000"),
            Achievement(name="Journalist", description="Created 10 entries.", icon_name="BookOpen", criteria="ENTRIES_10"),
        ]
        for seed in seeds:
            exists = await db.scalar(select(Achievement).where(Achievement.criteria == seed.criteria))
            if not exists:
                db.add(seed)
        await db.commit()

        # 1. Create a test user
        user_id = uuid.uuid4()
        user = User(
            id=user_id, 
            email=f"achieve_{user_id}@example.com", 
            name="Achievement Test User",
            provider="local",
            provider_id=f"local_{user_id}"
        )
        db.add(user)
        try:
            await db.commit()
        except Exception as e:
            print(f"Failed to create user: {e}")
            return
        
        try:
            print(f"Created user {user_id}")
            
            # 2. Add entries to trigger WORDS_1000 (10 entries of 100 words)
            print("Creating entries to reach 1000 words...")
            for i in range(10):
                content = "word " * 100 # 100 words
                entry = Entry(
                    user_id=user_id,
                    content=content,
                    embedding=[0.0] * 384,
                    date=date.today(),
                    word_count=100
                )
                db.add(entry)
            await db.commit()
            
            # 3. Check achievements
            print("Checking achievements...")
            new_unlocks = await gamification_service.check_achievements(user_id, db)
            print(f"Unlocked: {new_unlocks}")
            
            # 4. Verify specific achievements
            if "Wordsmith" in new_unlocks and "Journalist" in new_unlocks:
                print("SUCCESS: Wordsmith and Journalist unlocked!")
            else:
                print("FAILURE: Did not unlock expected achievements.")
                
        except Exception as e:
            print(f"Error during testing: {e}")
            import traceback
            traceback.print_exc()
        finally:
            # Cleanup
            print("Cleaning up...")
            try:
                # Naive cleanup, relying on cascade if set, or just deleting specific tables
                await db.execute(delete(Entry).where(Entry.user_id == user_id))
                await db.execute(delete(User).where(User.id == user_id))
                # Note: UserAchievement should cascade delete or be cleaned up
                await db.commit()
                print("Cleanup done.")
            except Exception as e:
                print(f"Cleanup failed: {e}")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
