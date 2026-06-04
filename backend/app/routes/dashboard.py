from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.chatlog import ChatLog
from app.models.document import Document
from app.models.lead import Lead
from app.models.user import User
from app.routes.deps import get_current_user
from app.schemas.dashboard import DashboardStats


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents_uploaded = (
        db.query(Document).filter(Document.user_id == current_user.id).count()
    )
    queries_made = (
        db.query(ChatLog).filter(ChatLog.user_id == current_user.id).count()
    )
    leads_captured = db.query(Lead).filter(Lead.user_id == current_user.id).count()

    return {
        "documents_uploaded": documents_uploaded,
        "queries_made": queries_made,
        "leads_captured": leads_captured,
    }
