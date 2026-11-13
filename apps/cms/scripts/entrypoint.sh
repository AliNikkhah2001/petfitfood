#!/bin/sh
set -eu

mkdir -p /app/data /app/media /app/static

python manage.py migrate --noinput
python manage.py collectstatic --noinput

if [ "${PETFIT_SEED_ON_BOOT:-1}" = "1" ]; then
  python manage.py seed_catalog || true
fi

# Create admin user if missing (env-driven; no-op without credentials)
if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
  python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u = '${DJANGO_SUPERUSER_USERNAME}'
if not User.objects.filter(username=u).exists():
    User.objects.create_superuser(u, '${DJANGO_SUPERUSER_EMAIL:-admin@petfit.local}', '${DJANGO_SUPERUSER_PASSWORD}')
    print('superuser created')
else:
    print('superuser exists')
" || true
fi

exec gunicorn petfit_cms.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-2}" \
  --timeout 60
