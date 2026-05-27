#!/usr/bin/env python3
import requests
import sys
from datetime import datetime

BASE_URL = "https://www.calius.digital"
USERNAME = "Jeslius"
PASSWORD = "Calius2026!"

def login():
    """Login dan dapatkan token"""
    print("🔐 Login ke admin panel...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"username": USERNAME, "password": PASSWORD},
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('access_token')
        print(f"✅ Login berhasil")
        return token
    else:
        print(f"❌ Login gagal: {response.status_code}")
        print(response.text)
        sys.exit(1)

def add_portfolio(token):
    """Tambahkan portfolio baru"""
    portfolio_data = {
        "title": "Sayur Hidroponik Website",
        "client": "Sayur Hidroponik",
        "category": "blog",
        "description_id": "Website blog dan informasi tentang sayuran hidroponik, panduan budidaya, tips perawatan, dan artikel seputar pertanian modern.",
        "description_en": "Blog and information website about hydroponic vegetables, cultivation guides, care tips, and articles about modern farming.",
        "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
        "images": [
            "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
            "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80"
        ],
        "url": "https://sayur-hidroponik.my.id/",
        "technologies": ["Blog", "Informasi Pertanian", "Hidroponik"],
        "year": 2024,
        "is_featured": False
    }
    
    print("\n📝 Menambahkan portfolio baru...")
    print(f"   Title: {portfolio_data['title']}")
    print(f"   URL: {portfolio_data['url']}")
    print(f"   Category: {portfolio_data['category']}")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.post(
        f"{BASE_URL}/api/admin/portfolio",
        json=portfolio_data,
        headers=headers,
        timeout=10
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Portfolio berhasil ditambahkan!")
        print(f"   ID: {result.get('id')}")
        return result
    else:
        print(f"❌ Gagal menambahkan portfolio: {response.status_code}")
        print(response.text)
        return None

def main():
    print("=" * 60)
    print("📦 Tambah Portfolio: Sayur Hidroponik")
    print("=" * 60)
    
    # Login
    token = login()
    
    # Tambah portfolio
    result = add_portfolio(token)
    
    if result:
        print("\n" + "=" * 60)
        print("✨ Proses selesai!")
        print("=" * 60)
        print(f"\nPortfolio baru sudah ditambahkan ke database.")
        print(f"Silakan cek di: {BASE_URL}/portfolio")
    else:
        print("\n❌ Proses gagal!")
        sys.exit(1)

if __name__ == "__main__":
    main()
