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
