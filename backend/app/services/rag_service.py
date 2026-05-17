import chromadb

from app.core.config import settings
from app.services.embedding_service import create_embedding

COLLECTION_NAME = "documents_gemini"


def get_chroma_client():
    return chromadb.PersistentClient(path=settings.chroma_dir)


def get_collection():
    return get_chroma_client().get_or_create_collection(name=COLLECTION_NAME)


def store_document_chunks(doc_id: str, chunks: list[str], embeddings: list[list[float]], metadata: list[dict] = None):
    """
    Store document chunks and their embeddings in ChromaDB.
    """
    collection = get_collection()

    ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
    
    # If no metadata provided, create default ones
    if metadata is None:
        metadata = [{"doc_id": doc_id} for _ in range(len(chunks))]
    else:
        # Ensure each metadata dict has doc_id
        for m in metadata:
            m["doc_id"] = doc_id

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadata
    )

def query_documents(query_embedding: list[float], n_results: int = 5, filter: dict = None):
    """
    Query the vector database for similar document chunks.
    """
    collection = get_collection()
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where=filter
    )
    
    return results

def delete_document_from_rag(doc_id: str):
    """
    Delete all chunks associated with a document ID from ChromaDB.
    """
    collection = get_collection()
    collection.delete(where={"doc_id": doc_id})


def delete_document_chunks(doc_id: str):
    """
    Backward-compatible name used by the documents route.
    """
    delete_document_from_rag(doc_id)

def search_similar_chunks(question: str, n_results:int = 5) -> list[dict]:
    query_embedding = create_embedding(question, task_type="RETRIEVAL_QUERY")

    results = query_documents(
        query_embedding=query_embedding,
        n_results=n_results,
    )
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    
    matches= []
    for index, document_text in enumerate(documents):
        metadata = metadatas[index] if index < len(metadatas) else {}
        distance = distances[index] if index < len(distances) else None

        matches.append({
            "text" : document_text,
            "metadata": metadata,
            "distance": distance, 
        })
    return matches


