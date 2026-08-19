from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from .config import settings
from .routers import admin, public

app = FastAPI(
    title="AMPRIC API",
    docs_url="/docs" if settings.ENV != "production" else None,
    redoc_url="/redoc" if settings.ENV != "production" else None,
    openapi_url="/openapi.json" if settings.ENV != "production" else None,
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    same_site="lax",
    https_only=settings.ENV == "production",
)

app.include_router(public.router)
app.include_router(admin.router)

if settings.FRONTEND_DIST.exists():
    assets_dir = settings.FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    dist_root = settings.FRONTEND_DIST.resolve()

    @app.get("/{full_path:path}")
    def spa(full_path: str):
        candidate = (dist_root / full_path).resolve()
        if full_path and candidate.is_relative_to(dist_root) and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(dist_root / "index.html")
