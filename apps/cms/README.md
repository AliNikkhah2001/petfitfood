# PetFit CMS (`apps/cms`)

Wagtail (Django) headless CMS — scaffolded in PR8.

## Planned

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install wagtail
wagtail start petfit_cms .
```

- Import catalog from `../../petfit/raw_data/`
- Expose Wagtail API for `apps/web`

Until then, the storefront reads local JSON / static assets.
