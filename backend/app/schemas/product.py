from datetime import datetime
from uuid import UUID

from fastapi import Form
from pydantic import BaseModel

from ..models.product import (
    CategoryEnum,
    ConditionEnum,
    FederationEnum,
    GenderEnum,
    ProgramEnum,
    StatusEnum,
)


class ProductCreate:
    """
    Collects multipart/form-data fields for product creation.
    Used as a FastAPI dependency (not a Pydantic model) because
    Pydantic cannot parse Form fields mixed with UploadFile in one body.
    """

    def __init__(
        self,
        title: str = Form(..., max_length=255),
        price: int = Form(..., gt=0),
        category: CategoryEnum = Form(...),
        condition: ConditionEnum = Form(...),
        program: ProgramEnum = Form(...),
        gender: GenderEnum = Form(...),
        size: str = Form(..., max_length=20),
        height: str | None = Form(None, max_length=30),
        federation: FederationEnum | None = Form(None),
        description: str | None = Form(None),
    ) -> None:
        self.title = title
        self.price = price
        self.category = category
        self.condition = condition
        self.program = program
        self.gender = gender
        self.size = size
        self.height = height
        self.federation = federation
        self.description = description


class SellerBrief(BaseModel):
    id: UUID
    name: str
    city: str | None = None
    phone: str
    telegram: str | None = None
    avatar_url: str | None = None
    created_at: datetime
    listings_count: int


class ProductOut(BaseModel):
    id: UUID
    title: str
    price: int
    image_url: str
    images: list[str]
    category: CategoryEnum
    condition: ConditionEnum
    program: ProgramEnum
    gender: GenderEnum
    size: str
    height: str | None = None
    federation: FederationEnum | None = None
    status: StatusEnum
    description: str | None = None
    video_url: str | None = None
    views: int
    created_at: datetime
    seller: SellerBrief


class ProductListOut(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    limit: int
