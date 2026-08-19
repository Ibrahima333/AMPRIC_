from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


class InterestIn(BaseModel):
    nom: str = Field(min_length=1, max_length=50)
    prenom: str = Field(min_length=1, max_length=50)
    email: EmailStr
    tel: str = Field(min_length=1, max_length=15)
    comment: str | None = Field(default=None, max_length=200)


class ContactIn(BaseModel):
    nom: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=1)


class LoginIn(BaseModel):
    username: str
    password: str


class UserIn(BaseModel):
    nom: str = Field(min_length=1, max_length=50)
    prenom: str = Field(min_length=1, max_length=50)
    telephone: str = Field(min_length=1, max_length=15)
    email: EmailStr
    comment: str | None = None


class UserOut(BaseModel):
    id: int
    nom: str
    prenom: str
    telephone: str
    email: str
    comment: str | None
    date_inscription: datetime | date | None

    class Config:
        from_attributes = True
