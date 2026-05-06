from annotated_types import doc
from fastapi import APIRouter, Depends, UploadFile, File , HTTPException
from sqlalchemy.orm import Session
import os
import shutil
import uuid

from app.core.database import get_db
from app.models.document import Document


router = APIRouter(
    prefix="/documents",
    tags=["documents"],
)

upload_folder = "uploads"

os.makedirs(upload_folder, exist_ok=True)


@router.get("/")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).all()
    return [{
        "id" : str(doc.id),
        "filename" : doc.filename,
       "status" : doc.status,
        "uploaded_at" : doc.uploaded_at
    }
    for doc in docs 
    ]


@router.post("/upload")
def upload_document(file: UploadFile = File(...),
                db:Session = Depends(get_db)):
    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    fake_user_id = uuid.UUID("11111111-1111-1111-1111-111111111111")

    new_doc = Document(
        user_id = fake_user_id,
        filename = file.filename,
        storage_url = file_path,
        status = "ready"
    )


    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {
        "message": "File uploaded successfully",
        "document_id" : str(new_doc.id),
        "filename": file.filename
    }


@router.delete("/{doc_id}")
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if os.path.exists(doc.storage_url):
        os.remove(doc.storage_url)

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}