from math import ceil

from fastapi import APIRouter, Query, Request, Response

from ..db import check_duplicate_email, check_duplicate_number, db_cursor
from ..schemas import LoginIn, UserIn
from ..security import (
    AdminDep,
    CsrfDep,
    LoginRateLimitDep,
    clear_login_attempts,
    ensure_csrf_cookie,
    register_login_attempt,
    verify_admin_credentials,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])

PER_PAGE = 7


@router.get("/session")
def session_status(request: Request, response: Response):
    ensure_csrf_cookie(request, response)
    return {"authenticated": bool(request.session.get("dashboard_authenticated"))}


@router.post("/login", dependencies=[CsrfDep, LoginRateLimitDep])
def login(payload: LoginIn, request: Request):
    if verify_admin_credentials(payload.username, payload.password):
        request.session["dashboard_authenticated"] = True
        clear_login_attempts(request)
        return {"ok": True, "category": "success", "message": "Connexion réussie."}
    register_login_attempt(request)
    return {"ok": False, "category": "error", "message": "Identifiants incorrects."}


@router.post("/logout", dependencies=[CsrfDep, AdminDep])
def logout(request: Request):
    request.session.pop("dashboard_authenticated", None)
    return {"ok": True, "category": "success", "message": "Déconnexion réussie."}


@router.get("/users", dependencies=[AdminDep])
def list_users(search: str = "", page: int = Query(default=1, ge=1), edit: int | None = None):
    search = search.strip()
    offset = (page - 1) * PER_PAGE
    search_clause = ""
    search_params: list = []

    if search:
        search_clause = """
            WHERE nom LIKE %s
            OR prenom LIKE %s
            OR telephone LIKE %s
            OR email LIKE %s
            OR comment LIKE %s
        """
        search_value = f"%{search}%"
        search_params = [search_value] * 5

    with db_cursor() as cursor:
        cursor.execute(f"SELECT COUNT(*) AS total FROM utilisateurs {search_clause}", tuple(search_params))
        total_users = cursor.fetchone()["total"]

        cursor.execute(
            f"""
            SELECT id, nom, prenom, telephone, email, comment, date_inscription
            FROM utilisateurs
            {search_clause}
            ORDER BY id DESC
            LIMIT %s OFFSET %s
            """,
            tuple(search_params + [PER_PAGE, offset]),
        )
        users = cursor.fetchall()

        editing_user = None
        if edit is not None:
            cursor.execute(
                "SELECT id, nom, prenom, telephone, email, comment FROM utilisateurs WHERE id = %s",
                (edit,),
            )
            editing_user = cursor.fetchone()

    total_pages = max(ceil(total_users / PER_PAGE), 1)

    return {
        "users": users,
        "total_users": total_users,
        "current_page": page,
        "total_pages": total_pages,
        "per_page": PER_PAGE,
        "search": search,
        "editing_user": editing_user,
    }


@router.post("/users", dependencies=[AdminDep, CsrfDep])
def create_user(payload: UserIn):
    if check_duplicate_number(payload.telephone):
        return {"ok": False, "category": "error", "message": "Ce numéro est déjà utilisé."}

    if check_duplicate_email(payload.email):
        return {"ok": False, "category": "error", "message": "Cet email est déjà utilisé."}

    with db_cursor(commit=True) as cursor:
        cursor.execute(
            """
            insert into utilisateurs (nom, prenom, telephone, email, comment)
            values (%s, %s, %s, %s, %s)
            """,
            (payload.nom, payload.prenom, payload.telephone, payload.email, payload.comment),
        )

    return {"ok": True, "category": "success", "message": "Utilisateur ajouté avec succès."}


@router.put("/users/{user_id}", dependencies=[AdminDep, CsrfDep])
def update_user(user_id: int, payload: UserIn):
    if check_duplicate_number(payload.telephone, exclude_id=user_id):
        return {"ok": False, "category": "error", "message": "Ce numéro est déjà utilisé."}

    if check_duplicate_email(payload.email, exclude_id=user_id):
        return {"ok": False, "category": "error", "message": "Cet email est déjà utilisé."}

    with db_cursor(commit=True) as cursor:
        cursor.execute(
            """
            UPDATE utilisateurs
            SET nom = %s, prenom = %s, telephone = %s, email = %s, comment = %s
            WHERE id = %s
            """,
            (payload.nom, payload.prenom, payload.telephone, payload.email, payload.comment, user_id),
        )

    return {"ok": True, "category": "success", "message": "Utilisateur mis à jour avec succès."}


@router.delete("/users/{user_id}", dependencies=[AdminDep, CsrfDep])
def delete_user(user_id: int):
    with db_cursor(commit=True) as cursor:
        cursor.execute("DELETE FROM utilisateurs WHERE id = %s", (user_id,))

    return {"ok": True, "category": "success", "message": "Utilisateur supprimé avec succès."}
