from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LearnLog AI"
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/learnlog" # Default for local
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60 # 30 days
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
