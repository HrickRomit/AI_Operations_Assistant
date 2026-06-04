from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.chatlog import ChatLog
from app.models.user import User
from app.routes.deps import get_current_user
from app.schemas.chat import ChatQueryRequest, ChatQueryResponse
from app.services.chat_service import answer_question


router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)


@router.post("/query", response_model=ChatQueryResponse)
def query_chat(
    payload: ChatQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        result = answer_question(payload.question, user_id=str(current_user.id))
        source_doc_ids = [
            source.get("document_id")
            for source in result.get("sources", [])
            if source.get("document_id")
        ]
        db.add(
            ChatLog(
                user_id=current_user.id,
                question=payload.question,
                answer=result.get("answer", ""),
                source_doc_ids=source_doc_ids,
                module="doc_qa",
            )
        )
        db.commit()
        return result

    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
