import re
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from ..config import settings

_NON_DIGIT = re.compile(r"\D")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(
    subject: str, expires_delta: timedelta | None = None
) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    return jwt.encode(
        {"sub": subject, "exp": expire},
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def decode_access_token(token: str) -> dict:
    """Raises jose.JWTError on invalid / expired token."""
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])


def normalize_phone(raw: str) -> str:
    """
    Strip formatting and normalise to +7XXXXXXXXXX.

    Accepts:  "+7 (916) 123-45-67"  →  "+79161234567"
              "8 916 123 45 67"     →  "+79161234567"
              "79161234567"         →  "+79161234567"
    """
    digits = _NON_DIGIT.sub("", raw)
    if digits.startswith("8") and len(digits) == 11:
        digits = "7" + digits[1:]
    if not digits.startswith("7") or len(digits) != 11:
        raise ValueError(
            "Номер телефона должен быть российским (+7… или 8…, 11 цифр)"
        )
    return "+" + digits
