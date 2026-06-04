from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class LeadSummarizeRequest(BaseModel):
    raw_input: str = Field(..., min_length=1)


class LeadResponse(BaseModel):
    id: UUID
    raw_input: str
    name: str
    interest: str
    budget: str | None = None
    urgency: str
    priority_score: int
    summary: str | None = None
    recommended_action: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
