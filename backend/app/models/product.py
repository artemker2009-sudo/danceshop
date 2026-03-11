import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


# ── Python enums (values match PostgreSQL native ENUMs) ──────────


class CategoryEnum(str, enum.Enum):
    competition = "competition"
    practice = "practice"


class ConditionEnum(str, enum.Enum):
    new = "new"
    used = "used"


class ProgramEnum(str, enum.Enum):
    standard = "standard"
    latin = "latin"


class GenderEnum(str, enum.Enum):
    boy = "boy"
    girl = "girl"
    man = "man"
    woman = "woman"


class FederationEnum(str, enum.Enum):
    FTSARR = "FTSARR"
    RTS = "RTS"
    WDSF = "WDSF"
    any = "any"


class StatusEnum(str, enum.Enum):
    active = "active"
    sold = "sold"
    hidden = "hidden"


# ── Product ──────────────────────────────────────────────────────


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid()
    )
    seller_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[CategoryEnum] = mapped_column(
        Enum(CategoryEnum, name="category_enum", native_enum=True), nullable=False
    )
    condition: Mapped[ConditionEnum] = mapped_column(
        Enum(ConditionEnum, name="condition_enum", native_enum=True), nullable=False
    )
    program: Mapped[ProgramEnum] = mapped_column(
        Enum(ProgramEnum, name="program_enum", native_enum=True), nullable=False
    )
    gender: Mapped[GenderEnum] = mapped_column(
        Enum(GenderEnum, name="gender_enum", native_enum=True), nullable=False
    )
    size: Mapped[str] = mapped_column(String(20), nullable=False)
    height: Mapped[str | None] = mapped_column(String(30))
    federation: Mapped[FederationEnum | None] = mapped_column(
        Enum(FederationEnum, name="federation_enum", native_enum=True), nullable=True
    )
    status: Mapped[StatusEnum] = mapped_column(
        Enum(StatusEnum, name="status_enum", native_enum=True),
        nullable=False,
        server_default="active",
    )
    description: Mapped[str | None] = mapped_column(Text)
    video_url: Mapped[str | None] = mapped_column(Text)
    views: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    seller: Mapped["User"] = relationship(back_populates="products")  # noqa: F821
    images: Mapped[list["ProductImage"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductImage.position",
    )


# ── ProductImage ─────────────────────────────────────────────────


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid()
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    url: Mapped[str] = mapped_column(Text, nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    product: Mapped["Product"] = relationship(back_populates="images")
