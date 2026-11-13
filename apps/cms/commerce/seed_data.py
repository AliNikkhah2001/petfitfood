"""Ingredient costs (toman/kg) and recipes grams-per-kg of finished product."""

INGREDIENTS = [
    {"slug": "chicken-breast", "name_fa": "فیله مرغ", "cost_per_kg_toman": 420_000, "stock_kg": 40},
    {"slug": "chicken-meat", "name_fa": "مرغ", "cost_per_kg_toman": 280_000, "stock_kg": 50},
    {"slug": "chicken-liver", "name_fa": "جگر مرغ", "cost_per_kg_toman": 180_000, "stock_kg": 15},
    {"slug": "organs", "name_fa": "دل و جگر مرغ", "cost_per_kg_toman": 160_000, "stock_kg": 20},
    {"slug": "beef", "name_fa": "گوشت گوساله", "cost_per_kg_toman": 780_000, "stock_kg": 25},
    {"slug": "carrot", "name_fa": "هویج", "cost_per_kg_toman": 45_000, "stock_kg": 30},
    {"slug": "pumpkin", "name_fa": "کدو حلوایی", "cost_per_kg_toman": 40_000, "stock_kg": 25},
    {"slug": "zucchini", "name_fa": "کدو سبز", "cost_per_kg_toman": 50_000, "stock_kg": 20},
    {"slug": "potato", "name_fa": "سیب‌زمینی", "cost_per_kg_toman": 35_000, "stock_kg": 40},
    {"slug": "chicken-stock", "name_fa": "عصاره مرغ", "cost_per_kg_toman": 90_000, "stock_kg": 10},
    {"slug": "bone-stock", "name_fa": "عصاره قلم", "cost_per_kg_toman": 110_000, "stock_kg": 8},
]

# Map product ingredient label → ingredient slug
LABEL_TO_SLUG = {
    "فیله مرغ": "chicken-breast",
    "مرغ تازه": "chicken-meat",
    "مرغ": "chicken-meat",
    "جگر مرغ": "chicken-liver",
    "دل و جگر مرغ": "organs",
    "گوشت گوساله": "beef",
    "هویج": "carrot",
    "کدو حلوایی": "pumpkin",
    "کدو سبز": "zucchini",
    "سیب‌زمینی": "potato",
    "عصاره مرغ": "chicken-stock",
    "عصاره قلم": "bone-stock",
}

# Approximate grams of each ingredient per 1kg finished product by group
DEFAULT_SHARE = {
    "protein": 550,
    "organs": 120,
    "veg": 80,  # each veg line
}
