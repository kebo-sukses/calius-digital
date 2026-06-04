#!/usr/bin/env python3
"""
Sisipkan template showcase block yang relevan ke setiap artikel blog.
Mapping artikel → template yang paling relevan:
  - web-ecommerce              → skincare-e-commerce
  - contoh-umroh               → umroh-landing-page + travelgo-landing-page
  - template-rental-mobil      → honda-dealer-landing-page
  - panduan-landing-page       → skincare-e-commerce + sepeda-listrik + travelgo
  - cara-jualan-online         → skincare-e-commerce
  - biaya-admin-marketplace    → skincare-e-commerce
  - website-toko-lemot         → skincare-e-commerce
"""

import os, sys, getpass, requests

BASE_URL = "https://www.calius.digital"

# ── Template data (slug → display info) ────────────────────────────────────────
TEMPLATES = {
    "skincare-e-commerce": {
        "name": "Skincare E-Commerce",
        "desc": "Toko online skincare profesional dengan katalog produk, keranjang belanja, checkout, dan integrasi WhatsApp. Mobile-first, fast loading.",
        "price": "Rp 4.300.000",
        "badge": "E-Commerce",
    },
    "honda-dealer-landing-page": {
        "name": "Dealer Motor Landing Page",
        "desc": "Landing page dealer motor / kendaraan dengan form test drive, galeri produk, dan tombol WhatsApp langsung. Konversi tinggi.",
        "price": "Rp 750.000",
        "badge": "Landing Page",
    },
    "umroh-landing-page": {
        "name": "Umroh Premium Landing Page",
        "desc": "Landing page travel umroh profesional dengan paket harga, galeri, testimoni, dan form pendaftaran terintegrasi WhatsApp.",
        "price": "Rp 599.000",
        "badge": "Travel & Umroh",
    },
    "travelgo-landing-page": {
        "name": "TravelGo Landing Page",
        "desc": "Template website travel modern dengan destinasi wisata, paket tour, galeri foto, dan booking form yang responsif.",
        "price": "Rp 750.000",
        "badge": "Travel",
    },
    "sepeda-listrik-landing-page": {
        "name": "Sepeda Listrik Landing Page",
        "desc": "Landing page produk kendaraan listrik dengan spesifikasi, galeri, keunggulan produk, dan CTA WhatsApp yang powerful.",
        "price": "Rp 750.000",
        "badge": "Produk",
    },
}


def make_template_block(template_slugs: list[str]) -> str:
    """Buat HTML showcase block untuk 1 atau lebih template."""
    cards = ""
    for ts in template_slugs:
        t = TEMPLATES[ts]
        cards += f"""
    <div style="flex:1; min-width:220px; background:#111; border:1px solid #333; border-radius:10px; padding:16px; display:flex; flex-direction:column; gap:8px;">
      <span style="font-size:0.7rem; font-weight:700; color:#FF4500; text-transform:uppercase; letter-spacing:.05em;">{t['badge']}</span>
      <strong style="color:#fff; font-size:0.95rem;">{t['name']}</strong>
      <p style="color:#aaa; font-size:0.82rem; margin:0; line-height:1.5;">{t['desc']}</p>
      <div style="margin-top:auto; padding-top:10px; display:flex; align-items:center; justify-content:space-between;">
        <span style="color:#4ade80; font-weight:700; font-size:0.9rem;">{t['price']}</span>
        <a href="/templates/{ts}" style="background:#FF4500; color:#fff; padding:6px 14px; border-radius:6px; font-size:0.8rem; font-weight:600; text-decoration:none;">Lihat Detail →</a>
      </div>
    </div>"""

    return f"""
<div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%); border:1px solid #FF4500; border-radius:14px; padding:20px 20px 16px; margin:28px 0;">
  <p style="color:#FF4500; font-weight:700; font-size:0.8rem; text-transform:uppercase; letter-spacing:.07em; margin:0 0 14px;">🎨 Template Calius Digital — Siap Pakai</p>
  <div style="display:flex; flex-wrap:wrap; gap:14px;">{cards}
  </div>
  <p style="color:#666; font-size:0.75rem; margin:14px 0 0; text-align:right;"><a href="/templates" style="color:#FF4500; text-decoration:none;">Lihat semua template →</a></p>
</div>
"""


# Mapping: artikel slug → template slugs yang relevan + anchor teks pencari posisi sisipan
ARTICLE_TEMPLATE_MAP = [
    (
        "web-ecommerce-panduan-toko-online-2026",
        ["skincare-e-commerce"],
        "Siap Punya Web E-Commerce Sendiri",   # sisipkan SEBELUM CTA block ini
    ),
    (
        "contoh-landing-page-travel-umroh-konversi-tinggi",
        ["umroh-landing-page", "travelgo-landing-page"],
        "Author Box",                           # fallback: akhir artikel
    ),
    (
        "template-website-rental-mobil-terintegrasi-whatsapp",
        ["honda-dealer-landing-page"],
        "Author Box",
    ),
    (
        "panduan-lengkap-landing-page-2026",
        ["skincare-e-commerce", "travelgo-landing-page", "sepeda-listrik-landing-page"],
        "Author Box",
    ),
    (
        "cara-jualan-online-tanpa-potongan-marketplace",
        ["skincare-e-commerce"],
        "Author Box",
    ),
    (
        "biaya-admin-marketplace-mahal-hitung-kerugian",
        ["skincare-e-commerce"],
        "Author Box",
    ),
    (
        "website-toko-online-lemot-kerugian-omzet",
        ["skincare-e-commerce"],
        "Author Box",
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
print("=" * 65)

for article_slug, template_slugs, anchor_hint in ARTICLE_TEMPLATE_MAP:
    print(f"📝 {article_slug}")

    r = requests.get(f"{BASE_URL}/api/blog/{article_slug}")
    if r.status_code != 200:
        print(f"   ❌ Gagal fetch\n")
        continue

    article = r.json()
    content = article.get("content_id", "")

    # Cek apakah sudah ada link template spesifik
    already = [ts for ts in template_slugs if f"/templates/{ts}" in content]
    if already:
        print(f"   ⏭️  Sudah ada: {already} — skip\n")
        continue

    showcase_block = make_template_block(template_slugs)

    # Posisi sisipan: cari anchor, sisipkan sebelumnya
    # Untuk artikel e-commerce: sisipkan sebelum CTA block "Siap Punya..."
    # Untuk artikel lain: sisipkan sebelum paragraf terakhir / author box area
    idx = content.find(anchor_hint)
    if idx != -1:
        # sisipkan tepat sebelum anchor
        insert_pos = idx
    else:
        # fallback: sisipkan sebelum </p> terakhir yang ada di artikel
        last_p = content.rfind("</p>")
        # Tapi cari </p> yang ada 500 chars sebelum akhir minimal
        if last_p > len(content) - 100:
            last_p = content.rfind("</p>", 0, len(content) - 50)
        insert_pos = last_p + 4 if last_p != -1 else len(content)

    new_content = content[:insert_pos] + showcase_block + content[insert_pos:]
    print(f"   ✏️  {len(content)} → {len(new_content)} chars")

    article["content_id"] = new_content
    article_id = article.get("id") or article.get("_id")

    put = requests.put(
        f"{BASE_URL}/api/admin/blog/{article_id}",
        headers=headers, json=article
    )
    if put.status_code in (200, 201):
        tmpl_names = [TEMPLATES[ts]["name"] for ts in template_slugs]
        print(f"   ✅ Berhasil → template: {', '.join(tmpl_names)}\n")
    else:
        print(f"   ❌ PUT gagal ({put.status_code}): {put.text[:200]}\n")

print("=" * 65)
print(" ✅ Selesai! Semua artikel sudah punya link ke template relevan.")
print("=" * 65)
