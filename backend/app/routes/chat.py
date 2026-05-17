from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatQueryRequest, ChatQueryResponse
from app.services.chat_service import answer_question


router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)


@router.post("/query", response_model=ChatQueryResponse)
def query_chat(payload: ChatQueryRequest):
    try:
        result = answer_question(payload.question)
        return result

    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc