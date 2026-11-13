---
name: browser-qa
description: >-
  Browser-based QA for PetFitFood: RTL layout, mobile hero, shop flows,
  using Cursor browser tools or ego-browser.
---

# Browser QA

Use after UI changes or before opening a PR.

## Prefer

1. `ego-browser` when available (`ego-browser skill` for current guide).
2. Else Cursor IDE browser MCP: navigate → snapshot → screenshot.

## Checklist

- [ ] Home hero: brand visible, single CTA readable, no overlapping text
- [ ] RTL: menu, icons, and chevrons face the correct direction
- [ ] Shop: category list + product cards render from catalog data
- [ ] Product detail: price, images, add-to-cart
- [ ] Cart: qty update and derived total
- [ ] Mobile ~390px and desktop ~1280px

## Evidence

Capture at least one screenshot for hero + one for shop/cart when claiming “done”.
