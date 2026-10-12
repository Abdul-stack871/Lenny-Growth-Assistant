import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

logger = logging.getLogger("lenny_backend.db")

Base = declarative_base()

# Attempt PostgreSQL first; seamlessly fall back to local SQLite if unavailable
engine = None
try:
    test_engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, connect_args={"connect_timeout": 2})
    with test_engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    engine = test_engine
    logger.info("Successfully connected to primary PostgreSQL database.")
except Exception as e:
    logger.warning(
        f"Could not connect to PostgreSQL ({settings.DATABASE_URL}): {e}. "
        f"Falling back to local SQLite storage ({settings.SQLITE_FALLBACK_URL})."
    )
    engine = create_engine(
        settings.SQLITE_FALLBACK_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
