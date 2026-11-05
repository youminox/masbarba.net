import json
import os
import re
import ssl
import socket
import http.client
import urllib.parse
import unicodedata
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
IMAGES_DIR = os.path.join(ROOT_DIR, "public", "images")

os.makedirs(IMAGES_DIR, exist_ok=True)

HOST_IP = "77.37.85.66"
DOMAIN = "masbarba.net"
SSL_CTX = ssl._create_unverified_context()


def clean_filename(url: str) -> str:
    raw = urllib.parse.unquote(url.split("/")[-1].split("?")[0])
    name, ext = os.path.splitext(raw)
    norm = unicodedata.normalize("NFD", name)
    ascii_name = "".join(c for c in norm if unicodedata.category(c) != "Mn")
    ascii_name = re.sub(r"-en-20\d\d\b", "", ascii_name, flags=re.I)
    ascii_name = re.sub(r"-20\d\d\b", "", ascii_name, flags=re.I)
    ascii_name = re.sub(r"[^a-zA-Z0-9._-]+", "-", ascii_name)
    ascii_name = re.sub(r"-{2,}", "-", ascii_name).strip("-._")
    ext_clean = ext.lower() if ext.lower() in (".jpg", ".jpeg", ".png", ".webp", ".gif") else ".jpg"
    return f"{ascii_name or 'imagen'}{ext_clean}"


def fetch_from_origin(url: str, redirects: int = 0) -> bytes:
    if redirects > 3:
        raise RuntimeError("Too many redirects")
    parsed = urllib.parse.urlsplit(url)
    unquoted_path = urllib.parse.unquote(parsed.path)
    encoded_path = urllib.parse.quote(unquoted_path, safe="/%")

    raw_sock = socket.create_connection((HOST_IP, 443), timeout=20)
    ssl_sock = SSL_CTX.wrap_socket(raw_sock, server_hostname=DOMAIN)
    conn = http.client.HTTPSConnection(DOMAIN, 443, timeout=20, context=SSL_CTX)
    conn.sock = ssl_sock
    try:
        conn.request(
            "GET",
            encoded_path,
            headers={
                "Host": DOMAIN,
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                "Accept": "image/*,*/*;q=0.8",
            },
        )
        resp = conn.getresponse()
        data = resp.read()
        status = resp.status
        loc = resp.getheader("Location")
    finally:
        conn.close()

    if status in (301, 302, 307, 308) and loc:
        return fetch_from_origin(loc, redirects + 1)
    if status != 200:
        raise RuntimeError(f"HTTP {status}")
    return data


def download_and_optimize(url: str):
    fname = clean_filename(url)
    dest = os.path.join(IMAGES_DIR, fname)
    if os.path.exists(dest) and os.path.getsize(dest) > 300:
        return url, f"/images/{fname}", True, "cached"

    last_err = "unknown"
    for attempt in range(3):
        try:
            data = fetch_from_origin(url)
            if len(data) < 200:
                raise RuntimeError("Empty image")
            if HAS_PIL:
                try:
                    im = Image.open(BytesIO(data))
                    max_w = 880
                    if im.width > max_w:
                        new_h = int(im.height * (max_w / im.width))
                        im = im.resize((max_w, new_h), Image.Resampling.LANCZOS)
                    if fname.endswith((".jpg", ".jpeg")):
                        im = im.convert("RGB")
                        im.save(dest, "JPEG", quality=82, optimize=True)
                    elif fname.endswith(".png"):
                        im.save(dest, "PNG", optimize=True)
                    elif fname.endswith(".webp"):
                        im.save(dest, "WEBP", quality=82)
                    else:
                        with open(dest, "wb") as f:
                            f.write(data)
                except Exception:
                    with open(dest, "wb") as f:
                        f.write(data)
            else:
                with open(dest, "wb") as f:
                    f.write(data)
            return url, f"/images/{fname}", True, "downloaded"
        except Exception as e:
            last_err = str(e)
    return url, f"/images/{fname}", False, last_err


def main():
    with open(os.path.join(DATA_DIR, "image-urls.json"), "r", encoding="utf-8") as f:
        urls = json.load(f)

    print(f"🚀 Downloading and optimizing {len(urls)} images from {DOMAIN} ({HOST_IP})...")
    url_map = {}
    ok_count = 0
    fail_count = 0

    with ThreadPoolExecutor(max_workers=24) as pool:
        futures = {pool.submit(download_and_optimize, u): u for u in urls}
        for idx, fut in enumerate(as_completed(futures), 1):
            orig_url, local_path, success, msg = fut.result()
            url_map[orig_url] = local_path
            if success:
                ok_count += 1
            else:
                fail_count += 1
            if idx % 100 == 0 or idx == len(urls):
                print(f"  Progress: {idx}/{len(urls)} (OK: {ok_count}, Fail: {fail_count})")

    # Rewrite URLs in posts.json and pages.json
    for json_file in ("posts.json", "pages.json"):
        p_path = os.path.join(DATA_DIR, json_file)
        with open(p_path, "r", encoding="utf-8") as f:
            items = json.load(f)

        for item in items:
            feat = item.get("featuredImageUrl", "")
            if feat:
                item["featuredImageUrl"] = url_map.get(feat, f"/images/{clean_filename(feat)}")
            content = item.get("content", "")
            if content:
                def repl_img(m):
                    u = m.group(0)
                    return url_map.get(u, f"/images/{clean_filename(u)}")
                item["content"] = re.sub(
                    r"https?://(?:www\.)?masbarba\.net/wp-content/uploads/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp|gif)",
                    repl_img,
                    content,
                    flags=re.I,
                )

        with open(p_path, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"✅ Finished! {ok_count}/{len(urls)} images downloaded and mapped locally.")


if __name__ == "__main__":
    main()
