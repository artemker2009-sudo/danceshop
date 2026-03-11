from pydantic import model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/prodance"
    cors_origins: list[str] = ["http://localhost:3000"]
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7

    # Yandex Object Storage (S3-compatible)
    s3_endpoint_url: str = "https://storage.yandexcloud.net"
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_bucket_name: str = "prodance-market"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @model_validator(mode="after")
    def _fix_database_url(self) -> "Settings":
        url = self.database_url
        if url.startswith("postgresql://"):
            self.database_url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            self.database_url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        return self


settings = Settings()
