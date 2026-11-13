from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from catalog.models import ContentPage, MagazineArticlePage, Product
from commerce.models import Order, OrderLine

import json


@require_GET
def product_list(_request):
    products = [
        p.to_api_dict()
        for p in Product.objects.filter(is_active=True).prefetch_related("prices")
    ]
    return JsonResponse(products, safe=False)


@require_GET
def product_detail(_request, slug: str):
    try:
        product = Product.objects.prefetch_related("prices").get(slug=slug, is_active=True)
    except Product.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)
    return JsonResponse(product.to_api_dict())


@require_GET
def page_list(_request):
    pages = []
    for page in ContentPage.objects.live().public().specific():
        pages.append(
            {
                "id": str(page.pk),
                "slug": page.slug,
                "title": page.title,
                "body": str(page.body),
                "page_kind": page.page_kind,
            }
        )
    return JsonResponse(pages, safe=False)


@require_GET
def post_list(_request):
    posts = []
    for page in MagazineArticlePage.objects.live().public().specific():
        posts.append(
            {
                "id": str(page.pk),
                "slug": page.slug,
                "title": page.title,
                "excerpt": page.excerpt,
                "body": str(page.body),
                "published_at": page.published_at,
                "cover": page.cover,
            }
        )
    return JsonResponse(posts, safe=False)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def order_list(request):
    if request.method == "GET":
        orders = [o.to_api_dict() for o in Order.objects.prefetch_related("lines").all()[:100]]
        return JsonResponse(orders, safe=False)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    name = str(payload.get("customer_name", "")).strip()
    phone = str(payload.get("phone", "")).strip()
    address = str(payload.get("address", "")).strip()
    note = str(payload.get("note", "")).strip()
    lines = payload.get("lines") or []

    if len(name) < 2 or len(phone) < 8 or len(address) < 8:
        return JsonResponse({"detail": "Invalid customer fields"}, status=400)
    if not isinstance(lines, list) or len(lines) == 0:
        return JsonResponse({"detail": "Order needs lines"}, status=400)

    # Server-side total from line unit prices (never trust client total alone)
    computed = 0
    validated_lines: list[dict] = []
    for raw in lines:
        if not isinstance(raw, dict):
            continue
        product_id = str(raw.get("product_id", "")).strip()
        try:
            grams = int(raw.get("grams", 0))
            qty = int(raw.get("qty", 0))
            unit_price = int(raw.get("unit_price", 0))
        except (TypeError, ValueError):
            return JsonResponse({"detail": "Invalid line numbers"}, status=400)
        if not product_id or grams < 1 or qty < 1 or unit_price < 0:
            return JsonResponse({"detail": "Invalid line"}, status=400)

        # Prefer catalog price when SKU+grams known
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
        validated_lines.append(
            {
                "product_id": product_id,
                "grams": grams,
                "qty": qty,
                "unit_price": final_unit,
            }
        )

    if not validated_lines:
        return JsonResponse({"detail": "No valid lines"}, status=400)

    order = Order.objects.create(
        customer_name=name,
        phone=phone,
        address=address,
        note=note,
        total_toman=computed,
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
            for line in validated_lines
        ]
    )
    return JsonResponse(order.to_api_dict(), status=201)
