from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class UserRegister(BaseModel):
    phone_number: str
    password: str = Field(min_length=6)
    name: str = Field(min_length=1, max_length=100)
    city: str | None = None
    telegram: str | None = None


class UserLogin(BaseModel):
    phone_number: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: UUID
    phone_number: str
    name: str
    city: str | None = None
    telegram: str | None = None
    avatar_url: str | None = None
    created_at: datetime
