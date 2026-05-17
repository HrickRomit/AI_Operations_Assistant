from openai import OpenAI

from app.core.config import settings

EMBEDDING_MODEL = "text-embedding-3-small"


def get_openai_client() -> OpenAI:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is required to create document embeddings.")

    return OpenAI(api_key=settings.OPENAI_API_KEY)


def create_embedding(text:str)-> list[float]:
    client = get_openai_client()

    response = client.embeddings.create(
        model = EMBEDDING_MODEL,
        input = text,
    )
    return response.data[0].embedding


def create_embeddings(texts:list[str]) -> list[list[float]]:
    if not texts:
        return []

    client = get_openai_client()
    
    response = client.embeddings.create(
        model = EMBEDDING_MODEL,
        input = texts,
    )

    return [item.embedding for item in response.data]
