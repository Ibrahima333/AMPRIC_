from contextlib import contextmanager

import pymysql
import pymysql.cursors

from .config import settings


def get_connection():
    return pymysql.connect(
        host=settings.DB_HOST,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME,
        cursorclass=pymysql.cursors.DictCursor,
        charset="utf8mb4",
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
