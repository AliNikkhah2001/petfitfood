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

## Commerce (local)

1. `npm run cms:dev` then `npm run cms:seed` (ingredients + admin customer)
2. Storefront: `/login` → OTP to `09045957011` (code in CMS console / `debug_code`)
3. User: cart → checkout (city + address) → order
4. Admin: `/dashboard` — sales, profit vs cost, ingredient planning, order status

## Sitemap (web)

`/` · `/subscriptions` · `/shop` · `/product/:slug` · `/cart` · `/checkout` · `/about` · `/faq` · `/contact` · `/magazine` · `/account` · `/login` (OTP) · `/dashboard` (admin) · legal shells

## Data sources

- `petfit/raw_data/*.json` — WP dump (reference / future import)
- Curated menu prices — `apps/web/src/data/catalog.ts` + CMS `seed_catalog`

## GitHub Pages

Storefront deploys from `master` via `.github/workflows/deploy-pages.yml` to:

https://alinikkhah2001.github.io/petfitfood/

Optional: set repo variable `VITE_API_BASE_URL` to your public API so Pages talks to CMS.

## Production API (Docker)

```bash
cp apps/cms/.env.example .env   # fill secrets
npm run cms:up                  # postgres + gunicorn on :8000
```

Or connect `render.yaml` on Render.com. Set `KAVENEGAR_API_KEY` for real OTP SMS and `ZARINPAL_MERCHANT_ID` for online checkout.

## E2E

```bash
npm run test:e2e --workspace=@petfit/web -- --project=desktop
```
