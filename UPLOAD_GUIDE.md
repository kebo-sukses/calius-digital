# 🚀 PANDUAN UPLOAD ARTIKEL - QUICK START

## Step-by-Step Upload Artikel ke Production

### 📝 Persiapan

File-file yang sudah siap:
- ✅ `artikel_panduan_lengkap_landing_page.html` - Artikel lengkap 10,000+ words
- ✅ `upload_artikel_final.py` - Upload script dengan authentication

---

## 🔐 OPSI 1: Upload dengan Environment Variables (RECOMMENDED)

Buka terminal PowerShell di folder `calius-digital`, lalu jalankan:

```powershell
# Set admin credentials
$env:CALIUS_USER = "admin_username"
$env:CALIUS_PASS = "admin_password"

# Run upload script
python upload_artikel_final.py
```

**Ganti:**
- `admin_username` dengan username admin Anda
- `admin_password` dengan password admin Anda

---

## 🔐 OPSI 2: Upload dengan Manual Input

Jika Anda tidak mau set environment variables, jalankan langsung:

```powershell
python upload_artikel_final.py
```

Script akan meminta input:
1. Username: `[ketik username admin]`
2. Password: `[ketik password admin]`

---

## 🔐 OPSI 3: Upload dengan Token (Alternatif)

Jika Anda sudah punya access token (dari browser localStorage atau curl):

```powershell
$env:CALIUS_TOKEN = "your_jwt_token_here"
python upload_artikel_final.py
```

---

## 📊 Output yang Diharapkan

Jika berhasil, Anda akan melihat:

```
======================================================================
 📝 UPLOAD ARTIKEL: Panduan Lengkap Landing Page 2026
======================================================================

🔐 Logging in as admin...
✅ Login successful! Role: editor

📝 Reading article content...
✅ Content loaded: 45892 characters

📤 Uploading blog post to API...
✅ Blog post created successfully!
   ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

🔍 Verifying blog post is live...
✅ Blog post is LIVE!
   Title: Panduan Lengkap Landing Page: Cara Membuat, Contoh & Template Gratis 2026
   URL: https://www.calius.digital/blog/panduan-lengkap-landing-page-2026

======================================================================
 ✅ DONE! Artikel berhasil diupload ke database
======================================================================

📋 Next Steps:
   1. Build frontend: cd frontend && npm run build
   2. Deploy to Vercel: vercel --prod
   3. Test live URL: https://www.calius.digital/blog/panduan-lengkap-landing-page-2026

======================================================================
```

---

## ❌ Troubleshooting

### Error: "Invalid credentials"
**Solusi:** Periksa username dan password. Pastikan role account adalah `editor` atau `admin`.

### Error: "Admin already exists" (jika init admin)
**Solusi:** Admin sudah ada. Gunakan credentials yang sudah dibuat sebelumnya.

### Error: "Login failed: 401"
**Solusi:** 
1. Check apakah API sedang running: `https://www.calius.digital/api/health`
2. Verify credentials dengan curl:
   ```powershell
   curl.exe -X POST "https://www.calius.digital/api/auth/login" `
     -H "Content-Type: application/json" `
     -d '{"username":"admin","password":"yourpassword"}'
   ```

### Error: "Content HTML marker not found"
**Solusi:** File `artikel_panduan_lengkap_landing_page.html` tidak ditemukan atau format salah. Pastikan file ada di folder root.

---

## 🔄 ALTERNATIVE: Manual Upload via curl

Jika Python script tidak work, bisa upload manual via curl:

### Step 1: Login dan dapat token
```powershell
$response = curl.exe -X POST "https://www.calius.digital/api/auth/login" `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"yourpassword"}' | ConvertFrom-Json

$token = $response.access_token
Write-Output "Token: $token"
```

### Step 2: Prepare JSON payload
```powershell
# Read HTML content
$htmlContent = Get-Content "artikel_panduan_lengkap_landing_page.html" -Raw

# Extract content after "## CONTENT HTML"
$startMarker = "## CONTENT HTML"
$startIdx = $htmlContent.IndexOf($startMarker)
$content = $htmlContent.Substring($startIdx + $startMarker.Length).Trim()

# Save to temp file (karena payload besar)
@"
{
  "slug": "panduan-lengkap-landing-page-2026",
  "title_id": "Panduan Lengkap Landing Page: Cara Membuat, Contoh & Template Gratis 2026",
  "title_en": "Complete Landing Page Guide: How to Create, Examples & Free Templates 2026",
  "excerpt_id": "Mau tahu kenapa landing page bisa naikkan konversi website sampai 340%? Pelajari pengertian, jenis-jenis, elemen penting, dan cara bikin landing page yang bener-bener jual. Bonus: 15+ template gratis!",
  "excerpt_en": "Learn why landing pages can increase website conversion up to 340%. Complete guide with types, elements, and implementation steps. Bonus: 15+ free templates!",
  "content_id": $($content | ConvertTo-Json),
  "content_en": "",
  "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  "featured_image_alt": "Panduan lengkap cara membuat landing page profesional untuk bisnis online",
  "author": "Jeslius - Founder Calius Digital",
  "category": "tutorial",
  "tags": ["apa itu landing page", "landing page adalah", "cara membuat landing page", "template landing page gratis", "panduan landing page", "konversi landing page"],
  "read_time": 45,
  "seo_title": "Panduan Lengkap Landing Page 2026: Pengertian, Cara Membuat & Template Gratis",
  "seo_description": "Panduan A-Z landing page: pengertian, 8 jenis, 12 elemen penting, 7 langkah praktis, 5 studi kasus sukses, dan 15+ template gratis. Terbukti tingkatkan konversi 340%!",
  "faq_items": [
    {"question": "Berapa biaya bikin landing page?", "answer": "..."},
    ...
  ]
}
"@ | Out-File -Encoding UTF8 "blog_payload.json"
```

### Step 3: Upload
```powershell
curl.exe -X POST "https://www.calius.digital/api/admin/blog" `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  --data-binary "@blog_payload.json"
```

---

## ✅ Setelah Upload Berhasil

### 1. Build Frontend
```powershell
cd frontend
npm run build
```

### 2. Deploy ke Vercel
```powershell
cd ..
vercel --prod
```

### 3. Test Live URL
```powershell
# Check artikel exist di API
curl.exe "https://www.calius.digital/api/blog/panduan-lengkap-landing-page-2026"

# Open di browser
start https://www.calius.digital/blog/panduan-lengkap-landing-page-2026
```

---

## 📞 Need Help?

Jika masih ada masalah, check:
1. **API Health:** `https://www.calius.digital/api/health`
2. **Existing blogs:** `https://www.calius.digital/api/blog`
3. **Admin credentials:** Pastikan Anda punya akses editor/admin

---

**File ini:** `UPLOAD_GUIDE.md`
**Created:** 2026-05-27
**Purpose:** Quick reference untuk upload artikel blog ke production
