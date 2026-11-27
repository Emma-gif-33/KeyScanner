import os
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
TEMP_SCANS_DIR = os.path.join(PROJECT_ROOT, "temp_scans")


class Settings(BaseSettings):
    APP_NAME: str = "KeyScanner"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    POSTGRES_USER: str = "keyscanner_user"
    POSTGRES_PASSWORD: str = "keyscanner_password"
    POSTGRES_DB: str = "keyscanner_db"
    POSTGRES_PORT: int = 5432
    POSTGRES_HOST: str = "localhost"

    DATABASE_URL: str = "postgresql+asyncpg://keyscanner_user:keyscanner_password@localhost:5432/keyscanner_db"
    SYNC_DATABASE_URL: str = "postgresql://keyscanner_user:keyscanner_password@localhost:5432/keyscanner_db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def ensure_asyncpg_scheme(cls, v: str) -> str:
        """Convierte automáticamente postgres:// o postgresql:// (ej. Railway) a postgresql+asyncpg://."""
        if isinstance(v, str):
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql+asyncpg://", 1)
            if v.startswith("postgresql://"):
                return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    SECRET_KEY: str = "secret_key_keyscanner_dev_only_change_in_production_min32chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Lista explícita de orígenes permitidos para CORS (separados por coma) - Mitigación OWASP A05:2021 (CWE-942)
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        """Devuelve la lista sanitizada de dominios permitidos para CORS (sin comodines inseguros)."""
        origins = [
            origin.strip().rstrip("/")
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip() and origin.strip() != "*"
        ]
        return origins or ["http://localhost:3000"]

    TEMP_SCANS_BASE_DIR: str = TEMP_SCANS_DIR

    model_config = SettingsConfigDict(
        env_file=os.path.join(PROJECT_ROOT, ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
