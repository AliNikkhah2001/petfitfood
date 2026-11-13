import os
import re
import glob
import urllib.parse
from bs4 import BeautifulSoup

FRONTEND_DIR = os.path.abspath("frontend")
IMAGES_DIR = os.path.join(FRONTEND_DIR, "assets", "images")

# Get list of all local images
local_images = set(os.listdir(IMAGES_DIR))
print(f"Total local images available: {len(local_images)}")

def find_local_image(url_or_name):
    # Extract filename from URL
    clean = re.sub(r'https?://[^\/]+\.optimole\.com/.*?/(https?://.+)', r'\1', url_or_name)
    clean = clean.split("?")[0].split("#")[0]
    fname = os.path.basename(urllib.parse.unquote(clean))
    
    if fname in local_images:
        return f"/assets/images/{fname}"
        
    # Try case insensitive match or matching without extension
    base, ext = os.path.splitext(fname)
    for img in local_images:
        if img.lower() == fname.lower() or img.startswith(base):
            return f"/assets/images/{img}"
            
    return None

def fix_html(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    fixed_count = 0

    for img in soup.find_all(["img", "image"]):
        # Check all possible attribute holding the real image
        candidate_urls = []
        for attr in ["data-opt-src", "data-src", "data-lazy-src", "data-original", "src"]:
            v = img.get(attr)
            if v and not v.startswith("data:image"):
                candidate_urls.append(v)

        real_url = candidate_urls[0] if candidate_urls else None

        if real_url:
            local_path = find_local_image(real_url)
            if local_path:
                img["src"] = local_path
                fixed_count += 1
            else:
                # If not found locally, try to download or clean
                clean_url = re.sub(r'https?://[^\/]+\.optimole\.com/.*?/(https?://.+)', r'\1', real_url)
                fname = os.path.basename(urllib.parse.unquote(clean_url))
                if fname:
                    img["src"] = f"/assets/images/{fname}"
                    fixed_count += 1

        # Remove lazy/optimole data placeholders
        for attr in ["data-opt-src", "data-src", "data-lazy-src", "data-optimole-src"]:
            if img.has_attr(attr):
                del img[attr]

        # Fix srcset if it contains svg placeholder or optimole
        if img.has_attr("srcset"):
            srcset_val = img["srcset"]
            if "optimole.com" in srcset_val or "data:image" in srcset_val:
                del img["srcset"]

    # Also remove class="optml_no_js" from html tag
    html_tag = soup.find("html")
    if html_tag and html_tag.has_attr("class"):
        classes = html_tag["class"]
        if "optml_no_js" in classes:
            classes.remove("optml_no_js")
            html_tag["class"] = classes

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(str(soup))
        
    return fixed_count

def main():
    all_html = glob.glob(f"{FRONTEND_DIR}/**/*.html", recursive=True)
    total_fixed = 0
    for h in all_html:
        cnt = fix_html(h)
        total_fixed += cnt
    print(f"Processed {len(all_html)} files, replaced {total_fixed} image sources with real local images.")

if __name__ == "__main__":
    main()
