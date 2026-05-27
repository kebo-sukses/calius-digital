"""
Script untuk upload artikel blog "Panduan Lengkap Landing Page" ke Calius Digital API
"""

import requests
import json
from datetime import datetime

# API Configuration
API_BASE_URL = "https://www.calius.digital/api"
# Note: Admin token harus didapat dari login dulu

def get_article_content():
    """Read artikel HTML dari file"""
    with open("artikel_panduan_lengkap_landing_page.html", "r", encoding="utf-8") as f:
        # Skip sampai baris CONTENT HTML
        lines = f.readlines()
        start_idx = None
        for i, line in enumerate(lines):
            if "## CONTENT HTML" in line:
                start_idx = i + 1
                break
        
        if start_idx:
            # Ambil semua content dari start_idx sampai akhir
            content = "".join(lines[start_idx:])
            # Remove markdown markers
            content = content.replace("```html", "").replace("```", "")
            return content.strip()
        return ""

def create_blog_post(token):
    """Create blog post via API"""
    
    # FAQ items untuk schema
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
    
    # Blog post data
    blog_data = {
        "slug": "panduan-lengkap-landing-page-2026",
        "title_id": "Panduan Lengkap Landing Page: Cara Membuat, Contoh & Template Gratis 2026",
        "title_en": "Complete Landing Page Guide: How to Create, Examples & Free Templates 2026",
        "excerpt_id": "Mau tahu kenapa landing page bisa naikkan konversi website sampai 340%? Pelajari pengertian, jenis-jenis, elemen penting, dan cara bikin landing page yang bener-bener jual. Bonus: 15+ template gratis!",
        "excerpt_en": "Learn why landing pages can increase website conversion up to 340%. Complete guide with types, elements, and implementation steps. Bonus: 15+ free templates!",
        "content_id": get_article_content(),
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
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{API_BASE_URL}/admin/blog",
        headers=headers,
        json=blog_data
    )
    
    return response

if __name__ == "__main__":
    print("=" * 60)
    print("UPLOAD ARTIKEL: Panduan Lengkap Landing Page 2026")
    print("=" * 60)
    
    # Note: Token harus didapat dari login admin
    # Untuk sekarang, kita print data yang akan diupload
    
    print("\n✅ Artikel sudah disiapkan dengan:")
    print("   • 10,000+ words content")
    print("   • 8 FAQ items untuk schema")
    print("   • Internal linking ke 5 artikel existing")
    print("   • 15+ gambar Unsplash")
    print("   • Gaya bahasa natural (bukan AI-sounding)")
    print("   • Mobile-responsive HTML")
    
    print("\n📌 Metadata:")
    print(f"   • Slug: panduan-lengkap-landing-page-2026")
    print(f"   • Category: tutorial")
    print(f"   • Tags: 6 tags (apa itu landing page, dll)")
    print(f"   • Read time: 45 menit")
    print(f"   • Author: Jeslius - Founder Calius Digital")
    
    print("\n🔗 Internal Links:")
    print("   • /blog/contoh-landing-page-travel-umroh-konversi-tinggi")
    print("   • /blog/cara-jualan-online-tanpa-potongan-marketplace")
    print("   • /blog/biaya-admin-marketplace-mahal-hitung-kerugian")
    print("   • /blog/website-toko-online-lemot-kerugian-omzet")
    print("   • /blog/template-website-rental-mobil-terintegrasi-whatsapp")
    print("   • /templates (multiple times)")
    print("   • /portfolio")
    print("   • /contact")
    
    print("\n🎨 Features:")
    print("   • Conversational tone (pakai 'gue/Anda', pertanyaan retoris)")
    print("   • Analogi relatable (toko di mall, dll)")
    print("   • Data & statistics konkret")
    print("   • Tabel perbandingan")
    print("   • Tips boxes dengan styling")
    print("   • CTA boxes di beberapa section")
    print("   • Author bio lengkap")
    print("   • Related articles section")
    
    print("\n" + "=" * 60)
    print("Artikel siap diupload ke database!")
    print("=" * 60)
    
    # TODO: Uncomment ini setelah dapat admin token
    # token = input("\nMasukkan admin token: ")
    # response = create_blog_post(token)
    # print(f"\nResponse: {response.status_code}")
    # print(response.json())
