from contextlib import contextmanager

import psycopg2
import psycopg2.extras
from fastapi import HTTPException

from .config import settings


def get_connection():
    return psycopg2.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        dbname=settings.DB_NAME,
        cursor_factory=psycopg2.extras.RealDictCursor,
        connect_timeout=5,
    )


@contextmanager
def db_cursor(commit: bool = False):
    connexion = None
    cursor = None
    try:
        connexion = get_connection()
        cursor = connexion.cursor()
        yield cursor
        if commit:
            connexion.commit()
    except (psycopg2.OperationalError, psycopg2.InterfaceError) as exc:
        raise HTTPException(
            status_code=503,
            detail="La base ne répond pas. Rechargez la page dans un instant.",
        ) from exc
    finally:
        if cursor is not None:
            cursor.close()
        if connexion is not None:
            connexion.close()


def check_duplicate_number(tel: str, exclude_id: int | None = None) -> bool:
    query = "select id from utilisateurs where telephone = %s"
    params: list = [tel]
    if exclude_id is not None:
        query += " and id != %s"
        params.append(exclude_id)
    with db_cursor() as cursor:
        cursor.execute(query, tuple(params))
        return cursor.fetchone() is not None


def check_duplicate_email(email: str, exclude_id: int | None = None) -> bool:
    query = "select id from utilisateurs where email = %s"
    params: list = [email]
    if exclude_id is not None:
        query += " and id != %s"
        params.append(exclude_id)
    with db_cursor() as cursor:
        cursor.execute(query, tuple(params))
        return cursor.fetchone() is not None
