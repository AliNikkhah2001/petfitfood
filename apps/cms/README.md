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
| GET/POST | `/api/v1/orders/` | Merchant list + Phase A order create |

Order totals are recomputed server-side from catalog prices when the SKU exists.

## Admin

Wagtail snippets group **پت‌فیت فروش**: محصولات · سفارش‌ها.  
Pages: content + magazine under the home tree.
