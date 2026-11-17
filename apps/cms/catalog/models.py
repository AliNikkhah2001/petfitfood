from django.db import models
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.images import get_image_model_string
from wagtail.models import Orderable, Page
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel


def _image_url(image) -> str:
    if not image:
        return ""
    try:
        return image.file.url
    except Exception:
        return ""


class Product(ClusterableModel):
    """Storefront SKU — matches apps/web Product shape."""

    GROUP_CHOICES = [
        ("chicken", "مرغ"),
        ("beef", "گوساله"),
        ("turkey", "بوقلمون"),
        ("fish", "ماهی"),
    ]

    external_id = models.SlugField(max_length=64, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    group = models.CharField(max_length=32, choices=GROUP_CHOICES)
    name_fa = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    ingredients = models.JSONField(default=list, blank=True)
    # Legacy path string (fallback) + Wagtail image (preferred in admin)
    image = models.CharField(max_length=500, blank=True)
    photo = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    badge = models.CharField(max_length=64, blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    panels = [
        FieldPanel("external_id"),
        FieldPanel("slug"),
        FieldPanel("group"),
        FieldPanel("name_fa"),
        FieldPanel("description"),
        FieldPanel("ingredients"),
        FieldPanel("photo"),
        FieldPanel("image"),
        FieldPanel("badge"),
        FieldPanel("is_active"),
        FieldPanel("sort_order"),
        InlinePanel("prices", label="Prices"),
    ]

    class Meta:
        ordering = ["sort_order", "name_fa"]

    def __str__(self) -> str:
        return self.name_fa

    def resolved_image_url(self) -> str:
        return _image_url(self.photo) or self.image

    def to_api_dict(self) -> dict:
        return {
            "id": self.external_id,
            "slug": self.slug,
            "group": self.group,
            "nameFa": self.name_fa,
            "description": self.description,
            "ingredients": self.ingredients or [],
            "prices": [
                {"grams": p.grams, "priceToman": p.price_toman} for p in self.prices.all()
            ],
            "image": self.resolved_image_url(),
            "badge": self.badge,
        }


class ProductPrice(Orderable):
    product = ParentalKey(Product, on_delete=models.CASCADE, related_name="prices")
    grams = models.PositiveIntegerField()
    price_toman = models.PositiveIntegerField()

    panels = [
        FieldPanel("grams"),
        FieldPanel("price_toman"),
    ]

    class Meta:
        ordering = ["grams"]

    def __str__(self) -> str:
        return f"{self.product_id}:{self.grams}g"


class ContentPage(Page):
    """CMS page for about / faq / legal / contact bodies."""

    body = RichTextField(blank=True)
    page_kind = models.CharField(
        max_length=32,
        blank=True,
        help_text="about | faq | privacy | terms | contact",
    )

    content_panels = Page.content_panels + [
        FieldPanel("page_kind"),
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("body"),
        APIField("page_kind"),
    ]


class MagazineIndexPage(Page):
    intro = models.TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
    ]

    subpage_types = ["catalog.MagazineArticlePage"]


class MagazineArticlePage(Page):
    excerpt = models.TextField(blank=True)
    cover = models.CharField(max_length=500, blank=True)
    cover_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    body = RichTextField(blank=True)
    published_at = models.CharField(max_length=32, blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("excerpt"),
        FieldPanel("cover_image"),
        FieldPanel("cover"),
        FieldPanel("published_at"),
        FieldPanel("body"),
    ]

    parent_page_types = ["catalog.MagazineIndexPage"]

    api_fields = [
        APIField("excerpt"),
        APIField("cover"),
        APIField("published_at"),
        APIField("body"),
    ]

    def resolved_cover_url(self) -> str:
        return _image_url(self.cover_image) or self.cover
