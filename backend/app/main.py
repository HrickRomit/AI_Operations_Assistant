from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine, check_database_connection
from app.routes import documents, auth, chat
from app.models.user import User
from app.models.document import Document

app = FastAPI(title="AI Operations Assistant API")

# CORS must be added BEFORE routers are registered
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(chat.router)


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

