# PR1 — Python CMS research → decision

## Requirement

Headless content for a React PWA storefront: pages, magazine, FAQ, product catalog editorial, media library, FA/RTL-friendly admin. Not WordPress.

## Candidates

| Option | Strengths | Weaknesses | Fit |
| --- | --- | --- | --- |
| **Wagtail (Django)** | StreamField, workflows, image renditions, **headless API in core**, mature, `wagtail start` | Commerce not built-in | **Best** |
| django CMS | Inline front-end editing | Weaker headless story; page-plugin model fights React | Weak for SPA |
| Pure Django admin | Full control | Rebuilding CMS UX | Too much DIY for content |
| Salesman + Wagtail | Basket/checkout API + Wagtail admin | Extra package to wire | Strong for PR8–9 |
| Longclaw | Wagtail shop starter | Less active / older patterns | Skip |

## Decision

**Adopt Wagtail headless** as CMS (`apps/cms`).

- Content API for Home, About, FAQ, Magazine, legal pages.
- Product/Category as Wagtail snippets or custom models; import from `petfit/raw_data`.
- Commerce (basket/order) as Django apps in the same project (Salesman or thin custom) in PR9.
- Starter: official `wagtail start petfit_cms` — no WP clone, no theme lock-in.

## Rejected

- Running or theming WordPress for production.
- Binding the React app to live dodopet.ir APIs.
