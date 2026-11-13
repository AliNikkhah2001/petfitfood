from django.db import models
from django.utils import timezone
from wagtail.admin.panels import FieldPanel, InlinePanel
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel


class Order(ClusterableModel):
    STATUS_CHOICES = [
        ("new", "جدید"),
        ("confirmed", "تأیید شده"),
        ("shipped", "ارسال شده"),
        ("cancelled", "لغو"),
    ]

    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="new")
    customer_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=32)
    address = models.TextField()
    note = models.TextField(blank=True)
    total_toman = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    panels = [
        FieldPanel("status"),
        FieldPanel("customer_name"),
        FieldPanel("phone"),
        FieldPanel("address"),
        FieldPanel("note"),
        FieldPanel("total_toman"),
        InlinePanel("lines", label="Lines"),
    ]

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order #{self.pk} — {self.customer_name}"

    def to_api_dict(self) -> dict:
        return {
            "id": str(self.pk),
            "status": self.status,
            "customer_name": self.customer_name,
            "phone": self.phone,
            "address": self.address,
            "note": self.note,
            "total_toman": self.total_toman,
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
