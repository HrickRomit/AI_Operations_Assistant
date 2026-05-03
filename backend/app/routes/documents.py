from fastapi import APIRouter, UploadFile, File
import os
import shutil
router = APIRouter(
    prefix="/documents",
    tags=["documents"],
)

upload_folder = "uploads"

os.makedirs(upload_folder, exist_ok=True)


@router.get("/")
def list_documents():
    return {"message": "Documents route is working!"}


@router.post("/upload")
def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded successfully",
        "filename": file.filename
    }