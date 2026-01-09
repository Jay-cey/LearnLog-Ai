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
from backend.app.models.achievement import UserAchievement
from backend.app.models.streak import StreakData
from backend.app.services.ai_validator import ai_validator
from sqlalchemy import delete

async def main():
    print("Starting duplicate reproduction script...")
    async with AsyncSessionLocal() as db:
        # 1. Create a test user
        user_id = uuid.uuid4()
        print(f"Creating test user {user_id}...")
        
        user = User(
            id=user_id, 
            email=f"test_dup_{user_id}@example.com", 
            name="Test User Dup",
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
            # 2. Create the first entry
            content = "Today I learned about vector databases. They are really cool for similarity search. I am writing more words to pass the minimum length requirement for this test."
            # Ensure it meets min word count (15)
            
            print(f"Content: {content}")
            print(f"Word count: {len(content.split())}")
            
            # Generate embedding
            print("Generating embedding...")
            embedding = ai_validator.model.encode(content)
            
            entry = Entry(
                user_id=user_id,
                content=content,
                embedding=embedding,
                date=date.today(),
                word_count=len(content.split())
            )
            db.add(entry)
            await db.commit()
            print("First entry created.")
            
            # 3. Validate the SAME content (should be duplicate)
            print("Verifying duplicate detection...")
            is_valid, reason, feedback = await ai_validator.validate_entry(
                content, user_id, db
            )
            
            print(f"Result: is_valid={is_valid}, reason={reason}")
            print(f"Feedback: {feedback}")
            
            if is_valid:
                print("FAILURE: Duplicate was NOT detected.")
            else:
                print("SUCCESS: Duplicate was detected.")
                
        except Exception as e:
            print(f"Error during testing: {e}")
            import traceback
            traceback.print_exc()
        finally:
            # Cleanup
            print("Cleaning up...")
            try:
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
