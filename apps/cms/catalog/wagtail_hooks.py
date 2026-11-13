from wagtail.snippets.views.snippets import SnippetViewSet, SnippetViewSetGroup
from wagtail.snippets.models import register_snippet

from catalog.models import Product
from commerce.models import Order


class ProductViewSet(SnippetViewSet):
    model = Product
    icon = "tag"
    menu_label = "محصولات"
    menu_name = "products"
    list_display = ("name_fa", "group", "slug", "is_active")
    search_fields = ("name_fa", "slug", "external_id")


class OrderViewSet(SnippetViewSet):
    model = Order
    icon = "form"
    menu_label = "سفارش‌ها"
    menu_name = "orders"
    list_display = ("id", "customer_name", "phone", "status", "total_toman", "created_at")
    list_filter = ("status",)
    search_fields = ("customer_name", "phone")


class CommerceGroup(SnippetViewSetGroup):
    menu_label = "پت‌فیت فروش"
    menu_icon = "pick"
    menu_order = 200
    items = (ProductViewSet, OrderViewSet)


register_snippet(CommerceGroup)
