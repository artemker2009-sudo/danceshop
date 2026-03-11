from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.security import (
    create_access_token,
    hash_password,
    normalize_phone,
    verify_password,
)
from ...models.user import User
from ...schemas.auth import Token, UserLogin, UserOut, UserRegister
from ..deps import get_current_user, get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(body: UserRegister, db: AsyncSession = Depends(get_db)):
    try:
        phone = normalize_phone(body.phone_number)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    exists = (
        await db.execute(select(User).where(User.phone_number == phone))
    ).scalar_one_or_none()
    if exists:
        raise HTTPException(
            status_code=409, detail="Этот номер телефона уже зарегистрирован"
        )

    user = User(
        phone_number=phone,
        password_hash=hash_password(body.password),
        name=body.name,
        city=body.city,
        telegram=body.telegram,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return Token(access_token=create_access_token(str(user.id)))


@router.post("/login", response_model=Token)
async def login(body: UserLogin, db: AsyncSession = Depends(get_db)):
    try:
        phone = normalize_phone(body.phone_number)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    user = (
        await db.execute(select(User).where(User.phone_number == phone))
    ).scalar_one_or_none()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=401, detail="Неверный номер телефона или пароль"
        )

    return Token(access_token=create_access_token(str(user.id)))


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=current_user.id,
        phone_number=current_user.phone_number,
        name=current_user.name,
        city=current_user.city,
        telegram=current_user.telegram,
        avatar_url=current_user.avatar_url,
        created_at=current_user.created_at,
    )
