import os
import re
import urllib.parse
import hashlib
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://dodopet.ir"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

OUTPUT_DIR = os.path.abspath("frontend")
ASSETS_DIR = os.path.join(OUTPUT_DIR, "assets")

URLS = [
    # Home
    "https://dodopet.ir/",
    # Pages
    "https://dodopet.ir/magazine/fresh-dog-food/",
    "https://dodopet.ir/magazine/",
    "https://dodopet.ir/subscriptions/",
    "https://dodopet.ir/about-us/",
    "https://dodopet.ir/faq/",
    "https://dodopet.ir/contact-us/",
    "https://dodopet.ir/dashboard/",
    "https://dodopet.ir/store-listing/",
    "https://dodopet.ir/privacy-policy/",
    "https://dodopet.ir/terms_conditions/",
    "https://dodopet.ir/klogin/",
    "https://dodopet.ir/wishlist/",
    "https://dodopet.ir/register/",
    "https://dodopet.ir/my-orders/",
    "https://dodopet.ir/shop/",
    "https://dodopet.ir/cart/",
    "https://dodopet.ir/checkout/",
    "https://dodopet.ir/my-account/",
    "https://dodopet.ir/sample-page/",
    # Posts
    "https://dodopet.ir/fresh-vs-dry-dog-food/",
    "https://dodopet.ir/fresh-food-for-puppies/",
    "https://dodopet.ir/fresh-dog-food-digestion/",
    "https://dodopet.ir/fresh-vs-raw-dog-food/",
    "https://dodopet.ir/fresh-dog-food-benefits/",
    # Products
    "https://dodopet.ir/product/intro-turkey-pack/",
    "https://dodopet.ir/product/subscription-14-day-chicken-medium/",
    "https://dodopet.ir/product/intro-chicken-pack/",
    "https://dodopet.ir/product/subscription-14-day-turkey-large/",
    "https://dodopet.ir/product/subscription-14-day-chicken-large/",
    "https://dodopet.ir/product/subscription-14-day-turkey-medium/",
    "https://dodopet.ir/product/subscription-14-day-turkey-mini/",
    "https://dodopet.ir/product/subscription-14-day-chicken-mini/",
    "https://dodopet.ir/product/subscription-7-day-turkey-large/",
    "https://dodopet.ir/product/subscription-7-day-turkey-medium/",
    "https://dodopet.ir/product/subscription-7-day-turkey-mini/",
    "https://dodopet.ir/product/subscription-7-day-chicken-large/",
    "https://dodopet.ir/product/subscription-7-day-chicken-medium/",
    "https://dodopet.ir/product/subscription-7-day-chicken-mini/",
    "https://dodopet.ir/product/custom-subscription/",
    # Categories
    "https://dodopet.ir/product-category/subscription-14-day/",
    "https://dodopet.ir/product-category/custom-dog-food/",
    "https://dodopet.ir/product-category/subscription-7-day/",
    "https://dodopet.ir/product-category/intro-pack/",
    "https://dodopet.ir/product-category/small-dogs/",
    "https://dodopet.ir/product-category/medium-dogs/",
    "https://dodopet.ir/product-category/large-dogs/"
]

# Track downloaded asset URLs to local paths
downloaded_assets = {}

def get_local_path_for_url(url, asset_type="other"):
    """Determines a local filename and relative path for a given asset URL."""
    clean_url = url.split("?")[0].split("#")[0]
    parsed = urllib.parse.urlparse(clean_url)
    filename = os.path.basename(parsed.path)
    
    if not filename or "." not in filename:
        h = hashlib.md5(url.encode()).hexdigest()[:8]
        ext = ".css" if asset_type == "css" else (".js" if asset_type == "js" else ".bin")
        filename = f"asset_{h}{ext}"
    else:
        # Sanitize filename
        filename = re.sub(r'[^a-zA-Z0-9_\.\-]', '_', filename)
        # Avoid collisions
        h = hashlib.md5(url.encode()).hexdigest()[:6]
        base, ext = os.path.splitext(filename)
        filename = f"{base}_{h}{ext}"

    if asset_type == "css":
        sub = "css"
    elif asset_type == "js":
        sub = "js"
    elif asset_type == "font" or filename.lower().endswith(('.woff', '.woff2', '.ttf', '.eot', '.otf')):
        sub = "fonts"
    elif asset_type == "image" or filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico')):
        sub = "images"
    else:
        sub = "other"

    local_abs = os.path.join(ASSETS_DIR, sub, filename)
    rel_path = f"/assets/{sub}/{filename}"
    return local_abs, rel_path

def download_file(url, local_path):
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            with open(local_path, "wb") as f:
                f.write(r.content)
            return True
        else:
            print(f"Failed to download {url}: status {r.status_code}")
            return False
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def clean_optimole_url(url):
    """If an image is wrapped by optimole CDN, extract the real or direct url"""
    match = re.search(r'https?://[^\/]+\.optimole\.com/[^\/]+/[^\/]+/[^\/]+/[^\/]+/[^\/]+/(https?://.+)', url)
    if match:
        return match.group(1)
    return url

def process_css_content(css_content, css_url, depth=0):
    """Processes CSS content to find background images and fonts, downloads them, and updates URLs."""
    if depth > 2:
        return css_content
        
    def replace_url(match):
        raw_val = match.group(1).strip('\'"')
        if raw_val.startswith("data:") or not raw_val:
            return match.group(0)
        
        full_asset_url = urllib.parse.urljoin(css_url, raw_val)
        full_asset_url = clean_optimole_url(full_asset_url)
        
        if full_asset_url not in downloaded_assets:
            local_abs, rel_path = get_local_path_for_url(full_asset_url)
            if download_file(full_asset_url, local_abs):
                downloaded_assets[full_asset_url] = rel_path
            else:
                downloaded_assets[full_asset_url] = full_asset_url
                
        return f"url('{downloaded_assets[full_asset_url]}')"

    new_css = re.sub(r'url\((.*?)\)', replace_url, css_content, flags=re.IGNORECASE)
    return new_css

def download_and_process_css(css_url):
    if css_url in downloaded_assets:
        return downloaded_assets[css_url]
        
    local_abs, rel_path = get_local_path_for_url(css_url, asset_type="css")
    try:
        r = requests.get(css_url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            content = r.text
            # Process nested fonts/images
            processed_content = process_css_content(content, css_url)
            os.makedirs(os.path.dirname(local_abs), exist_ok=True)
            with open(local_abs, "w", encoding="utf-8") as f:
                f.write(processed_content)
            downloaded_assets[css_url] = rel_path
            return rel_path
    except Exception as e:
        print(f"Error fetching CSS {css_url}: {e}")
        
    downloaded_assets[css_url] = css_url
    return css_url

def download_asset(url, asset_type):
    url = clean_optimole_url(url)
    if url in downloaded_assets:
        return downloaded_assets[url]
        
    local_abs, rel_path = get_local_path_for_url(url, asset_type=asset_type)
    if download_file(url, local_abs):
        downloaded_assets[url] = rel_path
        return rel_path
    downloaded_assets[url] = url
    return url

def mirror_url(page_url):
    print(f"\nMirroring page: {page_url}")
    try:
        r = requests.get(page_url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        html = r.text
    except Exception as e:
        print(f"Failed to fetch {page_url}: {e}")
        return

    soup = BeautifulSoup(html, "html.parser")

    # 1. Process CSS
    for link in soup.find_all("link", rel=lambda x: x and "stylesheet" in x):
        href = link.get("href")
        if href:
            full_url = urllib.parse.urljoin(page_url, href)
            local_rel = download_and_process_css(full_url)
            link["href"] = local_rel

    # 2. Process JS scripts
    for script in soup.find_all("script", src=True):
        src = script.get("src")
        if src:
            full_url = urllib.parse.urljoin(page_url, src)
            local_rel = download_asset(full_url, "js")
            script["src"] = local_rel

    # 3. Process Images
    for img in soup.find_all(["img", "image"]):
        # src
        for attr in ["src", "data-src", "data-lazy-src", "data-optimole-src"]:
            src_val = img.get(attr)
            if src_val:
                full_url = urllib.parse.urljoin(page_url, src_val)
                local_rel = download_asset(full_url, "image")
                img[attr] = local_rel
                if attr != "src" and not img.get("src"):
                    img["src"] = local_rel
        # srcset
        for attr in ["srcset", "data-srcset"]:
            srcset_val = img.get(attr)
            if srcset_val:
                parts = srcset_val.split(",")
                new_parts = []
                for part in parts:
                    items = part.strip().split()
                    if items:
                        u = items[0]
                        fu = urllib.parse.urljoin(page_url, u)
                        lr = download_asset(fu, "image")
                        items[0] = lr
                        new_parts.append(" ".join(items))
                img[attr] = ", ".join(new_parts)

    # 4. Process Source tags (picture)
    for source in soup.find_all("source"):
        for attr in ["srcset", "src"]:
            val = source.get(attr)
            if val:
                parts = val.split(",")
                new_parts = []
                for part in parts:
                    items = part.strip().split()
                    if items:
                        u = items[0]
                        fu = urllib.parse.urljoin(page_url, u)
                        lr = download_asset(fu, "image")
                        items[0] = lr
                        new_parts.append(" ".join(items))
                source[attr] = ", ".join(new_parts)

    # 5. Process inline style url(...)
    for tag in soup.find_all(style=True):
        style_val = tag["style"]
        if "url(" in style_val:
            def repl_style_url(m):
                u = m.group(1).strip('\'"')
                if u.startswith("data:"):
                    return m.group(0)
                fu = urllib.parse.urljoin(page_url, u)
                lr = download_asset(fu, "image")
                return f"url('{lr}')"
            tag["style"] = re.sub(r'url\((.*?)\)', repl_style_url, style_val, flags=re.IGNORECASE)

    # 6. Process favicon / icons
    for icon in soup.find_all("link", rel=lambda x: x and any(k in str(x).lower() for k in ["icon", "apple-touch-icon"])):
        href = icon.get("href")
        if href:
            full_url = urllib.parse.urljoin(page_url, href)
            local_rel = download_asset(full_url, "image")
            icon["href"] = local_rel

    # 7. Convert internal site links to relative paths so clicking links navigates locally
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith(BASE_URL) or href.startswith("http://dodopet.ir") or href.startswith("/"):
            parsed_a = urllib.parse.urlparse(href)
            path = parsed_a.path
            if path == "" or path == "/":
                a["href"] = "/index.html"
            else:
                clean_p = path.strip("/")
                a["href"] = f"/{clean_p}/index.html"

    # Determine local save path
    parsed = urllib.parse.urlparse(page_url)
    path = parsed.path.strip("/")
    if not path:
        target_file = os.path.join(OUTPUT_DIR, "index.html")
    else:
        target_file = os.path.join(OUTPUT_DIR, path, "index.html")

    os.makedirs(os.path.dirname(target_file), exist_ok=True)
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(str(soup))
    print(f"Saved: {target_file}")

def main():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    print(f"Starting crawl of {len(URLS)} URLs...")
    for u in URLS:
        mirror_url(u)
    print(f"\nDone! Downloaded {len(downloaded_assets)} unique assets.")

if __name__ == "__main__":
    main()
