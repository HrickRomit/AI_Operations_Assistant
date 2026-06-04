from fastapi import APIRouter, Depends, HTTPException

from app.models.user import User
from app.routes.deps import get_current_user
from app.schemas.report import ReportSummaryRequest, ReportSummaryResponse
from app.services.report_service import summarize_report


router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/summarize", response_model=ReportSummaryResponse)
def summarize(
    payload: ReportSummaryRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        summary = summarize_report(payload.raw_text)
        return {"summary": summary}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
