import smtplib
from email.message import EmailMessage

from .config import settings


def send_contact_mail(nom: str, email: str, message: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = f"Message de {nom}"
    msg["From"] = settings.MAIL_USERNAME
    msg["To"] = settings.CONTACT_RECIPIENT
    msg.set_content(
        f"""
Nom: {nom}
Email: {email}

Message:
{message}
"""
    )

    with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
        if settings.MAIL_USE_TLS:
            server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.send_message(msg)


def send_new_registration_mail(
    nom: str, prenom: str, telephone: str, email: str, comment: str | None
) -> None:
    """Notify the AMPRIC team when someone registers through the public form."""
    msg = EmailMessage()
    msg["Subject"] = f"Nouvelle inscription — {prenom} {nom}"
    msg["From"] = settings.MAIL_USERNAME
    msg["To"] = settings.CONTACT_RECIPIENT
    msg["Reply-To"] = email
    msg.set_content(
        f"""Une nouvelle personne vient de s'inscrire sur le site AMPRIC.

Nom complet : {prenom} {nom}
E-mail : {email}
Téléphone : {telephone}
Message : {comment or "Aucun message renseigné."}

Vous pouvez répondre directement à cet e-mail pour contacter la personne.

Consultez toutes les inscriptions dans le tableau de bord :
https://ampric-mali.com/dashboard

"""
    )

    with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
        if settings.MAIL_USE_TLS:
            server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.send_message(msg)
