"""Initial schema

Revision ID: 001
Revises:
Create Date: 2026-03-10
"""
from typing import Sequence, Union

from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_DDL = [
    # ENUMs
    "CREATE TYPE category_enum   AS ENUM ('competition', 'practice')",
    "CREATE TYPE condition_enum  AS ENUM ('new', 'used')",
    "CREATE TYPE program_enum    AS ENUM ('standard', 'latin')",
    "CREATE TYPE gender_enum     AS ENUM ('boy', 'girl', 'man', 'woman')",
    "CREATE TYPE federation_enum AS ENUM ('FTSARR', 'RTS', 'WDSF', 'any')",
    "CREATE TYPE status_enum     AS ENUM ('active', 'sold', 'hidden')",

    # users
    """CREATE TABLE users (
        id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_number  VARCHAR(20)  NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name          VARCHAR(100) NOT NULL,
        city          VARCHAR(100),
        telegram      VARCHAR(100),
        avatar_url    TEXT,
        created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
        updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
    )""",
    "CREATE INDEX idx_users_phone ON users (phone_number)",

    # products
    """CREATE TABLE products (
        id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id   UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title       VARCHAR(255)    NOT NULL,
        price       INTEGER         NOT NULL CHECK (price > 0),
        image_url   TEXT            NOT NULL,
        category    category_enum   NOT NULL,
        condition   condition_enum  NOT NULL,
        program     program_enum    NOT NULL,
        gender      gender_enum     NOT NULL,
        size        VARCHAR(20)     NOT NULL,
        height      VARCHAR(30),
        federation  federation_enum,
        status      status_enum     NOT NULL DEFAULT 'active',
        description TEXT,
        views       INTEGER         NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ     NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ     NOT NULL DEFAULT now()
    )""",
    "CREATE INDEX idx_products_seller   ON products (seller_id)",
    "CREATE INDEX idx_products_category ON products (category)",
    "CREATE INDEX idx_products_program  ON products (program)",
    "CREATE INDEX idx_products_price    ON products (price)",
    "CREATE INDEX idx_products_filter   ON products (category, condition, program, federation)",

    # product_images
    """CREATE TABLE product_images (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        url        TEXT        NOT NULL,
        position   INTEGER     NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )""",
    "CREATE INDEX idx_product_images_product ON product_images (product_id)",
]

_DOWNGRADE = [
    "DROP TABLE IF EXISTS product_images",
    "DROP TABLE IF EXISTS products",
    "DROP TABLE IF EXISTS users",
    "DROP TYPE IF EXISTS status_enum",
    "DROP TYPE IF EXISTS federation_enum",
    "DROP TYPE IF EXISTS gender_enum",
    "DROP TYPE IF EXISTS program_enum",
    "DROP TYPE IF EXISTS condition_enum",
    "DROP TYPE IF EXISTS category_enum",
]


def upgrade() -> None:
    for stmt in _DDL:
        op.execute(stmt)


def downgrade() -> None:
    for stmt in _DOWNGRADE:
        op.execute(stmt)
