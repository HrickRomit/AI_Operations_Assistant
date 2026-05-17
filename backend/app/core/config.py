from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/ai_ops"
    secret_key: str = "super-secret-key-for-dev"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )
    OPENAI_API_KEY: str = ""
    chroma_dir: str = "chroma_db"
    upload_dir: str = "uploads"


settings = Settings()
