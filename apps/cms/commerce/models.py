import secrets
from datetime import timedelta

from django.db import models
from django.utils import timezone
from wagtail.admin.panels import FieldPanel, InlinePanel
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel


class Customer(models.Model):
    phone = models.CharField(max_length=16, unique=True)
    name = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=120, blank=True)
    address = models.TextField(blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    panels = [
        FieldPanel("phone"),
        FieldPanel("name"),
        FieldPanel("city"),
        FieldPanel("address"),
        FieldPanel("postal_code"),
        FieldPanel("is_admin"),
    ]

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name or 'مشتری'} ({self.phone})"

    def to_api_dict(self) -> dict:
        return {
            "id": str(self.pk),
            "phone": self.phone,
            "name": self.name,
            "city": self.city,
            "address": self.address,
            "postal_code": self.postal_code,
            "is_admin": self.is_admin,
        }


class AuthToken(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="tokens")
    key = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    expires_at = models.DateTimeField()

    @classmethod
    def issue(cls, customer: Customer, days: int = 30) -> "AuthToken":
        return cls.objects.create(
            customer=customer,
            key=secrets.token_hex(32),
            expires_at=timezone.now() + timedelta(days=days),
        )

    def is_valid(self) -> bool:
        return self.expires_at >= timezone.now()


class OtpChallenge(models.Model):
    phone = models.CharField(max_length=16, db_index=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]


class Ingredient(models.Model):
    slug = models.SlugField(max_length=64, unique=True)
    name_fa = models.CharField(max_length=120)
    unit = models.CharField(max_length=16, default="kg")
    cost_per_kg_toman = models.PositiveIntegerField(default=0)
    stock_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    panels = [
        FieldPanel("slug"),
        FieldPanel("name_fa"),
        FieldPanel("unit"),
        FieldPanel("cost_per_kg_toman"),
        FieldPanel("stock_kg"),
    ]

    class Meta:
        ordering = ["name_fa"]

    def __str__(self) -> str:
        return self.name_fa

    def to_api_dict(self) -> dict:
        return {
            "slug": self.slug,
            "name_fa": self.name_fa,
            "unit": self.unit,
            "cost_per_kg_toman": self.cost_per_kg_toman,
            "stock_kg": float(self.stock_kg),
        }


class RecipeLine(models.Model):
    """Grams of ingredient required per 1000g of finished product."""

    product_external_id = models.CharField(max_length=64, db_index=True)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name="recipes")
    grams_per_kg = models.PositiveIntegerField()

    class Meta:
        unique_together = ("product_external_id", "ingredient")

    def __str__(self) -> str:
        return f"{self.product_external_id} ← {self.ingredient_id} ({self.grams_per_kg}g)"


class Order(ClusterableModel):
    STATUS_CHOICES = [
        ("new", "جدید"),
        ("confirmed", "تأیید شده"),
        ("shipped", "ارسال شده"),
        ("cancelled", "لغو"),
    ]

    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="new")
    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )
    customer_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=32)
    city = models.CharField(max_length=120, blank=True)
    address = models.TextField()
    postal_code = models.CharField(max_length=20, blank=True)
    note = models.TextField(blank=True)
    total_toman = models.PositiveIntegerField(default=0)
    cost_toman = models.PositiveIntegerField(
        default=0,
        help_text="Estimated ingredient cost for this order",
    )
    payment_status = models.CharField(
        max_length=32,
        default="unpaid",
        choices=[
            ("unpaid", "پرداخت‌نشده"),
            ("pending", "در انتظار پرداخت"),
            ("paid", "پرداخت‌شده"),
            ("failed", "ناموفق"),
        ],
    )
    payment_authority = models.CharField(max_length=64, blank=True)
    payment_ref_id = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    panels = [
        FieldPanel("status"),
        FieldPanel("customer"),
        FieldPanel("customer_name"),
        FieldPanel("phone"),
        FieldPanel("city"),
        FieldPanel("address"),
        FieldPanel("postal_code"),
        FieldPanel("note"),
        FieldPanel("total_toman"),
        FieldPanel("cost_toman"),
        FieldPanel("payment_status"),
        FieldPanel("payment_authority"),
        FieldPanel("payment_ref_id"),
        InlinePanel("lines", label="Lines"),
    ]

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order #{self.pk} — {self.customer_name}"

    @property
    def profit_toman(self) -> int:
        return max(0, int(self.total_toman) - int(self.cost_toman))

    def to_api_dict(self) -> dict:
        return {
            "id": str(self.pk),
            "status": self.status,
            "customer_name": self.customer_name,
            "phone": self.phone,
            "city": self.city,
            "address": self.address,
            "postal_code": self.postal_code,
            "note": self.note,
            "total_toman": self.total_toman,
            "cost_toman": self.cost_toman,
            "profit_toman": self.profit_toman,
            "payment_status": self.payment_status,
            "payment_authority": self.payment_authority,
            "payment_ref_id": self.payment_ref_id,
            "created_at": self.created_at.isoformat(),
            "lines": [
                {
                    "product_id": line.product_id,
                    "grams": line.grams,
                    "qty": line.qty,
                    "unit_price": line.unit_price,
                }
                for line in self.lines.all()
            ],
        }


class OrderLine(models.Model):
    order = ParentalKey(Order, on_delete=models.CASCADE, related_name="lines")
    product_id = models.CharField(max_length=64)
    grams = models.PositiveIntegerField()
    qty = models.PositiveIntegerField(default=1)
    unit_price = models.PositiveIntegerField()

    panels = [
        FieldPanel("product_id"),
        FieldPanel("grams"),
        FieldPanel("qty"),
        FieldPanel("unit_price"),
    ]

    def __str__(self) -> str:
        return f"{self.product_id} × {self.qty}"
