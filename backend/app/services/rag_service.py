import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings

# Initialize ChromaDB client
# Using PersistentClient for local storage
client = chromadb.PersistentClient(path=settings.chroma_dir)

def store_document_chunks(doc_id: str, chunks: list[str], embeddings: list[list[float]], metadata: list[dict] = None):
    """
    Store document chunks and their embeddings in ChromaDB.
    """
    # Create or get the collection
    # We can have one collection for all documents or one per user/document.
    # For now, let's use one collection named 'documents'
    collection = client.get_or_create_collection(name="documents")

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
    collection = client.get_or_create_collection(name="documents")
    
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
    collection = client.get_or_create_collection(name="documents")
    collection.delete(where={"doc_id": doc_id})


def delete_document_chunks(doc_id: str):
    """
    Backward-compatible name used by the documents route.
    """
    delete_document_from_rag(doc_id)
