from google import genai
from google.genai import types

from app.core.config import settings


def get_gemini_client() -> genai.Client:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is required to create document embeddings.")

    return genai.Client(api_key=settings.GEMINI_API_KEY)


def create_embedding(text: str, task_type: str = "RETRIEVAL_QUERY") -> list[float]:
    client = get_gemini_client()

    response = client.models.embed_content(
        model=settings.gemini_embedding_model,
        contents=text,
        config=types.EmbedContentConfig(task_type=task_type),
    )

    return response.embeddings[0].values


def create_embeddings(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    client = get_gemini_client()

    response = client.models.embed_content(
        model=settings.gemini_embedding_model,
        contents=texts,
        config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
    )

    return [embedding.values for embedding in response.embeddings]
