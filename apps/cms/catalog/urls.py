from django.urls import path

from catalog import api as catalog_api
from commerce import api as commerce_api

urlpatterns = [
    path("products/", catalog_api.product_list, name="api-products"),
    path("products/<slug:slug>/", catalog_api.product_detail, name="api-product-detail"),
    path("pages/", catalog_api.page_list, name="api-pages"),
    path("posts/", catalog_api.post_list, name="api-posts"),
    path("auth/otp/request/", commerce_api.otp_request, name="api-otp-request"),
    path("auth/otp/verify/", commerce_api.otp_verify, name="api-otp-verify"),
    path("auth/me/", commerce_api.me, name="api-me"),
    path("orders/", commerce_api.order_list, name="api-orders"),
    path("orders/<int:order_id>/", commerce_api.order_update, name="api-order-update"),
    path("admin/stats/", commerce_api.admin_stats, name="api-admin-stats"),
]
