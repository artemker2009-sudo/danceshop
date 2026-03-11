from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ...core.storage import upload_file_to_s3, upload_many
from ...models.product import (
    CategoryEnum,
    ConditionEnum,
    FederationEnum,
    Product,
    ProductImage,
    ProgramEnum,
    StatusEnum,
)
from ...models.user import User
from ...schemas.product import ProductCreate, ProductListOut, ProductOut, SellerBrief
from ..deps import get_current_user, get_db

router = APIRouter(prefix="/products", tags=["products"])

_MAX_IMAGES = 10


# ─────────────────────── helpers ────────────────────────────────


def _build_product_out(product: Product, listings_count: int) -> ProductOut:
    return ProductOut(
        id=product.id,
        title=product.title,
        price=product.price,
        image_url=product.image_url,
        images=[img.url for img in product.images],
        category=product.category,
        condition=product.condition,
        program=product.program,
        gender=product.gender,
        size=product.size,
        height=product.height,
        federation=product.federation,
        status=product.status,
        description=product.description,
        video_url=product.video_url,
        views=product.views,
        created_at=product.created_at,
        seller=SellerBrief(
            id=product.seller.id,
            name=product.seller.name,
            city=product.seller.city,
            phone=product.seller.phone_number,
            telegram=product.seller.telegram,
            avatar_url=product.seller.avatar_url,
            created_at=product.seller.created_at,
            listings_count=listings_count,
        ),
    )


async def _listings_count(db: AsyncSession, seller_id: UUID) -> int:
    return (
        await db.execute(
            select(func.count())
            .select_from(Product)
            .where(
                Product.seller_id == seller_id,
                Product.status == StatusEnum.active,
            )
        )
    ).scalar_one()


# ─────────────────────── GET /products ──────────────────────────


@router.get("", response_model=ProductListOut)
async def list_products(
    db: AsyncSession = Depends(get_db),
    category: CategoryEnum | None = None,
    condition: list[ConditionEnum] | None = Query(None),
    program: list[ProgramEnum] | None = Query(None),
    federation: list[FederationEnum] | None = Query(None),
    price_min: int | None = None,
    price_max: int | None = None,
    search: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    filters = [Product.status == StatusEnum.active]

    if category:
        filters.append(Product.category == category)
    if condition:
        filters.append(Product.condition.in_(condition))
    if program:
        filters.append(Product.program.in_(program))
    if federation:
        filters.append(Product.federation.in_(federation))
    if price_min is not None:
        filters.append(Product.price >= price_min)
    if price_max is not None:
        filters.append(Product.price <= price_max)
    if search:
        filters.append(Product.title.ilike(f"%{search}%"))

    where = and_(*filters)

    total = (
        await db.execute(select(func.count()).select_from(Product).where(where))
    ).scalar_one()

    rows = (
        await db.execute(
            select(Product)
            .where(where)
            .options(selectinload(Product.seller), selectinload(Product.images))
            .order_by(Product.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
        )
    ).scalars().all()

    seller_ids = list({p.seller_id for p in rows})
    listings_map: dict[UUID, int] = {}
    if seller_ids:
        lc = await db.execute(
            select(Product.seller_id, func.count(Product.id))
            .where(
                Product.seller_id.in_(seller_ids),
                Product.status == StatusEnum.active,
            )
            .group_by(Product.seller_id)
        )
        listings_map = {row[0]: row[1] for row in lc.all()}

    items = [
        _build_product_out(p, listings_map.get(p.seller_id, 0)) for p in rows
    ]
    return ProductListOut(items=items, total=total, page=page, limit=limit)


# ─────────────────────── GET /products/{id} ─────────────────────


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product)
        .where(Product.id == product_id)
        .options(selectinload(Product.seller), selectinload(Product.images))
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.views += 1
    await db.commit()

    return _build_product_out(
        product, await _listings_count(db, product.seller_id)
    )


# ─────────────────────── POST /products ─────────────────────────


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate = Depends(),
    images: list[UploadFile] = File(..., description="Product photos (1–10 images)"),
    video: UploadFile | None = File(None, description="Optional product video (max 1)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    real_images = [f for f in images if f.filename]
    if not real_images:
        raise HTTPException(status_code=400, detail="At least one image is required")
    if len(real_images) > _MAX_IMAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {_MAX_IMAGES} images allowed, got {len(real_images)}",
        )

    urls = await upload_many(real_images)

    video_url: str | None = None
    if video and video.filename:
        video_url = await upload_file_to_s3(video)

    product = Product(
        seller_id=current_user.id,
        title=data.title,
        price=data.price,
        image_url=urls[0],
        category=data.category,
        condition=data.condition,
        program=data.program,
        gender=data.gender,
        size=data.size,
        height=data.height,
        federation=data.federation,
        description=data.description,
        video_url=video_url,
    )
    db.add(product)
    await db.flush()

    for pos, url in enumerate(urls):
        db.add(ProductImage(product_id=product.id, url=url, position=pos))

    await db.commit()

    # Re-fetch with relations for the response
    result = await db.execute(
        select(Product)
        .where(Product.id == product.id)
        .options(selectinload(Product.seller), selectinload(Product.images))
    )
    product = result.scalar_one()

    return _build_product_out(
        product, await _listings_count(db, current_user.id)
    )
