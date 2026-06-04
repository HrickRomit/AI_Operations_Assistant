from fastapi import APIRouter, Depends, HTTPException

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
    current_user: User = Depends(get_current_user)
):
    try:
        result = answer_question(payload.question, user_id=str(current_user.id))
        return result

    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc