"""Production settings — all secrets via environment variables."""

from __future__ import annotations

import os
from pathlib import Path

from .base import *  # noqa: F403

DEBUG = False

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "")
if not SECRET_KEY:
    raise RuntimeError("DJANGO_SECRET_KEY is required in production")

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if h.strip()
]

CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.environ.get("DJANGO_CSRF_TRUSTED_ORIGINS", "").split(",")
    if o.strip()
]

# Database: DATABASE_URL (Postgres) or SQLite fallback for single-node deploys
_database_url = os.environ.get("DATABASE_URL", "").strip()
if _database_url:
    # Minimal URL parser without dj-database-url dependency
    # postgres://user:pass@host:port/db
    import urllib.parse

    u = urllib.parse.urlparse(_database_url)
    DATABASES = {  # noqa: F405
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": u.path.lstrip("/") or "petfit",
            "USER": u.username or "",
            "PASSWORD": u.password or "",
            "HOST": u.hostname or "",
            "PORT": str(u.port or ""),
        }
    }
    if "django.contrib.postgres" not in INSTALLED_APPS:  # noqa: F405
        INSTALLED_APPS = [*INSTALLED_APPS, "django.contrib.postgres"]  # noqa: F405
else:
    DATABASES = {  # noqa: F405
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": Path(BASE_DIR) / "data" / "db.sqlite3",  # noqa: F405
        }
    }

# CORS — GitHub Pages + local
_cors = [
    o.strip()
    for o in os.environ.get(
        "CORS_ALLOWED_ORIGINS",
        "https://alinikkhah2001.github.io,http://127.0.0.1:5173,http://localhost:5173",
    ).split(",")
    if o.strip()
]
CORS_ALLOWED_ORIGINS = _cors
CORS_ALLOWED_ORIGIN_REGEXES = [  # noqa: F405
    r"^https://.*\.github\.io$",
    r"^http://(127\.0\.0\.1|localhost):\d+$",
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "1") == "1"
CSRF_COOKIE_SECURE = os.environ.get("CSRF_COOKIE_SECURE", "1") == "1"

# WhiteNoise for static files behind gunicorn
MIDDLEWARE = [  # noqa: F405
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    *MIDDLEWARE[1:],  # noqa: F405
]
STORAGES["staticfiles"]["BACKEND"] = (  # noqa: F405
    "whitenoise.storage.CompressedStaticFilesStorage"
)

WAGTAILADMIN_BASE_URL = os.environ.get(
    "WAGTAILADMIN_BASE_URL", "http://127.0.0.1:8000"
)

# Integrations
KAVENEGAR_API_KEY = os.environ.get("KAVENEGAR_API_KEY", "")
KAVENEGAR_OTP_TEMPLATE = os.environ.get("KAVENEGAR_OTP_TEMPLATE", "")
KAVENEGAR_SENDER = os.environ.get("KAVENEGAR_SENDER", "")
PETFIT_EXPOSE_OTP = os.environ.get("PETFIT_EXPOSE_OTP", "0") == "1"

ZARINPAL_MERCHANT_ID = os.environ.get("ZARINPAL_MERCHANT_ID", "")
ZARINPAL_SANDBOX = os.environ.get("ZARINPAL_SANDBOX", "1") == "1"
ZARINPAL_CALLBACK_URL = os.environ.get("ZARINPAL_CALLBACK_URL", "")
PETFIT_FRONTEND_URL = os.environ.get(
    "PETFIT_FRONTEND_URL", "https://alinikkhah2001.github.io/petfitfood"
)
