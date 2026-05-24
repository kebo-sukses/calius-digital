import requests

# Login
r = requests.post('https://www.calius.digital/api/auth/login', json={'username': 'Jeslius', 'password': 'Calius2026!'})
token = r.json()['access_token']
headers = {'Authorization': 'Bearer ' + token}

payload = {
    "slug": "sepeda-listrik-landing-page",
    "name": "Sepeda Listrik Landing Page",
    "category": "landing-page",
    "price": 499000,
    "sale_price": 349000,
    "description_id": "Template landing page modern untuk brand sepeda listrik dan kendaraan listrik. Dilengkapi katalog produk, galeri foto, bagian keunggulan fitur, formulir kontak, dan lokasi toko. Cocok untuk distributor, agen resmi, atau brand kendaraan listrik lokal.",
    "description_en": "Modern landing page template for electric bicycle and electric vehicle brands. Features product catalog, photo gallery, features highlights, contact form, and store locations. Ideal for distributors, official dealers, or local electric vehicle brands.",
    "features": [
        "Product Catalog & Series Showcase",
        "Photo Gallery Section",
        "Feature Highlights",
        "Contact Form with WhatsApp Integration",
        "Store Location Section",
        "Smooth Scroll Navigation",
        "Mobile-First Responsive Design",
        "Fast Loading Performance",
        "Clean & Modern UI",
        "Easy Customization"
    ],
    "technologies": ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
    "demo_url": "https://sepeda-listrik-page.vercel.app/",
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "images": [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80",
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"
    ],
    "is_featured": True,
    "is_bestseller": False,
    "is_new": True
}

res = requests.post('https://www.calius.digital/api/admin/templates', headers=headers, json=payload)
print(f"Status: {res.status_code}")
print(res.text[:500])
