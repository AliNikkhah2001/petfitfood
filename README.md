# PetFitFood

Commercial fresh pet-food storefront (fa-IR / RTL) — Vite React storefront + Wagtail headless CMS.

## Apps

| Path | Role |
| --- | --- |
| `apps/web` | Storefront (Vite + React 19 + Tailwind 4 + GSAP) |
| `apps/cms` | Wagtail admin + `/api/v1` catalog & orders |

Brand in data may still say دودو/dodopet in legacy dumps; product brand is **پت‌فیت / PetFit**.

## Local development

```bash
# Storefront
npm install
npm run dev                 # http://127.0.0.1:5173

# CMS (separate terminal)
cd apps/cms
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_catalog
python manage.py runserver 127.0.0.1:8000
```

Or from repo root (after CMS venv exists): `npm run cms:dev`.

- Wagtail admin: http://127.0.0.1:8000/admin/ (seed: `admin` / `petfit-admin`)
- API: http://127.0.0.1:8000/api/v1/products/
- Web env: copy `apps/web/.env.example` → `.env` if you need a non-default API URL

Storefront falls back to local `catalog.ts` when the API is unreachable.

## Sitemap (web)

`/` · `/subscriptions` · `/shop` · `/product/:slug` · `/cart` · `/checkout` · `/about` · `/faq` · `/contact` · `/magazine` · `/account` · `/dashboard` · legal & auth shells

## Data sources

- `petfit/raw_data/*.json` — WP dump (reference / future import)
- Curated menu prices — `apps/web/src/data/catalog.ts` + CMS `seed_catalog`
