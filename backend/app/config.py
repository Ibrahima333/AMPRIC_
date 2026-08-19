import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ROOT_ENV_FILE, extra="ignore")

    SECRET_KEY: str = os.urandom(24).hex()
    ENV: str = "development"

    DB_HOST: str
    DB_PORT: int = 5432
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_USE_TLS: bool = True
    MAIL_USERNAME: str
    MAIL_PASSWORD: str

    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str

    CONTACT_RECIPIENT: str = "contactampric@gmail.com"

    FRONTEND_DIST: Path = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"


settings = Settings()
