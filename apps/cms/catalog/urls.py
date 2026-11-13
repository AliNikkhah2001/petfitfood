from django.urls import path

from catalog import api

urlpatterns = [
    path("products/", api.product_list, name="api-products"),
    path("products/<slug:slug>/", api.product_detail, name="api-product-detail"),
    path("pages/", api.page_list, name="api-pages"),
    path("posts/", api.post_list, name="api-posts"),
    path("orders/", api.order_list, name="api-orders"),
]
