---
name: fullstack-commerce
description: >-
  Build catalog, cart, checkout, and API boundaries for the PetFitFood
  commercial storefront from petfit/raw_data JSON dumps.
---

# Fullstack commerce (PetFitFood)

Use when adding products, categories, cart, checkout, or backend APIs.

## Data

1. Read `petfit/raw_data/products.json` and `product_categories.json`.
2. Define typed models (`id`, `slug`, `name`, `prices`, `images`, `categories`, `short_description`).
3. Expose a read-only catalog module first; mutate only cart/session client-side until a real API exists.

## Cart rules

- Line identity = `productId` (+ variation if present).
- Quantity ≥ 1; clamp to stock when available.
- Totals derived: `sum(unitPrice * qty)`; never store a divergent total.

## Checkout (phased)

1. **Phase A**: static catalog + cart drawer + checkout form UI (no payment).
2. **Phase B**: API order create + payment provider.
3. Never log card data; never commit gateway secrets.

## PR sizing

Prefer separate PRs: catalog types → shop UI → cart → checkout shell.
