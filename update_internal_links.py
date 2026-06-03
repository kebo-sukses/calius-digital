"""
Script untuk update 5 artikel lama dengan reciprocal internal links
ke main pillar article: /blog/panduan-lengkap-landing-page-2026

Sesuai roadmap:
1. biaya-admin-marketplace  → Solusi section
2. cara-jualan-online       → Langkah 1 section
3. template-rental-mobil    → 7 Fitur section (sebelum H3 pertama)
4. contoh-landing-umroh     → Append H2 baru di akhir
5. website-toko-lemot       → Solusi section
"""

import requests
import os
import sys

API_BASE = "https://www.calius.digital/api"

PILLAR_URL = "/blog/panduan-lengkap-landing-page-2026"

# --------------------------------------------------------------------------
# Link HTML yang akan disisipkan (dari roadmap)
# --------------------------------------------------------------------------
LINK_SNIPPETS = {
    "biaya-admin-marketplace-mahal-hitung-kerugian": {
        # Sisipkan setelah </p> pertama dalam section Solusi
        "find": "Solusi: Bangun Jalur Penjualan yang Tidak Bisa Dipotong Siapapun</h2>\n\n<p>\n  Seller cerdas tidak meninggalkan marketplace sepenuhnya — tapi mereka membangun\n  <strong>website toko online sendiri</strong> sebagai aset utama, dan menggunakan marketplace\n  hanya sebagai saluran akuisisi pelanggan baru.\n</p>",
        "replace_with": (
            "Solusi: Bangun Jalur Penjualan yang Tidak Bisa Dipotong Siapapun</h2>\n\n"
            "<p>\n  Seller cerdas tidak meninggalkan marketplace sepenuhnya — tapi mereka membangun\n"
            "  <strong>website toko online sendiri</strong> sebagai aset utama, dan menggunakan marketplace\n"
            "  hanya sebagai saluran akuisisi pelanggan baru.\n</p>\n\n"
            "<p>\n  Mau tahu cara bikin website sendiri yang convert tinggi? Baca\n"
            "  <a href=\"{pillar}\">panduan lengkap landing page</a>\n"
            "  kami — dari A sampai Z, gratis!\n</p>"
        ).format(pillar=PILLAR_URL),
    },

    "cara-jualan-online-tanpa-potongan-marketplace": {
        # Sisipkan setelah </p> pertama dalam section Langkah 1
        "find": "Langkah 1 — Pilih Template Website yang Tepat</h3>\n\n<p>\n  Membangun website dari nol membutuhkan waktu berbulan-bulan dan biaya puluhan juta rupiah.\n  Gunakan <a href=\"/templates\">template website siap pakai</a> yang sudah mencakup halaman produk,\n  sistem checkout, dan integrasi WhatsApp. Investasi awal jauh lebih kecil, dan Anda bisa\n  langsung berjualan.\n</p>",
        "replace_with": (
            "Langkah 1 — Pilih Template Website yang Tepat</h3>\n\n"
            "<p>\n  Membangun website dari nol membutuhkan waktu berbulan-bulan dan biaya puluhan juta rupiah.\n"
            "  Gunakan <a href=\"/templates\">template website siap pakai</a> yang sudah mencakup halaman produk,\n"
            "  sistem checkout, dan integrasi WhatsApp. Investasi awal jauh lebih kecil, dan Anda bisa\n"
            "  langsung berjualan.\n</p>\n\n"
            "<p>\n  Pilih <a href=\"{pillar}\">template landing page yang terbukti convert</a>.\n"
            "  Jangan asal pilih — ada elemen-elemen penting yang wajib ada untuk naikin konversi.\n</p>"
        ).format(pillar=PILLAR_URL),
    },

    "template-website-rental-mobil-terintegrasi-whatsapp": {
        # Sisipkan antara H2 "7 Fitur Wajib" dan H3 pertama
        "find": "7 Fitur Wajib di Template Website Rental Mobil Profesional</h2>\n\n<h3>1. Galeri Armada yang Bisa Difilter</h3>",
        "replace_with": (
            "7 Fitur Wajib di Template Website Rental Mobil Profesional</h2>\n\n"
            "<p>\n  Butuh inspirasi desain landing page? Lihat\n"
            "  <a href=\"{pillar}\">12 elemen landing page yang wajib ada</a>\n"
            "  — berlaku untuk semua industri termasuk rental.\n</p>\n\n"
            "<h3>1. Galeri Armada yang Bisa Difilter</h3>"
        ).format(pillar=PILLAR_URL),
    },

    "contoh-landing-page-travel-umroh-konversi-tinggi": {
        # Append H2 baru di akhir artikel (setelah </p> terakhir)
        "find": "Lihat detail template di halaman template kami dan mulai ubah website menjadi mesin penghasil calon jamaah.</p>",
        "replace_with": (
            "Lihat detail template di halaman template kami dan mulai ubah website menjadi mesin penghasil calon jamaah.</p>\n\n"
            "<h2>Mau Belajar Lebih Dalam tentang Landing Page?</h2>\n\n"
            "<p>\n  Artikel ini fokus ke landing page travel umroh. Tapi kalau Anda mau pelajari\n"
            "  landing page secara menyeluruh — mulai dari pengertian, jenis-jenis, sampai cara\n"
            "  bikin dari nol — baca <a href=\"{pillar}\">Panduan Lengkap Landing Page 2026</a>\n"
            "  kami. 10.000+ words, gratis, lengkap!\n</p>"
        ).format(pillar=PILLAR_URL),
    },

    "website-toko-online-lemot-kerugian-omzet": {
        # Sisipkan setelah </p> pertama dalam section Solusi
        "find": "Solusi: Template Website yang Dibangun untuk Kecepatan dari Awal</h2>\n\n<p>\n  Template <a href=\"/templates\">website toko online dari Calius Digital</a> dibangun\n  dengan fokus pada performa sejak baris kode pertama: gambar dikompres otomatis,\n  kode bersih tanpa fitur bloat yang tidak perlu, dan hosting pada infrastruktur\n  yang dioptimasi untuk kecepatan.\n</p>",
        "replace_with": (
            "Solusi: Template Website yang Dibangun untuk Kecepatan dari Awal</h2>\n\n"
            "<p>\n  Template <a href=\"/templates\">website toko online dari Calius Digital</a> dibangun\n"
            "  dengan fokus pada performa sejak baris kode pertama: gambar dikompres otomatis,\n"
            "  kode bersih tanpa fitur bloat yang tidak perlu, dan hosting pada infrastruktur\n"
            "  yang dioptimasi untuk kecepatan.\n</p>\n\n"
            "<p>\n  Setelah website Anda cepat, pastikan juga\n"
            "  <a href=\"{pillar}\">elemen landing page-nya lengkap dan optimize</a>.\n"
            "  Percuma cepat kalau nggak convert.\n</p>"
        ).format(pillar=PILLAR_URL),
    },
}

# --------------------------------------------------------------------------

def login(username: str, password: str) -> str:
    print(f"\n🔐 Login sebagai {username}...")
    resp = requests.post(
        f"{API_BASE}/auth/login",
        json={"username": username, "password": password},
        timeout=15,
    )
    if resp.status_code == 200:
        token = resp.json()["access_token"]
        print("✅ Login berhasil")
        return token
    print(f"❌ Login gagal: {resp.text}")
    sys.exit(1)


def fetch_article(slug: str) -> dict:
    resp = requests.get(f"{API_BASE}/blog/{slug}", timeout=15)
    if resp.status_code == 200:
        return resp.json()
    print(f"  ❌ Gagal fetch {slug}: {resp.status_code}")
    return {}


def update_article(token: str, article_id: str, payload: dict) -> bool:
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    resp = requests.put(
        f"{API_BASE}/admin/blog/{article_id}",
        headers=headers,
        json=payload,
        timeout=20,
    )
    return resp.status_code == 200


def process_article(token: str, slug: str, patch: dict) -> None:
    print(f"\n📝 Memproses: {slug}")

    article = fetch_article(slug)
    if not article:
        return

    article_id = article.get("id")
    content = article.get("content_id", "")

    find_str = patch["find"]
    replace_str = patch["replace_with"]

    if find_str not in content:
        print(f"  ⚠️  Target string tidak ditemukan, lewati.")
        return

    if replace_str in content:
        print(f"  ℹ️  Link sudah ada, skip.")
        return

    new_content = content.replace(find_str, replace_str, 1)
    print(f"  ✏️  Content diupdate ({len(content)} → {len(new_content)} chars)")

    # Buat payload lengkap (semua field dari artikel asli + content_id baru)
    payload = {k: v for k, v in article.items() if k not in ("id", "created_at", "updated_at", "views")}
    payload["content_id"] = new_content

    ok = update_article(token, article_id, payload)
    if ok:
        print(f"  ✅ Berhasil diupdate → https://www.calius.digital/blog/{slug}")
    else:
        print(f"  ❌ Gagal update artikel {slug}")


def main():
    print("=" * 65)
    print(" 🔗 UPDATE INTERNAL LINKS — 5 Artikel")
    print(" Main Pillar:", PILLAR_URL)
    print("=" * 65)

    username = os.environ.get("ADMIN_USERNAME") or os.environ.get("CALIUS_USER")
    password = os.environ.get("ADMIN_PASSWORD") or os.environ.get("CALIUS_PASS")

    if not username or not password:
        print("\n⚠️  Credentials tidak ditemukan di environment.")
        username = input("Username: ").strip()
        password = input("Password: ").strip()

    token = login(username, password)

    for slug, patch in LINK_SNIPPETS.items():
        process_article(token, slug, patch)

    print("\n" + "=" * 65)
    print(" ✅ Selesai! Semua artikel diproses.")
    print("=" * 65)


if __name__ == "__main__":
    main()
