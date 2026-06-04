#!/usr/bin/env python3
"""
Tambahkan backlink ke Article #2 (web-ecommerce) di 3 artikel yang paling relevan.
Artikel target:
  - cara-jualan-online-tanpa-potongan-marketplace
  - biaya-admin-marketplace-mahal-hitung-kerugian
  - website-toko-online-lemot-kerugian-omzet
"""

import os, sys, getpass, requests

BASE_URL = "https://www.calius.digital"

NEW_SLUG  = "web-ecommerce-panduan-toko-online-2026"
NEW_TITLE = "Web E-Commerce: Panduan Lengkap Membangun Toko Online Sukses 2026"
LINK_HTML = (
    f'<p>Baca juga: <a href="/blog/{NEW_SLUG}">'
    f'{NEW_TITLE}</a></p>'
)

# Artikel yang akan diupdate + teks anchor untuk mencari posisi sisipan
TARGETS = [
    (
        "cara-jualan-online-tanpa-potongan-marketplace",
        # sisipkan setelah paragraf yang menyebut "website sendiri" / "toko online"
        "toko online",
    ),
    (
        "biaya-admin-marketplace-mahal-hitung-kerugian",
        # sisipkan setelah paragraf biaya / kerugian
        "komisi",
    ),
    (
        "website-toko-online-lemot-kerugian-omzet",
        # sisipkan setelah paragraf pertama yang bicara solusi
        "website",
    ),
]

# ── Auth ──────────────────────────────────────────────────────────────────────
username = os.environ.get("ADMIN_USERNAME") or input("Username: ").strip()
password = os.environ.get("ADMIN_PASSWORD") or getpass.getpass("Password: ")

r = requests.post(f"{BASE_URL}/api/auth/login",
                  json={"username": username, "password": password})
if r.status_code != 200:
    print(f"❌ Login gagal: {r.status_code}")
    sys.exit(1)
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
print("✅ Login berhasil\n")

# ── Update each article ───────────────────────────────────────────────────────
for slug, anchor_hint in TARGETS:
    print(f"📝 Memproses: {slug}")

    r = requests.get(f"{BASE_URL}/api/blog/{slug}")
    if r.status_code != 200:
        print(f"  ❌ Gagal fetch ({r.status_code})\n")
        continue

    article = r.json()
    content = article.get("content_id", "")

    if f"/blog/{NEW_SLUG}" in content:
        print(f"  ⏭️  Link sudah ada, skip\n")
        continue

    # Cari posisi sisipan: setelah </p> pertama yang mengandung anchor_hint
    idx = content.lower().find(anchor_hint.lower())
    if idx != -1:
        end = content.find("</p>", idx)
        insert_pos = end + 4 if end != -1 else len(content)
    else:
        # fallback: setelah </p> kedua
        first  = content.find("</p>")
        second = content.find("</p>", first + 1) if first != -1 else -1
        insert_pos = second + 4 if second != -1 else len(content)

    new_content = content[:insert_pos] + "\n" + LINK_HTML + content[insert_pos:]
    print(f"  ✏️  Content diupdate ({len(content)} → {len(new_content)} chars)")

    article["content_id"] = new_content

    article_id = article.get("id") or article.get("_id")
    put = requests.put(
        f"{BASE_URL}/api/admin/blog/{article_id}",
        headers=headers, json=article
    )
    if put.status_code in (200, 201):
        print(f"  ✅ Berhasil → https://www.calius.digital/blog/{slug}\n")
    else:
        print(f"  ❌ Gagal PUT ({put.status_code}): {put.text[:200]}\n")

print("=" * 65)
print(" ✅ Selesai! Backlink ke Article #2 sudah ditambahkan.")
print("=" * 65)
