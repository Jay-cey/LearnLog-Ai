from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserResponse
from uuid import UUID
import random

router = APIRouter(prefix="/users", tags=["users"])

# Available avatar options
AVATAR_OPTIONS = [
    "/images/avatar1.jpg",
    "/images/avatar2.jpg",
    "/images/avatar3.jpg",
]

@router.post("/sync", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def sync_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Sync user from OAuth provider. Creates user if doesn't exist, 
    returns existing user if already in database.
    """
    # Check if user exists by provider_id
    query = select(User).where(
        User.provider == user_data.provider,
        User.provider_id == user_data.provider_id
    )
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        # Update user info if changed
        existing_user.email = user_data.email
        existing_user.name = user_data.name
        # Only update image if a new one is provided
        if user_data.image:
            existing_user.image = user_data.image
        await db.commit()
        await db.refresh(existing_user)
        return existing_user
    
    # Create new user with random avatar if no image provided
    user_image = user_data.image or random.choice(AVATAR_OPTIONS)
    
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        image=user_image,
        provider=user_data.provider,
        provider_id=user_data.provider_id
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get user by UUID"""
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
