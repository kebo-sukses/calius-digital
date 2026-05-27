import requests
import json

BASE_URL = "https://www.calius.digital"
ADMIN_USERNAME = "Jeslius"
ADMIN_PASSWORD = "Calius2026!"
PORTFOLIO_ID = "0e56a9a0-a17a-4493-bddc-eea6c2f63bdb"  # ID Sayur Hidroponik

def login():
    """Login dan dapatkan token"""
    print("🔐 Login ke admin panel...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
    )
    response.raise_for_status()
    token = response.json()["access_token"]
    print("✅ Login berhasil\n")
    return token

def update_portfolio_featured(token):
    """Update portfolio menjadi featured"""
    print("📝 Mendapatkan data portfolio...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get current portfolio data
    response = requests.get(f"{BASE_URL}/api/portfolio")
    response.raise_for_status()
    all_portfolio = response.json()
    
    # Find the portfolio by ID
    portfolio = None
    for p in all_portfolio:
        if p["id"] == PORTFOLIO_ID:
            portfolio = p
            break
    
    if not portfolio:
        print(f"❌ Portfolio dengan ID {PORTFOLIO_ID} tidak ditemukan")
        return False
    
    print(f"   Portfolio: {portfolio['title']}")
    print(f"   Current featured status: {portfolio.get('is_featured', False)}")
    
    # Update portfolio dengan is_featured = true
    print("\n📝 Mengupdate portfolio menjadi featured...")
    
    portfolio_data = {
        "title": portfolio["title"],
        "client": portfolio["client"],
        "category": portfolio["category"],
        "description_id": portfolio["description_id"],
        "description_en": portfolio["description_en"],
        "image": portfolio["image"],
        "images": portfolio.get("images", []),
        "url": portfolio["url"],
        "technologies": portfolio["technologies"],
        "year": portfolio["year"],
        "is_featured": True  # Set to featured
    }
    
    response = requests.put(
        f"{BASE_URL}/api/admin/portfolio/{PORTFOLIO_ID}",
        headers=headers,
        json=portfolio_data
    )
    
    if response.status_code == 200:
        print("✅ Portfolio berhasil diupdate!\n")
        return True
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"   Response: {response.text}\n")
        return False

def main():
    print("=" * 60)
    print("UPDATE PORTFOLIO FEATURED")
    print("=" * 60)
    
    try:
        token = login()
        success = update_portfolio_featured(token)
        
        if success:
            print("=" * 60)
            print("✨ Proses selesai!")
            print("=" * 60)
            print("\nPortfolio 'Sayur Hidroponik Website' sekarang akan")
            print("muncul di homepage sebagai featured portfolio.")
            print(f"\nSilakan cek di: {BASE_URL}/")
        else:
            print("❌ Update gagal. Cek error di atas.")
    
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
