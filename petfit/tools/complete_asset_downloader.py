import os
import re
import json
import urllib.parse
import hashlib
import requests
from bs4 import BeautifulSoup
import glob

BASE_URL = "https://dodopet.ir"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

FRONTEND_DIR = os.path.abspath("frontend")
ASSETS_DIR = os.path.join(FRONTEND_DIR, "assets")

def download(url, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        return True
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            with open(dest_path, "wb") as f:
                f.write(r.content)
            return True
        else:
            print(f"Failed {url}: HTTP {r.status_code}")
    except Exception as e:
        print(f"Error {url}: {e}")
    return False

def clean_optimole(url):
    m = re.search(r'https?://[^\/]+\.optimole\.com/[^\/]+/[^\/]+/[^\/]+/[^\/]+/[^\/]+/(https?://.+)', url)
    if m:
        return m.group(1)
    m2 = re.search(r'https?://[^\/]+\.optimole\.com/.+?/(https?://.+)', url)
    if m2:
        return m2.group(1)
    return url

# 1. Download all items from raw_data/media.json
media_map = {} # maps clean url or basename to /assets/images/...

def process_media_json():
    print("Processing raw_data/media.json...")
    with open("raw_data/media.json", "r", encoding="utf-8") as f:
        media = json.load(f)
    
    for item in media:
        src = item.get("source_url")
        if not src:
            continue
        clean_src = clean_optimole(src)
        parsed = urllib.parse.urlparse(clean_src)
        fname = os.path.basename(parsed.path)
        if not fname:
            continue
        dest = os.path.join(ASSETS_DIR, "images", fname)
        download(clean_src, dest)
        local_rel = f"/assets/images/{fname}"
        media_map[clean_src] = local_rel
        media_map[src] = local_rel
        media_map[fname] = local_rel

        # Also get image sizes/variations if present
        details = item.get("media_details", {})
        sizes = details.get("sizes", {})
        for sname, sinfo in sizes.items():
            s_url = sinfo.get("source_url")
            if s_url:
                c_s_url = clean_optimole(s_url)
                s_fname = os.path.basename(urllib.parse.urlparse(c_s_url).path)
                s_dest = os.path.join(ASSETS_DIR, "images", s_fname)
                download(c_s_url, s_dest)
                s_rel = f"/assets/images/{s_fname}"
                media_map[c_s_url] = s_rel
                media_map[s_url] = s_rel
                media_map[s_fname] = s_rel

    print(f"Media cataloged: {len(media_map)} mappings.")

def get_or_download_asset(url, default_sub="images"):
    clean_url = clean_optimole(url)
    if clean_url in media_map:
        return media_map[clean_url]
    if url in media_map:
        return media_map[url]
        
    parsed = urllib.parse.urlparse(clean_url)
    fname = os.path.basename(parsed.path)
    if not fname:
        h = hashlib.md5(url.encode()).hexdigest()[:8]
        fname = f"asset_{h}.bin"
        
    if fname in media_map:
        return media_map[fname]
        
    sub = default_sub
    if fname.lower().endswith(('.woff', '.woff2', '.ttf', '.eot', '.otf')):
        sub = "fonts"
    elif fname.lower().endswith(('.css')):
        sub = "css"
    elif fname.lower().endswith(('.js')):
        sub = "js"
    elif fname.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico')):
        sub = "images"

    dest = os.path.join(ASSETS_DIR, sub, fname)
    if download(clean_url, dest):
        rel = f"/assets/{sub}/{fname}"
        media_map[clean_url] = rel
        media_map[url] = rel
        media_map[fname] = rel
        return rel
    return url

def clean_html_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")

    # 1. Fix link tags (preload, stylesheet, icon, etc.)
    for link in soup.find_all("link", href=True):
        href = link["href"]
        if "dodopet.ir/wp-content" in href or "fonts.googleapis.com" in href or href.endswith((".css", ".woff2", ".ttf", ".png", ".jpg", ".ico")):
            link["href"] = get_or_download_asset(href, default_sub="css")

    # 2. Fix script tags
    for script in soup.find_all("script", src=True):
        src = script["src"]
        if "dodopet.ir/wp-content" in src or "optimole_lib" in src:
            if "optimole_lib" in src:
                # Remove optimole_lib script to avoid it replacing image sources on client side
                script.decompose()
                continue
            script["src"] = get_or_download_asset(src, default_sub="js")

    # 3. Fix img tags: ensure real src is populated, not placeholder
    for img in soup.find_all(["img", "image"]):
        # Check if there is data-src, data-lazy-src, data-optimole-src
        real_src = None
        for attr in ["data-src", "data-lazy-src", "data-optimole-src", "src"]:
            v = img.get(attr)
            if v and not v.startswith("data:image/svg+xml"):
                real_src = v
                break
        
        if real_src:
            local_src = get_or_download_asset(real_src, default_sub="images")
            img["src"] = local_src
            
        # Clean data-src and srcset
        for attr in ["data-src", "data-lazy-src", "data-optimole-src"]:
            if img.has_attr(attr):
                img[attr] = img.get("src", "")
                
        if img.has_attr("srcset"):
            # Clean up srcset entries
            parts = img["srcset"].split(",")
            new_p = []
            for p in parts:
                sp = p.strip().split()
                if sp:
                    u = sp[0]
                    if not u.startswith("data:"):
                        loc = get_or_download_asset(u, default_sub="images")
                        sp[0] = loc
                        new_p.append(" ".join(sp))
            if new_p:
                img["srcset"] = ", ".join(new_p)

        if img.has_attr("data-srcset"):
            img["data-srcset"] = img.get("srcset", "")

    # 4. Remove any inline optimole noscript tags or fix noscript images
    for noscript in soup.find_all("noscript"):
        ns_html = str(noscript)
        if "optimole" in ns_html or "data-src" in ns_html:
            pass # Keep it harmless

    # 5. Save back
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(str(soup))

def main():
    process_media_json()
    print("Processing all HTML files...")
    all_html = glob.glob(f"{FRONTEND_DIR}/**/*.html", recursive=True)
    for h in all_html:
        clean_html_file(h)
    print(f"Processed {len(all_html)} HTML files successfully.")

if __name__ == "__main__":
    main()
