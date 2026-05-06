from sqlalchemy import Column, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False)
    password_hash = Column(String, nullable=False)
    business_name = Column(String(255))
    plan = Column(String(50), default="free")
    created_at = Column(TIMESTAMP, server_default=func.now())