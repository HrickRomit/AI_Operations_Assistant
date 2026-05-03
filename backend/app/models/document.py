from sqlalchemy import Column, Text, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    filename = Column(Text, nullable=False)
    storage_url = Column(Text, nullable=False)

    chunk_count = Column(Integer, default=0)
    status = Column(String(50), default="processing")

    uploaded_at = Column(TIMESTAMP, server_default=func.now())