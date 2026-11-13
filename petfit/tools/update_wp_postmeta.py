import os
import json
import subprocess
from bs4 import BeautifulSoup

FRONTEND_DIR = os.path.abspath("frontend")

PAGE_MAP = {
    # Front page
    2118: "index.html",
    # Pages
    14829: "subscriptions/index.html",
    11368: "register/index.html",
    18: "my-account/index.html",
    15: "shop/index.html",
    11634: "contact-us/index.html",
    16277: "magazine/index.html",
    13895: "privacy-policy/index.html",
    13819: "faq/index.html",
    11674: "wishlist/index.html",
    11633: "about-us/index.html",
    11500: "klogin/index.html",
    178: "store-listing/index.html",
    17: "checkout/index.html",
    16: "cart/index.html",
    3: "terms_conditions/index.html",
    # Posts
    16525: "fresh-food-for-puppies/index.html",
    16486: "fresh-dog-food-digestion/index.html",
    16449: "fresh-vs-raw-dog-food/index.html",
    16368: "fresh-vs-dry-dog-food/index.html",
    16309: "fresh-dog-food-benefits/index.html"
}

# Add products by querying WordPress product IDs and matching slugs
def get_products():
    cmd = ["docker", "exec", "-i", "wordpress-wp-1", "wp", "post", "list", 
           "--post_type=product", "--fields=ID,post_name", "--format=json", "--allow-root"]
    res = subprocess.check_output(cmd).decode("utf-8")
    return json.loads(res)

def extract_head_and_body(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    # Get head inner HTML
    head = soup.find("head")
    head_html = ""
    if head:
        head_html = "".join(str(c) for c in head.contents)

    # Get body inner HTML
    body = soup.find("body")
    body_html = ""
    if body:
        body_html = "".join(str(c) for c in body.contents)
    else:
        body_html = str(soup)

    return head_html, body_html

def main():
    # Merge products
    products = get_products()
    for p in products:
        pid = p["ID"]
        slug = p["post_name"]
        rel_p = f"product/{slug}/index.html"
        if os.path.exists(os.path.join(FRONTEND_DIR, rel_p)):
            PAGE_MAP[pid] = rel_p

    print(f"Total items to update in WordPress database: {len(PAGE_MAP)}")

    # Create temporary directory to stage update files
    os.makedirs("wp_updates", exist_ok=True)

    for pid, rel_path in PAGE_MAP.items():
        full_path = os.path.join(FRONTEND_DIR, rel_path)
        if not os.path.exists(full_path):
            print(f"Skipping {pid} ({rel_path}): not found")
            continue

        head_html, body_html = extract_head_and_body(full_path)
        
        # Save to temp json for PHP script
        item_data = {
            "id": pid,
            "head": head_html,
            "body": body_html
        }
        json_file = f"wp_updates/item_{pid}.json"
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(item_data, f)

        # Copy to container and update via PHP
        subprocess.run(["docker", "cp", json_file, f"wordpress-wp-1:/tmp/item_{pid}.json"], check=True)
        
        php_cmd = f"""
        require_once '/var/www/html/wp-load.php';
        $json = json_decode(file_get_contents('/tmp/item_{pid}.json'), true);
        if ($json) {{
            update_post_meta($json['id'], '_dodo_head', $json['head']);
            update_post_meta($json['id'], '_dodo_body_html', $json['body']);
            unlink('/tmp/item_{pid}.json');
            echo 'OK ' . $json['id'] . PHP_EOL;
        }}
        """
        res = subprocess.run(["docker", "exec", "-i", "wordpress-wp-1", "php", "-r", php_cmd], capture_output=True, text=True)
        print(f"Updated post {pid} ({rel_path}): {res.stdout.strip()}")

    print("All items updated in WordPress database!")

if __name__ == "__main__":
    main()
