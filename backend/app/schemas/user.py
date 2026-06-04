from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserBase(BaseModel):
    email: Optional[str] = None
    business_name: Optional[str] = None


class UserCreate(UserBase):
    email: str
    password: str
    business_name: str


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: UUID
    created_at: datetime
    plan: str

    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass
