from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from wagtail.models import Page, Site

from catalog.models import (
    ContentPage,
    MagazineArticlePage,
    MagazineIndexPage,
    Product,
    ProductPrice,
)
from catalog.seed_data import CONTENT_PAGES, MAGAZINE, PRODUCTS
from commerce.models import Customer, Ingredient, RecipeLine
from commerce.seed_data import DEFAULT_SHARE, INGREDIENTS, LABEL_TO_SLUG


class Command(BaseCommand):
    help = "Seed PetFit catalog products, magazine articles, and content pages"

    def handle(self, *args, **options):
        self._seed_products()
        self._seed_ingredients_and_recipes()
        self._seed_commerce_admin()
        root = Page.get_first_root_node()
        home = root.get_children().live().first()
        if home is None:
            self.stderr.write("No home page — run migrations / wagtail bootstrap first")
            return
        self._seed_magazine(home)
        self._seed_content_pages(home)
        self._ensure_admin()
        self.stdout.write(self.style.SUCCESS("Catalog seed complete"))

    def _seed_products(self):
        for index, data in enumerate(PRODUCTS):
            product, _ = Product.objects.update_or_create(
                external_id=data["external_id"],
                defaults={
                    "slug": data["slug"],
                    "group": data["group"],
                    "name_fa": data["name_fa"],
                    "description": data["description"],
                    "ingredients": data["ingredients"],
                    "image": data["image"],
                    "badge": data["badge"],
                    "is_active": True,
                    "sort_order": index,
                },
            )
            product.prices.all().delete()
            for grams, price in data["prices"]:
                ProductPrice.objects.create(product=product, grams=grams, price_toman=price)
        self.stdout.write(f"Products: {Product.objects.count()}")

    def _seed_magazine(self, home: Page):
        existing = home.get_children().type(MagazineIndexPage).first()
        if existing:
            index = existing.specific
        else:
            index = MagazineIndexPage(
                title="مجله",
                slug="magazine",
                intro="مقاله‌های تغذیه و تازگی پت‌فیت",
            )
            home.add_child(instance=index)
            index.save_revision().publish()

        for data in MAGAZINE:
            child = index.get_children().filter(slug=data["slug"]).first()
            if child:
                article = child.specific
                article.title = data["title"]
                article.excerpt = data["excerpt"]
                article.cover = data["cover"]
                article.published_at = data["published_at"]
                article.body = data["body"]
                article.save_revision().publish()
            else:
                article = MagazineArticlePage(
                    title=data["title"],
                    slug=data["slug"],
                    excerpt=data["excerpt"],
                    cover=data["cover"],
                    published_at=data["published_at"],
                    body=data["body"],
                )
                index.add_child(instance=article)
                article.save_revision().publish()
        self.stdout.write(f"Magazine articles: {MagazineArticlePage.objects.count()}")

    def _seed_content_pages(self, home: Page):
        for data in CONTENT_PAGES:
            child = home.get_children().filter(slug=data["slug"]).first()
            if child:
                page = child.specific
                if isinstance(page, ContentPage):
                    page.title = data["title"]
                    page.page_kind = data["page_kind"]
                    page.body = data["body"]
                    page.save_revision().publish()
                continue
            page = ContentPage(
                title=data["title"],
                slug=data["slug"],
                page_kind=data["page_kind"],
                body=data["body"],
            )
            home.add_child(instance=page)
            page.save_revision().publish()
        self.stdout.write(f"Content pages: {ContentPage.objects.count()}")

        # Ensure default site points at home
        site = Site.objects.filter(is_default_site=True).first()
        if site and site.root_page_id != home.id:
            site.root_page = home
            site.save()

    def _seed_ingredients_and_recipes(self):
        for row in INGREDIENTS:
            Ingredient.objects.update_or_create(
                slug=row["slug"],
                defaults={
                    "name_fa": row["name_fa"],
                    "cost_per_kg_toman": row["cost_per_kg_toman"],
                    "stock_kg": row["stock_kg"],
                },
            )

        RecipeLine.objects.all().delete()
        for product in PRODUCTS:
            labels = product["ingredients"]
            protein_labels = [
                lab
                for lab in labels
                if LABEL_TO_SLUG.get(lab)
                in {"chicken-breast", "chicken-meat", "beef"}
            ]
            organ_labels = [
                lab
                for lab in labels
                if LABEL_TO_SLUG.get(lab) in {"organs", "chicken-liver"}
            ]
            veg_labels = [
                lab
                for lab in labels
                if LABEL_TO_SLUG.get(lab)
                in {"carrot", "pumpkin", "zucchini", "potato", "chicken-stock", "bone-stock"}
            ]

            for lab in protein_labels:
                slug = LABEL_TO_SLUG[lab]
                RecipeLine.objects.create(
                    product_external_id=product["external_id"],
                    ingredient=Ingredient.objects.get(slug=slug),
                    grams_per_kg=DEFAULT_SHARE["protein"] // max(1, len(protein_labels)),
                )
            for lab in organ_labels:
                slug = LABEL_TO_SLUG[lab]
                RecipeLine.objects.create(
                    product_external_id=product["external_id"],
                    ingredient=Ingredient.objects.get(slug=slug),
                    grams_per_kg=DEFAULT_SHARE["organs"] // max(1, len(organ_labels)),
                )
            for lab in veg_labels:
                slug = LABEL_TO_SLUG[lab]
                RecipeLine.objects.create(
                    product_external_id=product["external_id"],
                    ingredient=Ingredient.objects.get(slug=slug),
                    grams_per_kg=DEFAULT_SHARE["veg"],
                )

        self.stdout.write(
            f"Ingredients: {Ingredient.objects.count()} · Recipes: {RecipeLine.objects.count()}"
        )

    def _seed_commerce_admin(self):
        customer, _ = Customer.objects.update_or_create(
            phone="09045957011",
            defaults={
                "name": "مدیر پت‌فیت",
                "city": "تهران",
                "address": "حشمتیه، پلاک ۱۰",
                "postal_code": "1637673565",
                "is_admin": True,
            },
        )
        self.stdout.write(f"Commerce admin customer: {customer.phone} (OTP login)")

    def _ensure_admin(self):
        User = get_user_model()
        if User.objects.filter(username="admin").exists():
            return
        User.objects.create_superuser("admin", "admin@petfitfood.ir", "petfit-admin")
        self.stdout.write("Created superuser admin / petfit-admin (change in production)")
