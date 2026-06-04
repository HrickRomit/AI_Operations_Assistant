import uuid

from sqlalchemy import Column, ForeignKey, String, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.sql import func

from app.core.database import Base


class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    source_doc_ids = Column(ARRAY(Text), default=list)
    module = Column(String(50), nullable=False, default="doc_qa")
    created_at = Column(TIMESTAMP, server_default=func.now())
