import uuid

from sqlalchemy import Column, ForeignKey, Integer, String, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.core.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    raw_input = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    interest = Column(Text, nullable=False)
    budget = Column(Text)
    urgency = Column(String(50), nullable=False, default="medium")
    priority_score = Column(Integer, nullable=False, default=5)
    summary = Column(Text)
    recommended_action = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
