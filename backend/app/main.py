
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import structlog
from contextlib import asynccontextmanager
from sqlalchemy import select

from .models.achievement import Achievement
from .models.user import User
from .models.entry import Entry
from .models.streak import StreakData
from .database import engine, Base, AsyncSessionLocal

logger = structlog.get_logger()

# Create tables and seed achievements on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Simple Seed for Achievements (Prototype only)
    async with AsyncSessionLocal() as db:
        existing = await db.scalar(select(Achievement))
        if not existing:
            seeds = [
                Achievement(name="First Steps", description="Created your first entry.", icon_name="Footprints", criteria="FIRST_STEP"),
                Achievement(name="On Fire", description="Reached a 3-day streak.", icon_name="Flame", criteria="STREAK_3"),
                Achievement(name="Unstoppable", description="Reached a 7-day streak.", icon_name="Zap", criteria="STREAK_7"),
            ]
            db.add_all(seeds)
            await db.commit()
            print("Seeded achievements.")

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

from .routers import entries, streaks, analytics, users

app.include_router(entries.router, prefix="/api/v1")
app.include_router(streaks.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
