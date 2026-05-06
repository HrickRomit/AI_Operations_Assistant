from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import check_database_connection
from app.routes import documents

app = FastAPI(title="AI Operations Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)


@app.get("/")
def read_root():
    return {"message": "Backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def database_health():
    check_database_connection()
    return {"status": "ok", "database": "connected"}
