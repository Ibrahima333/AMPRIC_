from contextlib import contextmanager

import psycopg2
import psycopg2.extras

from .config import settings


def get_connection():
    return psycopg2.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        dbname=settings.DB_NAME,
        cursor_factory=psycopg2.extras.RealDictCursor,
    )


@contextmanager
def db_cursor(commit: bool = False):
    connexion = get_connection()
    try:
        cursor = connexion.cursor()
        yield cursor
        if commit:
            connexion.commit()
    finally:
        cursor.close()
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
