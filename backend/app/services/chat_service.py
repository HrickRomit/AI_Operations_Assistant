from google import genai
from google.genai import types

from app.core.config import settings
from app.services.rag_service import search_similar_chunks


def get_gemini_client() -> genai.Client:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is required to use the chat service.")

    return genai.Client(api_key=settings.GEMINI_API_KEY)


def answer_question(question: str) -> dict:
    matches = search_similar_chunks(question, n_results=5)

    if not matches:
        return {
            "answer": "I could not find relevant information in the uploaded documents.",
            "sources": [],
        }

    context = build_context(matches)
    client = get_gemini_client()

    response = client.models.generate_content(
        model=settings.gemini_chat_model,
        contents=f"Context:\n{context}\n\nQuestion:\n{question}",
        config=types.GenerateContentConfig(
            system_instruction=(
                "You are a helpful AI assistant for a business knowledge base. "
                "Answer only using the provided document context. "
                "If the answer is not in the context, say you could not find it "
                "in the uploaded documents."
            ),
            temperature=0.2,
        ),
    )

    return {
        "answer": response.text or "I could not generate an answer.",
        "sources": build_sources(matches),
    }


def build_context(matches: list[dict]) -> str:
    context_blocks = []

    for index, match in enumerate(matches, start=1):
        metadata = match.get("metadata") or {}
        filename = metadata.get("filename", "Unknown file")
        chunk_index = metadata.get("chunk_index", "unknown")
        text = match.get("text", "")

        context_blocks.append(
            f"[Source {index}] File: {filename}, Chunk: {chunk_index}\n{text}"
        )

    return "\n\n".join(context_blocks)


def build_sources(matches: list[dict]) -> list[dict]:
    sources = []

    for match in matches:
        metadata = match.get("metadata") or {}
        text = match.get("text", "")

        sources.append(
            {
                "document_id": metadata.get("doc_id"),
                "filename": metadata.get("filename"),
                "chunk_index": metadata.get("chunk_index"),
                "preview": text[:220],
            }
        )

    return sources
