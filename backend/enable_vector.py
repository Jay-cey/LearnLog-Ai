import asyncio
import os
import sys

# Add parent directory to path so we can import app modules if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Default to the local config if not provided
# For deployment, users should set DATABASE_URL env var or pass it as an argument
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/learnlog")

async def enable_vector(db_url):
    # Ensure we use the asyncpg driver
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")
    elif db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+asyncpg://")
        
    print(f"Connecting to: {db_url.split('@')[1] if '@' in db_url else 'DATABASE'}") # Mask credentials
    
    # Create a temporary engine just for this operation
    engine = create_async_engine(db_url, echo=True)
    
    try:
        async with engine.begin() as conn:
            print("Enabling pgvector extension...")
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            print("SUCCESS: pgvector extension enabled!")
    except Exception as e:
        print(f"ERROR: Failed to enable extension. {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        DATABASE_URL = sys.argv[1]
    
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(enable_vector(DATABASE_URL))
