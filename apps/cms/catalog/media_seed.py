"""Import files from the storefront public/ folder into Wagtail Images."""

from __future__ import annotations

import os
from pathlib import Path

from django.core.files.images import ImageFile
from wagtail.images.models import Image


def media_roots() -> list[Path]:
    roots: list[Path] = []
    env = os.environ.get("SEED_MEDIA_ROOT", "").strip()
    if env:
        roots.append(Path(env))
    # apps/cms/catalog/media_seed.py → apps/web/public
    mono = Path(__file__).resolve().parents[2] / "web" / "public"
    roots.append(mono)
    roots.append(Path("/seed_media"))
    return roots


def resolve_public_file(rel_path: str) -> Path | None:
    clean = rel_path.lstrip("/")
    for root in media_roots():
        candidate = root / clean
        if candidate.is_file():
            return candidate
    return None


def get_or_create_wagtail_image(rel_path: str, title: str | None = None) -> Image | None:
    path = resolve_public_file(rel_path)
    if path is None:
        return None

    name = title or path.stem
    existing = Image.objects.filter(title=name).first()
    if existing:
        return existing

    with path.open("rb") as handle:
        image = Image(title=name)
        image.file = ImageFile(handle, name=path.name)
        image.save()
    return image
