from fastapi import APIRouter, Depends, HTTPException

from app.models.user import User
from app.routes.deps import get_current_user
from app.schemas.email import EmailDraftRequest, EmailDraftResponse
from app.services.email_service import generate_email_draft


router = APIRouter(prefix="/email", tags=["email"])


@router.post("/draft", response_model=EmailDraftResponse)
def draft_email(
    payload: EmailDraftRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        draft = generate_email_draft(payload.email_text, payload.tone)
        return {"draft": draft}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
