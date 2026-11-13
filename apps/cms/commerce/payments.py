"""Zarinpal payment request/verify — sandbox when merchant unset or sandbox flag."""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any

from django.conf import settings


def _endpoints() -> tuple[str, str]:
    sandbox = bool(getattr(settings, "ZARINPAL_SANDBOX", True))
    if sandbox:
        return (
            "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
            "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
        )
    return (
        "https://api.zarinpal.com/pg/v4/payment/request.json",
        "https://api.zarinpal.com/pg/v4/payment/verify.json",
    )


def _start_pay_url(authority: str) -> str:
    sandbox = bool(getattr(settings, "ZARINPAL_SANDBOX", True))
    base = (
        "https://sandbox.zarinpal.com/pg/StartPay/"
        if sandbox
        else "https://www.zarinpal.com/pg/StartPay/"
    )
    return f"{base}{authority}"


def _post(url: str, payload: dict[str, Any]) -> dict[str, Any]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.loads(res.read().decode("utf-8") or "{}")


def create_payment(
    *,
    amount_toman: int,
    description: str,
    callback_url: str,
    mobile: str = "",
    email: str = "",
) -> dict[str, Any]:
    """
    Start a Zarinpal payment.
    Returns {ok, authority?, payment_url?, detail?}.
    """
    merchant = getattr(settings, "ZARINPAL_MERCHANT_ID", "") or ""
    if not merchant:
        return {
            "ok": False,
            "detail": "ZARINPAL_MERCHANT_ID not configured",
            "disabled": True,
        }

    request_url, _ = _endpoints()
    payload: dict[str, Any] = {
        "merchant_id": merchant,
        "amount": int(amount_toman) * 10,  # Rials
        "callback_url": callback_url,
        "description": description[:255],
    }
    meta: dict[str, str] = {}
    if mobile:
        meta["mobile"] = mobile
    if email:
        meta["email"] = email
    if meta:
        payload["metadata"] = meta

    try:
        body = _post(request_url, payload)
    except urllib.error.HTTPError as exc:
        return {"ok": False, "detail": exc.read().decode("utf-8", errors="replace")}
    except Exception as exc:
        return {"ok": False, "detail": str(exc)}

    data = body.get("data") or {}
    errors = body.get("errors")
    authority = data.get("authority")
    code = data.get("code")
    if authority and code == 100:
        return {
            "ok": True,
            "authority": authority,
            "payment_url": _start_pay_url(authority),
        }
    return {"ok": False, "detail": errors or body}


def verify_payment(*, amount_toman: int, authority: str) -> dict[str, Any]:
    merchant = getattr(settings, "ZARINPAL_MERCHANT_ID", "") or ""
    if not merchant:
        return {"ok": False, "detail": "ZARINPAL_MERCHANT_ID not configured"}

    _, verify_url = _endpoints()
    payload = {
        "merchant_id": merchant,
        "amount": int(amount_toman) * 10,
        "authority": authority,
    }
    try:
        body = _post(verify_url, payload)
    except Exception as exc:
        return {"ok": False, "detail": str(exc)}

    data = body.get("data") or {}
    code = data.get("code")
    if code in (100, 101):
        return {
            "ok": True,
            "ref_id": data.get("ref_id"),
            "card_pan": data.get("card_pan"),
            "code": code,
        }
    return {"ok": False, "detail": body.get("errors") or body, "code": code}
