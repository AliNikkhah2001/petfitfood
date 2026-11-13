import os
import re
import urllib.parse
import urllib.request
import subprocess

THEME_DIR = "/Users/alinikkhah/Desktop/pet not fit/clone/wordpress/theme/kavehTheme"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

def download_file(url, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        return True
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as res:
            with open(dest_path, "wb") as f:
                f.write(res.read())
        print(f"Downloaded: {dest_path}")
        return True
    except Exception as e:
        print(f"Failed {url}: {e}")
        return False

def main():
    print("Extracting URLs from WordPress container...")
    # Get all post meta via wp eval
    php_code = 'global $wpdb; foreach($wpdb->get_col("SELECT meta_value FROM {$wpdb->postmeta} WHERE meta_key LIKE \\"_dodo_%\\"") as $v) { echo $v . PHP_EOL; }'
    cmd = ["docker", "exec", "-i", "wordpress-wp-1", "wp", "eval", php_code, "--allow-root"]
    try:
        raw_output = subprocess.check_output(cmd).decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"Error querying DB: {e}")
        return

    # Extract all wp-content URLs
    urls = set(re.findall(r'https?://dodopet\.ir/wp-content/[^\s\"\'\<\>\)]+', raw_output))
    print(f"Found {len(urls)} wp-content URLs in WordPress database.")

    theme_urls = []
    other_urls = []

    for u in urls:
        # clean query params
        clean = u.split("?")[0].split("#")[0]
        if "/wp-content/themes/kavehTheme/" in clean:
            theme_urls.append(clean)
        else:
            other_urls.append(clean)

    print(f"Theme URLs: {len(theme_urls)}")
    print(f"Other URLs: {len(other_urls)}")

    # 1. Download Theme Assets
    for u in theme_urls:
        rel = u.split("/wp-content/themes/kavehTheme/")[1]
        dest = os.path.join(THEME_DIR, rel)
        download_file(u, dest)

    # 2. Download Other Assets (Plugins, Uploads) and copy to container
    os.makedirs("wp_temp_assets", exist_ok=True)
    for u in other_urls:
        if "/wp-content/" in u:
            rel = u.split("/wp-content/")[1]
            dest = os.path.join("wp_temp_assets", rel)
            if download_file(u, dest):
                # Copy to container
                cont_path = f"/var/www/html/wp-content/{rel}"
                subprocess.run(["docker", "exec", "-i", "wordpress-wp-1", "mkdir", "-p", os.path.dirname(cont_path)], check=False)
                subprocess.run(["docker", "cp", dest, f"wordpress-wp-1:{cont_path}"], check=False)

    print("Asset synchronization complete!")

if __name__ == "__main__":
    main()
