import os
import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document
from app.services.embedding_service import create_embeddings
from app.services.rag_service import store_document_chunks
from app.services.document_parser import parse_document
from app.utils.chunker import chunk_text


FAKE_USER_ID = uuid.UUID("11111111-1111-1111-1111-111111111111")


def save_uploaded_file(file: UploadFile) -> str:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_filename = f"{uuid.uuid4()}_{Path(file.filename).name}"
    file_path = upload_dir / safe_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(file_path)


def process_uploaded_document(file: UploadFile, db: Session, user_id: uuid.UUID = FAKE_USER_ID) -> Document:
    """
    Save an uploaded file, create the database row, and run the RAG ingest pipeline.
    """
    file_path = save_uploaded_file(file)

    document = Document(
        user_id=user_id,
        filename=file.filename,
        storage_url=file_path,
        status="processing",
        chunk_count=0,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    try:
        process_document(db, document)
        db.refresh(document)
        return document
    except Exception:
        document.status = "error"
        document.chunk_count = 0
        db.commit()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise


def process_upload(db: Session, file: UploadFile, user_id: uuid.UUID = FAKE_USER_ID) -> Document:
    """
    Backward-compatible wrapper for older code that called process_upload.
    """
    return process_uploaded_document(file=file, db=db, user_id=user_id)


def process_document(db: Session, doc: Document) -> None:
    """
    Full pipeline: Parse -> Chunk -> Embed -> Store in vector database.
    """
    text = parse_document(doc.storage_url)
    chunks = chunk_text(text)

    if not chunks:
        doc.status = "error"
        doc.chunk_count = 0
        db.commit()
        raise ValueError("No readable text found in document.")

    embeddings = create_embeddings(chunks)

    metadata = [
        {
            "filename": doc.filename,
            "chunk_index": index,
        }
        for index in range(len(chunks))
    ]

    store_document_chunks(
        doc_id=str(doc.id),
        chunks=chunks,
        embeddings=embeddings,
        metadata=metadata,
    )

    doc.chunk_count = len(chunks)
    doc.status = "ready"
    db.commit()
