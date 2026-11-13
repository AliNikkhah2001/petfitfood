from __future__ import annotations

import json
import random
from datetime import timedelta

from django.conf import settings
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from catalog.models import Product
from commerce.auth_utils import (
    customer_from_request,
    normalize_phone,
    require_admin,
    require_customer,
)
from commerce.costing import estimate_order_cost, sales_stats
from commerce.models import AuthToken, Customer, Order, OrderLine, OtpChallenge


def _json_body(request) -> dict:
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return {}


def _parse_order_lines(raw_lines) -> tuple[list[dict] | None, JsonResponse | None]:
    if not isinstance(raw_lines, list) or len(raw_lines) == 0:
        return None, JsonResponse({"detail": "Order needs lines"}, status=400)

    computed = 0
    validated: list[dict] = []
    for raw in raw_lines:
        if not isinstance(raw, dict):
            continue
        product_id = str(raw.get("product_id", "")).strip()
        try:
            grams = int(raw.get("grams", 0))
            qty = int(raw.get("qty", 0))
            unit_price = int(raw.get("unit_price", 0))
        except (TypeError, ValueError):
            return None, JsonResponse({"detail": "Invalid line numbers"}, status=400)
        if not product_id or grams < 1 or qty < 1 or unit_price < 0:
            return None, JsonResponse({"detail": "Invalid line"}, status=400)

        catalog_price = None
        try:
            product = Product.objects.prefetch_related("prices").get(
                external_id=product_id, is_active=True
            )
            match = next((p for p in product.prices.all() if p.grams == grams), None)
            if match:
                catalog_price = match.price_toman
        except Product.DoesNotExist:
            pass

        final_unit = catalog_price if catalog_price is not None else unit_price
        computed += final_unit * qty
        validated.append(
            {
                "product_id": product_id,
                "grams": grams,
                "qty": qty,
                "unit_price": final_unit,
            }
        )

    if not validated:
        return None, JsonResponse({"detail": "No valid lines"}, status=400)
    return validated, None


@csrf_exempt
@require_http_methods(["POST"])
def otp_request(request):
    payload = _json_body(request)
    phone = normalize_phone(str(payload.get("phone", "")))
    if len(phone) < 10:
        return JsonResponse({"detail": "شماره موبایل نامعتبر است"}, status=400)

    code = f"{random.randint(100000, 999999)}"
    OtpChallenge.objects.filter(phone=phone).delete()
    OtpChallenge.objects.create(
        phone=phone,
        code=code,
        expires_at=timezone.now() + timedelta(minutes=5),
    )

    # Dev/SMS placeholder — never ship real secrets; DEBUG exposes code for QA.
    print(f"[PetFit OTP] {phone} → {code}")
    body: dict = {
        "ok": True,
        "phone": phone,
        "message": "کد تأیید ارسال شد",
        "expires_in_sec": 300,
    }
    if settings.DEBUG:
        body["debug_code"] = code
    return JsonResponse(body)


@csrf_exempt
@require_http_methods(["POST"])
def otp_verify(request):
    payload = _json_body(request)
    phone = normalize_phone(str(payload.get("phone", "")))
    code = str(payload.get("code", "")).strip()
    name = str(payload.get("name", "")).strip()

    if len(phone) < 10 or len(code) < 4:
        return JsonResponse({"detail": "کد یا موبایل نامعتبر است"}, status=400)

    challenge = OtpChallenge.objects.filter(phone=phone).order_by("-created_at").first()
    if not challenge or challenge.expires_at < timezone.now():
        return JsonResponse({"detail": "کد منقضی شده؛ دوباره درخواست کنید"}, status=400)
    if challenge.attempts >= 5:
        return JsonResponse({"detail": "تعداد تلاش بیش از حد"}, status=429)
    if challenge.code != code:
        challenge.attempts += 1
        challenge.save(update_fields=["attempts"])
        return JsonResponse({"detail": "کد نادرست است"}, status=400)

    customer, created = Customer.objects.get_or_create(phone=phone)
    if name and (created or not customer.name):
        customer.name = name
        customer.save(update_fields=["name"])

    OtpChallenge.objects.filter(phone=phone).delete()
    token = AuthToken.issue(customer)
    return JsonResponse(
        {
            "token": token.key,
            "expires_at": token.expires_at.isoformat(),
            "customer": customer.to_api_dict(),
        }
    )


@csrf_exempt
@require_http_methods(["GET", "PATCH"])
def me(request):
    customer = require_customer(request)
    if not customer:
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    if request.method == "GET":
        return JsonResponse(customer.to_api_dict())

    payload = _json_body(request)
    for field in ("name", "city", "address", "postal_code"):
        if field in payload:
            setattr(customer, field, str(payload.get(field, "")).strip())
    customer.save()
    return JsonResponse(customer.to_api_dict())


@csrf_exempt
@require_http_methods(["GET", "POST"])
def order_list(request):
    if request.method == "GET":
        admin = require_admin(request)
        if admin:
            orders = [
                o.to_api_dict()
                for o in Order.objects.prefetch_related("lines").all()[:200]
            ]
            return JsonResponse(orders, safe=False)

        customer = require_customer(request)
        if customer:
            orders = [
                o.to_api_dict()
                for o in Order.objects.prefetch_related("lines").filter(customer=customer)[
                    :100
                ]
            ]
            return JsonResponse(orders, safe=False)

        # Public/dev fallback: empty unless explicitly listing for legacy dashboard
        return JsonResponse([], safe=False)

    payload = _json_body(request)
    customer = customer_from_request(request)

    name = str(payload.get("customer_name", "")).strip() or (customer.name if customer else "")
    phone = normalize_phone(
        str(payload.get("phone", "")).strip() or (customer.phone if customer else "")
    )
    city = str(payload.get("city", "")).strip() or (customer.city if customer else "")
    address = str(payload.get("address", "")).strip() or (
        customer.address if customer else ""
    )
    postal = str(payload.get("postal_code", "")).strip() or (
        customer.postal_code if customer else ""
    )
    note = str(payload.get("note", "")).strip()
    lines, err = _parse_order_lines(payload.get("lines") or [])
    if err:
        return err

    if len(name) < 2 or len(phone) < 10 or len(address) < 8:
        return JsonResponse({"detail": "نام، موبایل و آدرس را کامل وارد کنید"}, status=400)
    if len(city) < 2:
        return JsonResponse({"detail": "شهر را وارد کنید"}, status=400)

    assert lines is not None
    computed = sum(line["unit_price"] * line["qty"] for line in lines)
    cost = estimate_order_cost(lines)

    # Persist profile location for returning customers
    if customer:
        dirty = False
        if name and customer.name != name:
            customer.name = name
            dirty = True
        if city and customer.city != city:
            customer.city = city
            dirty = True
        if address and customer.address != address:
            customer.address = address
            dirty = True
        if postal and customer.postal_code != postal:
            customer.postal_code = postal
            dirty = True
        if dirty:
            customer.save()

    order = Order.objects.create(
        customer=customer,
        customer_name=name,
        phone=phone,
        city=city,
        address=address,
        postal_code=postal,
        note=note,
        total_toman=computed,
        cost_toman=cost,
    )
    OrderLine.objects.bulk_create(
        [
            OrderLine(
                order=order,
                product_id=line["product_id"],
                grams=line["grams"],
                qty=line["qty"],
                unit_price=line["unit_price"],
            )
            for line in lines
        ]
    )
    return JsonResponse(order.to_api_dict(), status=201)


@csrf_exempt
@require_http_methods(["PATCH"])
def order_update(request, order_id: int):
    admin = require_admin(request)
    if not admin:
        return JsonResponse({"detail": "Forbidden"}, status=403)

    try:
        order = Order.objects.prefetch_related("lines").get(pk=order_id)
    except Order.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)

    payload = _json_body(request)
    status = str(payload.get("status", "")).strip()
    valid = {c[0] for c in Order.STATUS_CHOICES}
    if status and status not in valid:
        return JsonResponse({"detail": "Invalid status"}, status=400)
    if status:
        order.status = status
        order.save(update_fields=["status"])
    return JsonResponse(order.to_api_dict())


@require_GET
def admin_stats(request):
    admin = require_admin(request)
    if not admin:
        return JsonResponse({"detail": "Forbidden"}, status=403)
    return JsonResponse(sales_stats())
