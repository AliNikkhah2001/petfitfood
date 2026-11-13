import os
import json
import requests

BASE_URL = "https://dodopet.ir"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch_json(url):
    print(f"Fetching: {url}")
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        return r.json(), r.headers
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None, None

def fetch_all_paginated(endpoint):
    page = 1
    all_data = []
    while True:
        url = f"{BASE_URL}/wp-json/{endpoint}?per_page=100&page={page}"
        data, headers = fetch_json(url)
        if not data or not isinstance(data, list):
            break
        all_data.extend(data)
        total_pages = int(headers.get("X-WP-TotalPages", 1)) if headers else 1
        print(f"  Got page {page}/{total_pages} ({len(data)} items)")
        if page >= total_pages:
            break
        page += 1
    return all_data

def main():
    os.makedirs("raw_data", exist_ok=True)

    # 1. Site Info
    site_info, _ = fetch_json(f"{BASE_URL}/wp-json/")
    with open("raw_data/site_info.json", "w", encoding="utf-8") as f:
        json.dump(site_info, f, ensure_ascii=False, indent=2)

    # 2. Pages
    print("Fetching Pages...")
    pages = fetch_all_paginated("wp/v2/pages")
    with open("raw_data/pages.json", "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(pages)} pages.")

    # 3. Posts
    print("Fetching Posts...")
    posts = fetch_all_paginated("wp/v2/posts")
    with open("raw_data/posts.json", "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(posts)} posts.")

    # 4. Categories
    print("Fetching Post Categories...")
    cats = fetch_all_paginated("wp/v2/categories")
    with open("raw_data/categories.json", "w", encoding="utf-8") as f:
        json.dump(cats, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(cats)} categories.")

    # 5. Media
    print("Fetching Media...")
    media = fetch_all_paginated("wp/v2/media")
    with open("raw_data/media.json", "w", encoding="utf-8") as f:
        json.dump(media, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(media)} media items.")

    # 6. WooCommerce Products
    print("Fetching WooCommerce Products...")
    products, _ = fetch_json(f"{BASE_URL}/wp-json/wc/store/v1/products?per_page=100")
    if products:
        with open("raw_data/products.json", "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(products)} products.")

    # 7. WooCommerce Categories
    print("Fetching WooCommerce Categories...")
    wc_cats, _ = fetch_json(f"{BASE_URL}/wp-json/wc/store/v1/products/categories?per_page=100")
    if wc_cats:
        with open("raw_data/product_categories.json", "w", encoding="utf-8") as f:
            json.dump(wc_cats, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(wc_cats)} product categories.")

if __name__ == "__main__":
    main()
