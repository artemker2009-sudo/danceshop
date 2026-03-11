"""Populate the database with test data (mirrors frontend mock-data.ts)."""

import asyncio

import bcrypt
from sqlalchemy import text

from app.database import async_session, engine, Base
from app.models.user import User
from app.models.product import (
    Product,
    ProductImage,
    CategoryEnum,
    ConditionEnum,
    ProgramEnum,
    GenderEnum,
    FederationEnum,
)

HASH = bcrypt.hashpw(b"test1234", bcrypt.gensalt()).decode()

SELLERS = [
    {
        "phone_number": "+79161234567",
        "name": "Елена Волкова",
        "city": "Москва",
        "telegram": "@elena_dance",
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    {
        "phone_number": "+79219876543",
        "name": "Дмитрий Кузнецов",
        "city": "Санкт-Петербург",
        "telegram": "@dima_ballroom",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
        "phone_number": "+79135551234",
        "name": "Анна Соколова",
        "city": "Новосибирск",
        "telegram": "@anna_dance_nsk",
        "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
        "phone_number": "+78432223344",
        "name": "Михаил Петров",
        "city": "Казань",
        "telegram": "@misha_dance",
        "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
]

PRODUCTS = [
    {
        "title": "Платье для латины Chrisanne Clover",
        "price": 45_000,
        "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
        "category": CategoryEnum.competition,
        "condition": ConditionEnum.used,
        "program": ProgramEnum.standard,
        "gender": GenderEnum.woman,
        "size": "S",
        "height": "164-170 см",
        "federation": FederationEnum.FTSARR,
        "description": "Продаю турнирное платье для латиноамериканской программы от Chrisanne Clover. Было надето на 3 турнира, состояние отличное. Ткань — лайкра с декоративной бахромой, украшено стразами Preciosa. Цвет — чёрный с золотым. Подходит под правила ФТСАРР для категории Взрослые-Б. Возможна примерка в Москве.",
        "views": 142,
        "seller_idx": 0,
        "images": [
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=1000&fit=crop",
        ],
    },
    {
        "title": "Фрак мужской International Dance Shoes",
        "price": 62_000,
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
        "category": CategoryEnum.competition,
        "condition": ConditionEnum.new,
        "program": ProgramEnum.standard,
        "gender": GenderEnum.man,
        "size": "48",
        "height": "178-182 см",
        "federation": FederationEnum.WDSF,
        "description": "Новый мужской фрак для стандартной программы от IDS. Ни разу не надевался — не подошёл размер. Классический чёрно-белый, пошив Великобритания. Полностью соответствует правилам WDSF. В комплекте: фрак, жилет, бабочка. Готов отправить транспортной компанией или встретиться в СПб.",
        "views": 89,
        "seller_idx": 1,
        "images": [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
        ],
    },
    {
        "title": "Тренировочная юбка для стандарта",
        "price": 4_500,
        "image_url": "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&h=800&fit=crop",
        "category": CategoryEnum.practice,
        "condition": ConditionEnum.new,
        "program": ProgramEnum.standard,
        "gender": GenderEnum.woman,
        "size": "M",
        "height": "160-168 см",
        "federation": None,
        "description": "Новая тренировочная юбка-годе для стандартной программы. Ткань бифлекс, красиво летит в движении. Цвет — тёмно-синий. Длина до щиколотки. Подходит для тренировок и открытых уроков. Пояс на резинке. Отправлю почтой или СДЭК.",
        "views": 67,
        "seller_idx": 2,
        "images": [
            "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=1000&fit=crop",
        ],
    },
    {
        "title": "Рубашка-боди для латины (мальчик)",
        "price": 3_200,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop",
        "category": CategoryEnum.practice,
        "condition": ConditionEnum.used,
        "program": ProgramEnum.latin,
        "gender": GenderEnum.boy,
        "size": "134",
        "height": "128-134 см",
        "federation": None,
        "description": "Тренировочная рубашка-боди для мальчика, латиноамериканская программа. Носили один сезон, состояние хорошее, без дефектов. Цвет белый, ткань стрейч. Удобные кнопки снизу. Ребёнок вырос, поэтому продаём. Находимся в Казани, возможна отправка.",
        "views": 34,
        "seller_idx": 3,
        "images": [
            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1000&fit=crop",
        ],
    },
    {
        "title": "Платье стандарт юниоры Aida",
        "price": 38_000,
        "image_url": "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&h=800&fit=crop",
        "category": CategoryEnum.competition,
        "condition": ConditionEnum.used,
        "program": ProgramEnum.standard,
        "gender": GenderEnum.girl,
        "size": "152",
        "height": "146-152 см",
        "federation": FederationEnum.RTS,
        "description": "Красивое конкурсное платье для стандарта. Производство — ателье Aida (Москва). Нежно-голубой цвет, украшение стразами Swarovski по лифу и рукавам. Платье в идеальном состоянии, надевалось 5 раз. Допуск РТС, категория Юниоры-1. Рекомендую! Примерка в Москве по договорённости.",
        "views": 215,
        "seller_idx": 0,
        "images": [
            "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1000&fit=crop",
        ],
    },
    {
        "title": "Тренировочные брюки мужские Espen",
        "price": 7_800,
        "image_url": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop",
        "category": CategoryEnum.practice,
        "condition": ConditionEnum.new,
        "program": ProgramEnum.standard,
        "gender": GenderEnum.man,
        "size": "50",
        "height": "176-180 см",
        "federation": None,
        "description": "Новые тренировочные брюки для стандарта от Espen Salberg. Куплены в Лондоне, не подошёл размер (маломерят). Чёрные, прямого кроя, очень комфортная ткань с лёгким стрейчем. Идеальны для ежедневных тренировок. Отправлю в любой город.",
        "views": 53,
        "seller_idx": 1,
        "images": [
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop",
        ],
    },
    {
        "title": "Костюм латина женский со стразами Swarovski",
        "price": 85_000,
        "image_url": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&h=800&fit=crop",
        "category": CategoryEnum.competition,
        "condition": ConditionEnum.new,
        "program": ProgramEnum.latin,
        "gender": GenderEnum.woman,
        "size": "S",
        "height": "168-174 см",
        "federation": FederationEnum.FTSARR,
        "description": "Абсолютно новый конкурсный костюм для латины. Пошив на заказ в ателье Chrisanne (Лондон). Полностью расшит стразами Swarovski — около 3000 камней. Цвет — красно-чёрный градиент. Бахрома ручной работы. Создан для категории Взрослые по правилам ФТСАРР. Продаю, так как заказали два платья и выбрали другое. Торг уместен.",
        "views": 312,
        "seller_idx": 2,
        "images": [
            "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=1000&fit=crop",
        ],
    },
    {
        "title": "Топ тренировочный для латины (девочка)",
        "price": 2_900,
        "image_url": "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=800&fit=crop",
        "category": CategoryEnum.practice,
        "condition": ConditionEnum.new,
        "program": ProgramEnum.latin,
        "gender": GenderEnum.girl,
        "size": "140",
        "height": "134-140 см",
        "federation": None,
        "description": "Новый тренировочный топ для латины, подойдёт девочке 8-10 лет. Чёрный, с длинным рукавом, ткань — бифлекс. Хорошо тянется, не сковывает движения. Можно носить с юбкой или леггинсами. Покупали для дочки, но быстро выросла. Отправим из Казани.",
        "views": 41,
        "seller_idx": 3,
        "images": [
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&h=1000&fit=crop",
        ],
    },
]


async def seed() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        await session.execute(text("TRUNCATE product_images, products, users CASCADE"))

        users: list[User] = []
        for s in SELLERS:
            u = User(password_hash=HASH, **s)
            session.add(u)
            users.append(u)
        await session.flush()

        for p_data in PRODUCTS:
            seller = users[p_data.pop("seller_idx")]
            image_urls: list[str] = p_data.pop("images")
            product = Product(seller_id=seller.id, **p_data)
            session.add(product)
            await session.flush()

            for pos, url in enumerate(image_urls):
                session.add(ProductImage(product_id=product.id, url=url, position=pos))

        await session.commit()
    print("Seeded 4 users + 8 products.")


if __name__ == "__main__":
    asyncio.run(seed())
