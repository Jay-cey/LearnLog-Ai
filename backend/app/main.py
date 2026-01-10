
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import structlog
import asyncio
import sys
from contextlib import asynccontextmanager
from sqlalchemy import select

from .models.achievement import Achievement
from .models.user import User
from .models.entry import Entry
from .models.streak import StreakData
from .database import engine, Base, AsyncSessionLocal
from .config import settings

logger = structlog.get_logger()

# Create tables and seed achievements on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Log startup info
    # Sanitize DATABASE_URL for logging
    db_url = settings.DATABASE_URL
    if db_url and ":" in db_url and "@" in db_url:
        # Simple masking of password
        try:
            part1 = db_url.split("@")[0]
            part2 = db_url.split("@")[1]
            if ":" in part1:
                user_pass = part1.split("://")[1]
                if ":" in user_pass:
                    user = user_pass.split(":")[0]
                    masked_url = f"{db_url.split('://')[0]}://{user}:****@{part2}"
                    logger.info("Starting up", database_url=masked_url)
                else:
                    logger.info("Starting up", database_url=db_url)
            else:
                logger.info("Starting up", database_url=db_url)
        except Exception:
             logger.info("Starting up", database_url="[PROTECTED]")
    else:
        logger.info("Starting up", database_url=db_url)

    # Retry mechanism for database connection
    max_retries = 5
    retry_delay = 5  # seconds

    for attempt in range(max_retries):
        try:
            logger.info(f"Connecting to database (Attempt {attempt + 1}/{max_retries})...")
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database connection established and tables verified.")
            break
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                await asyncio.sleep(retry_delay)
            else:
                logger.critical("Could not connect to the database after multiple attempts.")
                raise e
    
    # Simple Seed for Achievements (Prototype only)
    try:
        async with AsyncSessionLocal() as db:
            seeds = [
                Achievement(name="First Steps", description="Created your first entry.", icon_name="Footprints", criteria="FIRST_STEP"),
                Achievement(name="On Fire", description="Reached a 3-day streak.", icon_name="Flame", criteria="STREAK_3"),
                Achievement(name="Unstoppable", description="Reached a 7-day streak.", icon_name="Zap", criteria="STREAK_7"),
                Achievement(name="Wordsmith", description="Wrote 1000 total words.", icon_name="Feather", criteria="WORDS_1000"),
                Achievement(name="Journalist", description="Created 10 entries.", icon_name="BookOpen", criteria="ENTRIES_10"),
                Achievement(name="Monthly Master", description="Reached a 30-day streak.", icon_name="Crown", criteria="STREAK_30"),
            ]

            for seed in seeds:
                exists = await db.scalar(select(Achievement).where(Achievement.criteria == seed.criteria))
                if not exists:
                    db.add(seed)
                    print(f"Seeding achievement: {seed.name}")

            await db.commit()
    except Exception as e:
        logger.error(f"Error during seeding: {str(e)}")
        # Don't crash if seeding fails, just log it.
        pass

    yield

app = FastAPI(
    title="LearnLog AI API",
    description="Backend API for LearnLog AI",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://learn-log-ai.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to LearnLog AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

from .routers import entries, streaks, analytics, users, achievements

app.include_router(entries.router, prefix="/api/v1")
app.include_router(streaks.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(achievements.router, prefix="/api/v1")
