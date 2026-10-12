import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "The Lenny Growth Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database Configuration (PostgreSQL primary, SQLite auto-fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/lenny_growth")
    SQLITE_FALLBACK_URL: str = "sqlite:///./lenny_growth.db"
    
    # Local LLM Inference (Ollama)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:latest")
    
    # Cloud AI Provider Keys (Kept server-side only)
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS Origins for frontend clients
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
