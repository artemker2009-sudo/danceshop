from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import auth, products
from .config import settings


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield


app = FastAPI(title="ProDance Market API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
