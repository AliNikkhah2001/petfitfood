from __future__ import annotations

from collections import defaultdict
from decimal import Decimal

from commerce.models import Ingredient, Order, OrderLine, RecipeLine


def estimate_line_cost(product_id: str, grams: int, qty: int) -> int:
    """Ingredient cost for one order line (toman)."""
    recipes = RecipeLine.objects.filter(product_external_id=product_id).select_related(
        "ingredient"
    )
    if not recipes:
        return 0
    total = 0
    product_kg = (Decimal(grams) / Decimal(1000)) * qty
    for row in recipes:
        ing_kg = product_kg * (Decimal(row.grams_per_kg) / Decimal(1000))
        total += int(ing_kg * row.ingredient.cost_per_kg_toman)
    return total


def estimate_order_cost(lines: list[dict]) -> int:
    return sum(
        estimate_line_cost(str(line["product_id"]), int(line["grams"]), int(line["qty"]))
        for line in lines
    )


def ingredient_demand_for_orders(orders: list[Order]) -> list[dict]:
    """Aggregate ingredient kg needed for the given orders (non-cancelled)."""
    demand_g: dict[int, Decimal] = defaultdict(lambda: Decimal(0))
    product_grams: dict[str, Decimal] = defaultdict(lambda: Decimal(0))

    for order in orders:
        if order.status == "cancelled":
            continue
        for line in order.lines.all():
            product_grams[line.product_id] += Decimal(line.grams) * line.qty

    recipes = RecipeLine.objects.select_related("ingredient").all()
    by_product: dict[str, list[RecipeLine]] = defaultdict(list)
    for row in recipes:
        by_product[row.product_external_id].append(row)

    for product_id, grams in product_grams.items():
        for row in by_product.get(product_id, []):
            demand_g[row.ingredient_id] += grams * (Decimal(row.grams_per_kg) / Decimal(1000))

    ingredients = {i.pk: i for i in Ingredient.objects.all()}
    plan = []
    for ing_id, grams in demand_g.items():
        ing = ingredients.get(ing_id)
        if not ing:
            continue
        need_kg = grams / Decimal(1000)
        stock = Decimal(ing.stock_kg)
        shortfall = max(Decimal(0), need_kg - stock)
        plan.append(
            {
                "slug": ing.slug,
                "name_fa": ing.name_fa,
                "need_kg": float(round(need_kg, 3)),
                "stock_kg": float(stock),
                "shortfall_kg": float(round(shortfall, 3)),
                "cost_per_kg_toman": ing.cost_per_kg_toman,
                "planned_spend_toman": int(shortfall * ing.cost_per_kg_toman),
            }
        )
    plan.sort(key=lambda row: row["shortfall_kg"], reverse=True)
    return plan


def sales_stats() -> dict:
    qs = Order.objects.exclude(status="cancelled").prefetch_related("lines")
    revenue = sum(o.total_toman for o in qs)
    cost = sum(o.cost_toman for o in qs)
    count = qs.count()
    by_status = {}
    for status, label in Order.STATUS_CHOICES:
        by_status[status] = {
            "label": label,
            "count": Order.objects.filter(status=status).count(),
        }
    open_orders = list(qs.filter(status__in=["new", "confirmed"]))
    plan = ingredient_demand_for_orders(open_orders)
    planned_spend = sum(row["planned_spend_toman"] for row in plan)
    return {
        "orders_count": count,
        "revenue_toman": revenue,
        "spent_toman": cost,
        "net_profit_toman": max(0, revenue - cost),
        "open_orders_count": len(open_orders),
        "ingredient_plan_spend_toman": planned_spend,
        "by_status": by_status,
        "ingredient_plan": plan,
    }
