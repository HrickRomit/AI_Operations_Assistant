from pydantic import BaseModel

class ChatQueryRequest(BaseModel):
    question: str

class Source(BaseModel):
    document_id:str | None = None
    filename: str | None = None
    chunk_index: int | None = None
    preview: str

class ChatQueryResponse(BaseModel):
    answer: str
    sources: list[Source] 
