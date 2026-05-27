"""
Complete script untuk upload artikel blog ke Calius Digital Production
Includes: Authentication, JSON payload preparation, dan upload
"""

import requests
import json
import os
from pathlib import Path

# API Configuration
API_BASE_URL = "https://www.calius.digital/api"

def read_article_content():
    """Extract HTML content dari artikel file"""
    file_path = Path("artikel_panduan_lengkap_landing_page.html")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Find content antara "## CONTENT HTML" dan end of file
    start_marker = "## CONTENT HTML"
    start_idx = content.find(start_marker)
    
    if start_idx == -1:
        raise ValueError("Content HTML marker not found")
    
    # Skip ke baris setelah marker
    html_start = content.find("\n", start_idx) + 1
    
    # Ambil semua content dari sini sampai akhir
    html_content = content[html_start:].strip()
    
    # Clean up markdown code blocks jika ada
    html_content = html_content.replace("```html\n", "").replace("\n```", "")
    
    return html_content

def login_admin(username, password):
    """Login dan dapatkan access token"""
    print(f"\n🔐 Logging in as {username}...")
    
    response = requests.post(
        f"{API_BASE_URL}/auth/login",
        json={"username": username, "password": password}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Login successful! Role: {data['user']['role']}")
        return data['access_token']
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def create_blog_payload():
    """Prepare complete blog payload"""
    
    faq_items = [
        {
            "question": "Berapa biaya bikin landing page?",
            "answer": "Tergantung caranya: DIY pakai builder ($0-$90/bulan), Freelancer (Rp 2-10 juta), Agency (Rp 10-50 juta+), atau Template Calius Digital (Gratis-Rp 1 juta sekali bayar). Buat UMKM, template adalah pilihan paling cost-effective."
        },
        {
            "question": "Berapa lama bikin landing page dari nol?",
            "answer": "Pakai template: 1-3 hari (customize aja). Custom design: 1-2 minggu. Complex dengan backend: 2-4 minggu. Calius express service: 24-48 jam (fast track)."
        },
        {
            "question": "Apakah landing page butuh SEO?",
            "answer": "Tergantung tujuan. Kalau untuk iklan berbayar (PPC), SEO kurang penting. Tapi kalau mau organic traffic dari Google, SEO wajib! Optimize title, meta description, H1, alt text, dan internal linking."
        },
        {
            "question": "Landing page vs website biasa, mana yang lebih baik?",
            "answer": "Bukan soal mana yang lebih baik, tapi kapan pakai yang mana. Landing page untuk campaign spesifik (iklan, promo). Website untuk branding jangka panjang. Best practice: punya website utama + beberapa landing page untuk campaign berbeda."
        },
        {
            "question": "Tools gratis terbaik untuk pemula?",
            "answer": "Carrd (simple landing page builder), Google Sites (free hosting), Canva (design graphics), dan Template HTML gratis dari Calius Digital."
        },
        {
            "question": "Berapa conversion rate yang bagus untuk landing page?",
            "answer": "Benchmark industri: Average 9.7%, Good 10-15%, Excellent 15%+. Kalau conversion rate di bawah 5%, ada yang salah — cek copy, CTA, atau loading speed."
        },
        {
            "question": "Mobile vs desktop, mana yang prioritas?",
            "answer": "Mobile adalah prioritas #1. 60%+ traffic Indonesia dari mobile, Google pakai mobile-first indexing, dan user mobile lebih impatient. Always design mobile-first, baru scale up ke desktop."
        },
        {
            "question": "Apakah bisa pakai landing page untuk SEO jangka panjang?",
            "answer": "Bisa, dengan catatan: konten harus berkualitas dan informatif (bukan cuma sales pitch), update rutin, internal linking ke page lain, dan backlink dari situs authority."
        }
    ]
    
    print("\n📝 Reading article content...")
    content_html = read_article_content()
    print(f"✅ Content loaded: {len(content_html)} characters")
    
    payload = {
        "slug": "panduan-lengkap-landing-page-2026",
        "title_id": "Panduan Lengkap Landing Page: Cara Membuat, Contoh & Template Gratis 2026",
        "title_en": "Complete Landing Page Guide: How to Create, Examples & Free Templates 2026",
        "excerpt_id": "Mau tahu kenapa landing page bisa naikkan konversi website sampai 340%? Pelajari pengertian, jenis-jenis, elemen penting, dan cara bikin landing page yang bener-bener jual. Bonus: 15+ template gratis!",
        "excerpt_en": "Learn why landing pages can increase website conversion up to 340%. Complete guide with types, elements, and implementation steps. Bonus: 15+ free templates!",
        "content_id": content_html,
        "content_en": "",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
        "featured_image_alt": "Panduan lengkap cara membuat landing page profesional untuk bisnis online",
        "author": "Jeslius - Founder Calius Digital",
        "category": "tutorial",
        "tags": [
            "apa itu landing page",
            "landing page adalah",
            "cara membuat landing page",
            "template landing page gratis",
            "panduan landing page",
            "konversi landing page"
        ],
        "read_time": 45,
        "seo_title": "Panduan Lengkap Landing Page 2026: Pengertian, Cara Membuat & Template Gratis",
        "seo_description": "Panduan A-Z landing page: pengertian, 8 jenis, 12 elemen penting, 7 langkah praktis, 5 studi kasus sukses, dan 15+ template gratis. Terbukti tingkatkan konversi 340%!",
        "faq_items": faq_items
    }
    
    return payload

def upload_blog(token, payload):
    """Upload blog post ke API"""
    print("\n📤 Uploading blog post to API...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{API_BASE_URL}/admin/blog",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Blog post created successfully!")
        print(f"   ID: {data.get('id')}")
        return data
    else:
        print(f"❌ Upload failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return None

def verify_blog_live(slug):
    """Verify artikel sudah bisa diakses"""
    print(f"\n🔍 Verifying blog post is live...")
    
    response = requests.get(f"{API_BASE_URL}/blog/{slug}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Blog post is LIVE!")
        print(f"   Title: {data.get('title_id')}")
        print(f"   URL: https://www.calius.digital/blog/{slug}")
        return True
    else:
        print(f"❌ Blog post not found yet")
        return False

def main():
    print("=" * 70)
    print(" 📝 UPLOAD ARTIKEL: Panduan Lengkap Landing Page 2026")
    print("=" * 70)
    
    # Get credentials dari environment atau user input
    username = os.environ.get('ADMIN_USERNAME')
    password = os.environ.get('ADMIN_PASSWORD')
    
    if not username or not password:
        print("\n⚠️  Admin credentials not found in environment variables")
        print("Please provide admin credentials:")
        username = input("Username: ").strip()
        password = input("Password: ").strip()
    
    if not username or not password:
        print("❌ Credentials required!")
        return
    
    # Step 1: Login
    token = login_admin(username, password)
    if not token:
        print("\n❌ Failed to get access token. Aborting.")
        return
    
    # Step 2: Prepare payload
    try:
        payload = create_blog_payload()
    except Exception as e:
        print(f"❌ Failed to prepare payload: {e}")
        return
    
    # Step 3: Upload
    result = upload_blog(token, payload)
    if not result:
        print("\n❌ Upload failed. Aborting.")
        return
    
    # Step 4: Verify
    verify_blog_live(payload['slug'])
    
    print("\n" + "=" * 70)
    print(" ✅ DONE! Artikel berhasil diupload ke database")
    print("=" * 70)
    print("\n📋 Next Steps:")
    print("   1. Build frontend: cd frontend && npm run build")
    print("   2. Deploy to Vercel: vercel --prod")
    print("   3. Test live URL: https://www.calius.digital/blog/panduan-lengkap-landing-page-2026")
    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()
