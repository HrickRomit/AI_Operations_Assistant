from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.document import Document
from app.services.rag_service import delete_document_chunks
from app.services.upload_service import process_uploaded_document


router = APIRouter(
    prefix="/documents",
    tags=["documents"],
)


@router.get("/")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.uploaded_at.desc()).all()

    return [
        {
            "id": str(doc.id),
            "filename": doc.filename,
            "status": doc.status,
            "chunk_count": doc.chunk_count,
            "uploaded_at": doc.uploaded_at,
        }
        for doc in docs
    ]


@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        document = process_uploaded_document(file, db)

        return {
            "message": "File uploaded and processed successfully",
            "document_id": str(document.id),
            "filename": document.filename,
            "status": document.status,
            "chunk_count": document.chunk_count,
        }

    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("/{doc_id}")
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == doc_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    delete_document_chunks(str(document.id))

    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}