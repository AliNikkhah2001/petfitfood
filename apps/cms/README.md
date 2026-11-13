# PetFit CMS (`apps/cms`)

Wagtail (Django) headless CMS + catalog/order API for `apps/web`.

## Quick start

```bash
cd apps/cms
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_catalog
python manage.py runserver 127.0.0.1:8000
```

- Wagtail admin: http://127.0.0.1:8000/admin/  
  Default seed user: `admin` / `petfit-admin` (change before any public deploy)
- Storefront API: http://127.0.0.1:8000/api/v1/

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/v1/products/` | Active SKUs (web `Product` shape) |
| GET | `/api/v1/products/:slug/` | Single SKU |
| GET | `/api/v1/pages/` | Live `ContentPage`s |
| GET | `/api/v1/posts/` | Magazine articles |
| POST | `/api/v1/auth/otp/request/` | `{phone}` → OTP (DEBUG returns `debug_code`) |
| POST | `/api/v1/auth/otp/verify/` | `{phone,code,name?}` → `{token,customer}` |
| GET/PATCH | `/api/v1/auth/me/` | Bearer profile + location |
| GET/POST | `/api/v1/orders/` | Auth: mine / admin: all; create with city+address |
| PATCH | `/api/v1/orders/:id/` | Admin status update |
| GET | `/api/v1/admin/stats/` | Revenue, cost, profit, ingredient plan |

Order totals and ingredient **cost_toman** are computed server-side (never trust client prices).

## Auth notes

- Seeded admin customer phone: `09045957011` (`is_admin=True`) — login via OTP on `/login`, then open `/dashboard`.
- OTP is printed to the CMS console; in `DEBUG` the request response also includes `debug_code` for local QA.
- Wagtail CMS admin remains at `/admin/` (`admin` / `petfit-admin`).

## Admin

Wagtail snippets group **پت‌فیت فروش**: محصولات · سفارش‌ها · مشتریان · مواد اولیه.  
React admin dashboard: storefront `/dashboard` (OTP admin only).
