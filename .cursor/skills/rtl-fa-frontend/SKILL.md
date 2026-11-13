---
name: rtl-fa-frontend
description: >-
  Persian RTL frontend patterns for PetFitFood marketing and shop pages,
  including typography, layout, and GSAP landing reuse from yellow template.
---

# RTL fa-IR frontend

Use when building pages, components, or styles for the storefront.

## Bootstrap from templates

- Primary prototype: unzip/`petfit yellow.zip` (Vite React + Tailwind + GSAP `BowlScroll`).
- Treat `petfit/frontend/**` HTML as content/IA reference, not production code.

## Layout

- Document `dir="rtl"` / `lang="fa-IR"`.
- Logical properties only for spacing/alignment.
- Marketing first viewport: brand, one headline, one sentence, CTA(s), dominant visual.

## Motion

- Reuse bowl parallax patterns from the yellow template; keep reduced-motion fallbacks.
- Prefer GSAP scroll timelines over ad-hoc rAF loops.

## Verify

Always check fa copy truncation, hamburger/nav, and cart icon at ~390px width in a real browser.
