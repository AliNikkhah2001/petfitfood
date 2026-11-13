"""OTP delivery — Kavenegar when configured, otherwise console (dev)."""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings


def send_otp_sms(phone: str, code: str) -> dict:
    """
    Send OTP SMS.
    Returns {"ok": bool, "provider": str, "detail"?: str}.
    """
    api_key = getattr(settings, "KAVENEGAR_API_KEY", "") or ""
    template = getattr(settings, "KAVENEGAR_OTP_TEMPLATE", "") or ""
    sender = getattr(settings, "KAVENEGAR_SENDER", "") or ""

    if not api_key:
        print(f"[PetFit OTP] {phone} → {code} (console; set KAVENEGAR_API_KEY for SMS)")
        return {"ok": True, "provider": "console"}

    # Prefer lookup/template API when a template name is configured.
    if template:
        url = f"https://api.kavenegar.com/v1/{api_key}/verify/lookup.json"
        data = urllib.parse.urlencode(
            {"receptor": phone, "token": code, "template": template}
        ).encode()
    else:
        url = f"https://api.kavenegar.com/v1/{api_key}/sms/send.json"
        message = f"کد تأیید پت‌فیت: {code}"
        payload = {"receptor": phone, "message": message}
        if sender:
            payload["sender"] = sender
        data = urllib.parse.urlencode(payload).encode()

    try:
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req, timeout=12) as res:
            body = json.loads(res.read().decode("utf-8") or "{}")
        return {"ok": True, "provider": "kavenegar", "detail": body}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        print(f"[PetFit OTP] Kavenegar HTTP {exc.code}: {detail}")
        return {"ok": False, "provider": "kavenegar", "detail": detail}
    except Exception as exc:  # network / parse
        print(f"[PetFit OTP] Kavenegar error: {exc}")
        return {"ok": False, "provider": "kavenegar", "detail": str(exc)}
