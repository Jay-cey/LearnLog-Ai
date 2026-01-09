from pydantic_settings import BaseSettings

from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "LearnLog AI"
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/learnlog" # Default for local
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60 # 30 days
    
    @field_validator("DATABASE_URL")
    @classmethod
    def assemble_db_connection(cls, v: str | None) -> str:
        if not v:
            return v
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://", 1)
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
