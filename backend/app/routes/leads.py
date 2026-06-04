from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.lead import Lead
from app.models.user import User
from app.routes.deps import get_current_user
from app.schemas.lead import LeadResponse, LeadSummarizeRequest
from app.services.lead_service import analyze_lead


router = APIRouter(prefix="/leads", tags=["leads"])


@router.get("/", response_model=list[LeadResponse])
def list_leads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Lead)
        .filter(Lead.user_id == current_user.id)
        .order_by(Lead.created_at.desc())
        .all()
    )


@router.post("/summarize", response_model=LeadResponse)
def summarize_lead(
    payload: LeadSummarizeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        analysis = analyze_lead(payload.raw_input)
        lead = Lead(
            user_id=current_user.id,
            raw_input=payload.raw_input,
            **analysis,
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        return lead
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
