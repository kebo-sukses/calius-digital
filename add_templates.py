"""
Script untuk menambahkan template baru ke calius.digital
Templates: Elite Property Listing & TravelGo Landing Page
"""
import os
import requests

BASE_URL = "https://www.calius.digital"


def login():
    username = os.environ.get("CALIUS_USER", "Jeslius")
    password = os.environ.get("CALIUS_PASS", "Calius2026!")
    resp = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"username": username, "password": password},
        timeout=30,
    )
    resp.raise_for_status()
    token = resp.json().get("access_token")
    if not token:
        raise ValueError(f"Login failed: {resp.text}")
    print(f"[OK] Login berhasil sebagai {username}")
    return token


def add_template(token, data):
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(
        f"{BASE_URL}/api/admin/templates",
        json=data,
        headers=headers,
        timeout=30,
    )
    if resp.status_code in (200, 201):
        print(f"[OK] Template '{data['name']}' berhasil ditambahkan!")
    else:
        print(f"[FAIL] {resp.status_code} - {data['name']}: {resp.text[:300]}")
    return resp


TEMPLATES = [
    {
        "slug": "elite-property-listing",
        "name": "Elite Property Listing",
        "category": "property",
        "price": 750000,
        "sale_price": 499000,
        "description_id": (
            "Template landing page properti premium dengan tampilan elegan dan profesional "
            "untuk agen properti, developer, dan agen real estate. Dilengkapi galeri properti "
            "responsif, bagian pencarian canggih, detail spesifikasi unit, peta lokasi interaktif, "
            "dan formulir kontak yang mudah digunakan. Dibangun dengan performa tinggi agar "
            "halaman dimuat super cepat di semua perangkat."
        ),
        "description_en": (
            "Premium property landing page template with elegant and professional look for real "
            "estate agents and developers. Features a responsive property gallery, advanced "
            "search section, unit specifications, interactive location map, and an easy-to-use "
            "contact form. Built for high performance so pages load blazing fast on all devices."
        ),
        "features": [
            "Responsive Property Gallery",
            "Advanced Search & Filter",
            "Unit Specification Detail",
            "Interactive Location Map",
            "Contact / Inquiry Form",
            "Smooth Scroll Animations",
            "Mobile-First Responsive Design",
            "Fast Loading Performance",
            "Clean & Modern UI",
            "Easy Customization",
        ],
        "technologies": ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
        "demo_url": None,
        "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        ],
        "is_featured": True,
        "is_bestseller": False,
        "is_new": True,
    },
    {
        "slug": "travelgo-landing-page",
        "name": "TravelGo Landing Page",
        "category": "travel",
        "price": 750000,
        "sale_price": 499000,
        "description_id": (
            "Template landing page travel & wisata yang memukau, cocok untuk agen perjalanan, "
            "tour operator, dan bisnis pariwisata. Menampilkan showcase destinasi yang cantik, "
            "kartu paket tur yang menarik, galeri foto destinasi, bagian testimoni pelanggan, "
            "serta formulir pemesanan yang terintegrasi. Animasi halus dan desain modern membuat "
            "pengunjung betah dan meningkatkan konversi."
        ),
        "description_en": (
            "Stunning travel & tourism landing page template, perfect for travel agencies, tour "
            "operators, and tourism businesses. Features beautiful destination showcases, "
            "attractive tour package cards, destination photo gallery, customer testimonials, "
            "and an integrated booking form. Smooth animations and modern design keep visitors "
            "engaged and boost conversions."
        ),
        "features": [
            "Hero Destination Showcase",
            "Tour Package Cards",
            "Destination Photo Gallery",
            "Booking / Inquiry Form",
            "Customer Testimonials",
            "Smooth Scroll Animations",
            "Mobile-First Responsive Design",
            "Fast Loading Performance",
            "Clean & Modern UI",
            "Easy Customization",
        ],
        "technologies": ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
        "demo_url": None,
        "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
        ],
        "is_featured": True,
        "is_bestseller": False,
        "is_new": True,
    },
]


def main():
    print("=" * 50)
    print("Menambahkan template baru ke calius.digital")
    print("=" * 50)

    token = login()

    for t in TEMPLATES:
        add_template(token, t)

    print("=" * 50)
    print("Selesai! Cek di https://www.calius.digital/templates")


if __name__ == "__main__":
    main()
