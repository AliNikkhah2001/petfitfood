from wagtail.models import Page


class HomePage(Page):
    subpage_types = [
        "catalog.ContentPage",
        "catalog.MagazineIndexPage",
    ]
    max_count = 1
