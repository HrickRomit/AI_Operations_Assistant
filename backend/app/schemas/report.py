from pydantic import BaseModel, Field


class ReportSummaryRequest(BaseModel):
    raw_text: str = Field(..., min_length=1)


class ReportSummaryResponse(BaseModel):
    summary: str
