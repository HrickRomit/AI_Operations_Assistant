from pydantic import BaseModel, Field


class EmailDraftRequest(BaseModel):
    email_text: str = Field(..., min_length=1)
    tone: str = "friendly"


class EmailDraftResponse(BaseModel):
    draft: str
