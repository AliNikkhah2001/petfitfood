# PetFitFood — agent guide

Commercial RTL (fa-IR) fresh pet-food storefront. Rebuild as a modern fullstack app; do not ship the WordPress mirror as production.

## Source of truth

| Asset | Path | Use |
| --- | --- | --- |
| Catalog / CMS dump | `petfit/raw_data/*.json` | products, categories, pages, posts, media |
| React landing prototypes | `*.zip` (esp. `petfit yellow.zip`) | GSAP bowl parallax, layout, brand motion |
| WP HTML mirror | `petfit/frontend/` | content/IA reference only |
| Live reference | https://dodopet.ir | UX/brand check via browser |

Brand in data today is **دودو / dodopet**; product name for this repo is **PetFitFood** — confirm copy/branding before public launch.

## Stack defaults

- **App**: Vite + React 19 + TypeScript + Tailwind 4
- **Motion**: GSAP (existing bowl scroll)
- **Commerce**: start with typed JSON catalog → API layer; payments/auth later
- **Deploy**: Vercel (or similar) for frontend; keep API portable
- **QA**: browser tools + Playwright for RTL/mobile

## Working rules

1. Prefer small, reviewable PRs (`/split-to-prs`).
2. Verify UI in a real browser (`/use-browser` / ego-browser), not code alone.
3. After non-trivial edits, run `/simplify` on the diff.
4. Never commit secrets, `.env`, or large mirrored `assets/` trees.
5. Preserve Persian copy and RTL (`dir="rtl"`, `lang="fa-IR"`).
6. Follow conventional commits (`feat`, `fix`, `chore`, …).

## Skills (project)

- `.cursor/skills/fullstack-commerce/` — catalog, cart, checkout shapes
- `.cursor/skills/rtl-fa-frontend/` — RTL/typography/layout
- `.cursor/skills/browser-qa/` — visual QA checklist
