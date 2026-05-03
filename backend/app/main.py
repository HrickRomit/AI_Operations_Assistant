from fastapi import FastAPI

from app.core.database import check_database_connection

app = FastAPI(title="AI Operations Assistant API")


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
