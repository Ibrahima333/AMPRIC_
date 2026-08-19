from fastapi import APIRouter, Request, Response

from ..db import check_duplicate_email, check_duplicate_number, db_cursor
from ..mail import send_contact_mail
from ..schemas import ContactIn, InterestIn
from ..security import CsrfDep, ensure_csrf_cookie

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/csrf")
def get_csrf(request: Request, response: Response):
    token = ensure_csrf_cookie(request, response)
    return {"csrf_token": token}


@router.post("/interest", dependencies=[CsrfDep])
def create_interest(payload: InterestIn):
    if check_duplicate_number(payload.tel):
        return {"ok": False, "category": "error", "message": "Ce numéro est déjà utilisé. Veuillez saisir un autre."}

    if check_duplicate_email(payload.email):
        return {"ok": False, "category": "error", "message": "Cet email est déjà utilisé. Veuillez saisir un autre."}

    with db_cursor(commit=True) as cursor:
        cursor.execute(
            "insert into utilisateurs (nom,prenom,telephone,email,comment) values(%s,%s,%s,%s,%s)",
            (payload.nom, payload.prenom, payload.tel, payload.email, payload.comment),
        )

    return {
        "ok": True,
        "category": "success",
        "message": "Vos informations ont été enregistrées avec succès. Notre équipe vous contactera dans les plus brefs délais.",
    }


@router.post("/contact", dependencies=[CsrfDep])
def contact(payload: ContactIn):
    send_contact_mail(payload.nom, payload.email, payload.message)
    return {"ok": True, "category": "success", "message": "Votre message a été envoyé avec succès."}
