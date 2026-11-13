from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-&#i^v-=r688f!=4s7gj^62(55hk^7v&^t&ndm-4tk=__r@!4te"

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ["*"]

# Integrations (optional in local — console OTP / unpaid checkout)
KAVENEGAR_API_KEY = ""
KAVENEGAR_OTP_TEMPLATE = ""
KAVENEGAR_SENDER = ""
PETFIT_EXPOSE_OTP = True
ZARINPAL_MERCHANT_ID = ""
ZARINPAL_SANDBOX = True
ZARINPAL_CALLBACK_URL = ""
PETFIT_FRONTEND_URL = "http://127.0.0.1:5173"

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


try:
    from .local import *
except ImportError:
    pass
