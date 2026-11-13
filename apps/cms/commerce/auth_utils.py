from __future__ import annotations

from django.http import HttpRequest
from django.utils import timezone

from commerce.models import AuthToken, Customer


def normalize_phone(raw: str) -> str:
    digits = "".join(ch for ch in raw if ch.isdigit())
    if digits.startswith("98") and len(digits) >= 12:
        digits = "0" + digits[2:]
    if digits.startswith("9") and len(digits) == 10:
        digits = "0" + digits
    return digits


def get_bearer_token(request: HttpRequest) -> str | None:
    header = request.META.get("HTTP_AUTHORIZATION", "")
    if header.lower().startswith("bearer "):
        return header[7:].strip() or None
    return request.headers.get("X-Auth-Token") or None


def customer_from_request(request: HttpRequest) -> Customer | None:
    key = get_bearer_token(request)
    if not key:
        return None
    try:
        token = AuthToken.objects.select_related("customer").get(key=key)
    except AuthToken.DoesNotExist:
        return None
    if not token.is_valid():
        return None
    return token.customer


def require_customer(request: HttpRequest) -> Customer | None:
    return customer_from_request(request)


def require_admin(request: HttpRequest) -> Customer | None:
    customer = customer_from_request(request)
    if customer and customer.is_admin:
        return customer
    return None


def purge_expired_tokens() -> None:
    AuthToken.objects.filter(expires_at__lt=timezone.now()).delete()
