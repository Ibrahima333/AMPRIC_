import secrets
import time
from collections import defaultdict

from fastapi import Depends, HTTPException, Request, Response

from .config import settings

CSRF_COOKIE_NAME = "csrf_token"
CSRF_HEADER_NAME = "x-csrf-token"

LOGIN_MAX_ATTEMPTS = 5
LOGIN_WINDOW_SECONDS = 300

_login_attempts: dict[str, list[float]] = defaultdict(list)


def enforce_login_rate_limit(request: Request) -> None:
    ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    attempts = _login_attempts[ip]
    attempts[:] = [t for t in attempts if now - t < LOGIN_WINDOW_SECONDS]
    if len(attempts) >= LOGIN_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Trop de tentatives de connexion. Reessayez dans quelques minutes.",
        )


def register_login_attempt(request: Request) -> None:
    ip = request.client.host if request.client else "unknown"
    _login_attempts[ip].append(time.monotonic())


def clear_login_attempts(request: Request) -> None:
    ip = request.client.host if request.client else "unknown"
    _login_attempts.pop(ip, None)


def verify_admin_credentials(username: str, password: str) -> bool:
    valid_username = secrets.compare_digest(username, settings.ADMIN_USERNAME)
    valid_password = secrets.compare_digest(password, settings.ADMIN_PASSWORD)
    return valid_username and valid_password


def ensure_csrf_cookie(request: Request, response: Response) -> str:
    token = request.session.get("_csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        request.session["_csrf_token"] = token
    response.set_cookie(
        CSRF_COOKIE_NAME,
        token,
        httponly=False,
        samesite="lax",
        secure=settings.ENV == "production",
    )
    return token


def verify_csrf(request: Request) -> None:
    session_token = request.session.get("_csrf_token")
    header_token = request.headers.get(CSRF_HEADER_NAME, "")
    if not session_token or not header_token or not secrets.compare_digest(session_token, header_token):
        raise HTTPException(status_code=400, detail="Jeton CSRF invalide ou manquant.")


def admin_required(request: Request) -> None:
    if not request.session.get("dashboard_authenticated"):
        raise HTTPException(status_code=401, detail="Veuillez vous connecter pour accéder au dashboard.")


CsrfDep = Depends(verify_csrf)
AdminDep = Depends(admin_required)
LoginRateLimitDep = Depends(enforce_login_rate_limit)
