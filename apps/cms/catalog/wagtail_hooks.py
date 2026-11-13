from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet, SnippetViewSetGroup

from catalog.models import Product
from commerce.models import Customer, Ingredient, Order


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
    list_display = (
        "id",
        "customer_name",
        "phone",
        "city",
        "status",
        "total_toman",
        "cost_toman",
        "created_at",
    )
    list_filter = ("status", "city")
    search_fields = ("customer_name", "phone", "city")


class CustomerViewSet(SnippetViewSet):
    model = Customer
    icon = "user"
    menu_label = "مشتریان"
    menu_name = "customers"
    list_display = ("name", "phone", "city", "is_admin")
    search_fields = ("name", "phone", "city")


class IngredientViewSet(SnippetViewSet):
    model = Ingredient
    icon = "snippet"
    menu_label = "مواد اولیه"
    menu_name = "ingredients"
    list_display = ("name_fa", "cost_per_kg_toman", "stock_kg")
    search_fields = ("name_fa", "slug")


class CommerceGroup(SnippetViewSetGroup):
    menu_label = "پت‌فیت فروش"
    menu_icon = "pick"
    menu_order = 200
    items = (ProductViewSet, OrderViewSet, CustomerViewSet, IngredientViewSet)


register_snippet(CommerceGroup)
