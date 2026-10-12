import logging
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.db.session import engine, Base, SessionLocal
import backend.app.db.models  # Ensure models are registered on Base.metadata
from backend.app.rag.retrieval import init_transcripts_db
from backend.app.api.endpoints import chat, writing, artifacts, insights, transcripts

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("lenny_backend")

# Ensure database tables exist immediately on import
try:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as _db:
        init_transcripts_db(_db)
    logger.info("Database tables initialized and seeded successfully.")
except Exception as _e:
    logger.error(f"Error during database initialization: {_e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API and Autonomous Agent Layer for The Lenny Growth Assistant (Oogway Labs)",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive for local development & cross-port dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
async def health_check():
    # Ping Ollama status
    ollama_status = "disconnected"
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            res = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            if res.status_code == 200:
                ollama_status = "connected"
    except Exception:
        ollama_status = "disconnected"

    return {
        "status": "connected",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": "development",
        "database": "connected",
        "ollama": {
            "status": ollama_status,
            "endpoint": settings.OLLAMA_BASE_URL,
            "model": settings.OLLAMA_MODEL,
        },
        "cloud": {
            "anthropic": bool(settings.ANTHROPIC_API_KEY),
            "openai": bool(settings.OPENAI_API_KEY),
        }
    }

# Register Routers
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(writing.router, prefix="/api/v1/writing", tags=["Writing"])
app.include_router(artifacts.router, prefix="/api/v1/artifacts", tags=["Artifacts"])
app.include_router(insights.router, prefix="/api/v1/insights", tags=["Insights"])
app.include_router(transcripts.router, prefix="/api/v1/transcripts", tags=["Transcripts"])

@app.get("/")
def root():
    return {
        "message": "Welcome to The Lenny Growth Assistant API",
        "docs": "/docs",
        "health": "/api/v1/health",
    }
