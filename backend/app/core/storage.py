import logging
import uuid

import aioboto3
from botocore.config import Config as BotoConfig
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException, UploadFile

from ..config import settings

logger = logging.getLogger(__name__)

_ALLOWED_IMAGE_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "image/heic", "image/heif",
}
_ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/webm"}
_ALLOWED_CONTENT_TYPES = _ALLOWED_IMAGE_TYPES | _ALLOWED_VIDEO_TYPES
_MAX_IMAGE_SIZE = 10 * 1024 * 1024   # 10 MB per image
_MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100 MB per video

_S3_BOTO_CONFIG = BotoConfig(
    connect_timeout=10,
    read_timeout=30,
    retries={"max_attempts": 1},
)


def _make_key(original_filename: str, *, is_video: bool = False) -> str:
    """Generate a unique S3 object key that preserves the extension."""
    ext = ""
    if original_filename and "." in original_filename:
        ext = "." + original_filename.rsplit(".", 1)[-1].lower()
    folder = "videos" if is_video else "products"
    return f"{folder}/{uuid.uuid4()}{ext}"


def _public_url(key: str) -> str:
    base = settings.s3_endpoint_url.rstrip("/")
    return f"{base}/{settings.s3_bucket_name}/{key}"


async def upload_file_to_s3(file: UploadFile) -> str:
    """
    Upload a single UploadFile to Yandex Object Storage.
    Returns the public URL of the uploaded object.
    Raises HTTPException 400 on validation errors, 502 on S3 errors.
    """
    if file.content_type not in _ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. "
                   f"Allowed images: JPEG, PNG, WEBP, GIF, HEIC. "
                   f"Allowed video: MP4, MOV, WEBM.",
        )

    is_video = file.content_type in _ALLOWED_VIDEO_TYPES
    max_size = _MAX_VIDEO_SIZE if is_video else _MAX_IMAGE_SIZE

    data = await file.read()
    if len(data) > max_size:
        limit_mb = max_size // (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({len(data) // 1024} KB). Max {limit_mb} MB.",
        )

    key = _make_key(file.filename or ("video" if is_video else "image"), is_video=is_video)

    session = aioboto3.Session(
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key,
        region_name="ru-central1",
    )

    try:
        async with session.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            region_name="ru-central1",
            config=_S3_BOTO_CONFIG,
        ) as s3:
            await s3.put_object(
                Bucket=settings.s3_bucket_name,
                Key=key,
                Body=data,
                ContentType=file.content_type,
                ACL="public-read",
            )
    except ClientError as exc:
        logger.error("S3 ClientError uploading %s: %s", key, exc)
        raise HTTPException(
            status_code=502,
            detail=f"Failed to upload to storage: {exc.response['Error']['Message']}",
        ) from exc
    except (BotoCoreError, Exception) as exc:
        logger.error("S3 upload error for %s: %s", key, exc)
        raise HTTPException(
            status_code=502,
            detail=f"Storage upload failed: {type(exc).__name__}: {exc}",
        ) from exc

    return _public_url(key)


async def upload_many(files: list[UploadFile]) -> list[str]:
    """Upload multiple files concurrently. Returns list of public URLs."""
    import asyncio
    return await asyncio.gather(*[upload_file_to_s3(f) for f in files])
