from django.http import JsonResponse
from django.views.decorators.http import require_GET

from catalog.models import ContentPage, MagazineArticlePage, Product


@require_GET
def product_list(_request):
    products = [
        p.to_api_dict()
        for p in Product.objects.filter(is_active=True).prefetch_related("prices")
    ]
    return JsonResponse(products, safe=False)


@require_GET
def product_detail(_request, slug: str):
    try:
        product = Product.objects.prefetch_related("prices").get(slug=slug, is_active=True)
    except Product.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)
    return JsonResponse(product.to_api_dict())


@require_GET
def page_list(_request):
    pages = []
    for page in ContentPage.objects.live().public().specific():
        pages.append(
            {
                "id": str(page.pk),
                "slug": page.slug,
                "title": page.title,
                "body": str(page.body),
                "page_kind": page.page_kind,
            }
        )
    return JsonResponse(pages, safe=False)


@require_GET
def post_list(_request):
    posts = []
    for page in MagazineArticlePage.objects.live().public().specific():
        posts.append(
            {
                "id": str(page.pk),
                "slug": page.slug,
                "title": page.title,
                "excerpt": page.excerpt,
                "body": str(page.body),
                "published_at": page.published_at,
                "cover": page.cover,
            }
        )
    return JsonResponse(posts, safe=False)
