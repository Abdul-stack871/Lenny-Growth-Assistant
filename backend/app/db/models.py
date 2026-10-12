import datetime
import uuid
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.session import Base

def gen_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False, default="New Strategy Session")
    model_id = Column(String(64), nullable=False, default="ollama-llama-3-2")
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    conversation_id = Column(String(64), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(32), nullable=False) # 'user' | 'assistant'
    content = Column(Text, nullable=False)
    citations_json = Column(Text, nullable=True) # JSON encoded list of citations
    suggested_actions_json = Column(Text, nullable=True) # JSON encoded actions
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    conversation = relationship("Conversation", back_populates="messages")

class Essay(Base):
    __tablename__ = "essays"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    topic = Column(String(255), nullable=False)
    format = Column(String(32), default="ship30")
    length = Column(String(32), default="~1,250 words")
    word_count = Column(Integer, default=1250)
    reading_time_minutes = Column(Integer, default=5)
    tone = Column(String(32), default="practical")
    hero_image_url = Column(String(512), nullable=True)
    hero_quote = Column(String(512), nullable=True)
    table_of_contents_json = Column(Text, nullable=True)
    quote_callout_json = Column(Text, nullable=True)
    citations_json = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    template = Column(String(64), nullable=False)
    type = Column(String(32), default="html") # html, react, svg
    code = Column(Text, nullable=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

class TranscriptChunk(Base):
    __tablename__ = "transcript_chunks"

    id = Column(String(64), primary_key=True)
    episode_number = Column(Integer, nullable=False)
    episode_title = Column(String(255), nullable=False)
    guest = Column(String(128), nullable=False)
    timestamp_start = Column(String(32), nullable=False)
    timestamp_end = Column(String(32), nullable=False)
    audio_seconds = Column(Integer, nullable=False, default=0)
    topic_tags = Column(String(255), nullable=True)
    quote = Column(Text, nullable=False)
    text = Column(Text, nullable=False)
