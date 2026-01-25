# 📦 ClipPremium Full Pack Deployment v3.3.0
## Peta Lengkap File Upload ke cPanel

> **Tanggal:** 9 Januari 2026  
> **Versi:** 3.3.0 (License Activation System)  
> **Target:** calius.digital cPanel

---

## 📁 Struktur Package

```
full_pack_deployment/
├── website/           ← Upload ke /public_html/
├── database/          ← Import via phpMyAdmin
├── tools/             ← Simpan lokal untuk maintenance
└── docs/              ← Dokumentasi lengkap
```

---

## 🎯 Mapping Upload ke cPanel

### 1️⃣ WEBSITE FILES → `/public_html/`

#### A. Root Files
| File Lokal | Lokasi cPanel | Status | Keterangan |
|-----------|---------------|--------|------------|
| `website/.htaccess` | `/public_html/.htaccess` | ✅ UPLOAD | Config Apache (SEO, security) |
| `website/index.html` | `/public_html/index.html` | ✅ UPLOAD | Homepage ClipPremium |
| `website/about.html` | `/public_html/about.html` | ✅ UPLOAD | Tentang Kami |
| `website/blog.html` | `/public_html/blog.html` | ✅ UPLOAD | Blog page |
| `website/checkout.html` | `/public_html/checkout.html` | ✅ UPLOAD | Halaman order |
| `website/portfolio.html` | `/public_html/portfolio.html` | ✅ UPLOAD | Portfolio |
| `website/templates.html` | `/public_html/templates.html` | ✅ UPLOAD | Template library |
| `website/manifest.json` | `/public_html/manifest.json` | ✅ UPLOAD | PWA manifest |
| `website/robots.txt` | `/public_html/robots.txt` | ✅ UPLOAD | SEO crawling rules |
| `website/sitemap.xml` | `/public_html/sitemap.xml` | ✅ UPLOAD | SEO sitemap |
| `website/googlef4fda0e5f4997677.html` | `/public_html/googlef4fda0e5f4997677.html` | ✅ UPLOAD | Google verification |

#### B. Demo Pages
| File Lokal | Lokasi cPanel | Status |
|-----------|---------------|--------|
| `website/demo-launchpad-landing.html` | `/public_html/demo-launchpad-landing.html` | ✅ UPLOAD |
| `website/demo-pro-business.html` | `/public_html/demo-pro-business.html` | ✅ UPLOAD |
| `website/demo-shopmax-ecommerce.html` | `/public_html/demo-shopmax-ecommerce.html` | ✅ UPLOAD |

#### C. Error Pages
| File Lokal | Lokasi cPanel | Status |
|-----------|---------------|--------|
| `website/403.html` | `/public_html/403.html` | ✅ UPLOAD |
| `website/404.html` | `/public_html/404.html` | ✅ UPLOAD |
| `website/500.html` | `/public_html/500.html` | ✅ UPLOAD |

---

### 2️⃣ API FILES → `/public_html/api/`

#### A. License API (UPDATED)
| File Lokal | Lokasi cPanel | Status | Keterangan |
|-----------|---------------|--------|------------|
| `website/api/license/check.php` | `/public_html/api/license/check.php` | ✅ UPLOAD | Check license status (existing) |
| `website/api/license/increment.php` | `/public_html/api/license/increment.php` | ✅ UPLOAD | Increment video usage (existing) |
| `website/api/license/config.php` | `/public_html/api/license/config.php` | ⚠️ EDIT | **PENTING: Update credentials DB!** |
| `website/api/license/functions.php` | `/public_html/api/license/functions.php` | 🔄 REPLACE | **Updated v3.3.0** (backup old first!) |
| `website/api/license/activate.php` | `/public_html/api/license/activate.php` | ✨ NEW | **NEW endpoint** untuk aktivasi |

**⚠️ CRITICAL:**
1. **Backup `functions.php` dulu:**
   ```bash
   cp /public_html/api/license/functions.php /public_html/api/license/functions.php.backup_20260109
   ```
2. **Update `config.php`** dengan credentials database production:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'luaregrp_clippremium_license');
   define('DB_USER', 'luaregrp_cpuser');  // ← Ganti!
   define('DB_PASS', 'password_production');  // ← Ganti!
   ```

#### B. Other API Files
| File Lokal | Lokasi cPanel | Status | Keterangan |
|-----------|---------------|--------|------------|
| `website/api/send-contact.php` | `/public_html/api/send-contact.php` | ✅ UPLOAD | Contact form handler |
| `website/api/download.php` | `/public_html/api/download.php` | ✅ UPLOAD | Download handler |
| `website/api/smtp-config.php` | `/public_html/api/smtp-config.php` | ⚠️ EDIT | Update SMTP credentials |
| `website/api/version.json` | `/public_html/api/version.json` | ✅ UPLOAD | Version info untuk auto-update |

---

### 3️⃣ ASSETS → `/public_html/assets/`

| Folder Lokal | Lokasi cPanel | Jumlah File | Status |
|-------------|---------------|-------------|--------|
| `website/assets/css/` | `/public_html/assets/css/` | ~15 files | ✅ UPLOAD ALL |
| `website/assets/js/` | `/public_html/assets/js/` | ~20 files | ✅ UPLOAD ALL |
| `website/assets/images/` | `/public_html/assets/images/` | ~50+ files | ✅ UPLOAD ALL |
| `website/assets/fonts/` | `/public_html/assets/fonts/` | ~10 files | ✅ UPLOAD ALL |
| `website/assets/videos/` | `/public_html/assets/videos/` | ~5 files | ✅ UPLOAD ALL |

**💡 Tips:** Upload entire `assets/` folder sekaligus via ZIP untuk lebih cepat.

---

### 4️⃣ COMPONENTS → `/public_html/components/`

| File Lokal | Lokasi cPanel | Status |
|-----------|---------------|--------|
| `website/components/*.html` | `/public_html/components/` | ✅ UPLOAD ALL |

Reusable HTML components (navbar, footer, dll).

---

### 5️⃣ PRODUCT → `/public_html/product/`

| Folder Lokal | Lokasi cPanel | Status | Keterangan |
|-------------|---------------|--------|------------|
| `website/product/` | `/public_html/product/` | ✅ UPLOAD ALL | Product pages & assets |

---

### 6️⃣ DATA → `/public_html/data/`

| File Lokal | Lokasi cPanel | Status | Keterangan |
|-----------|---------------|--------|------------|
| `website/data/*.json` | `/public_html/data/` | ✅ UPLOAD ALL | Data files (pricing, features, dll) |

---

## 🗄️ DATABASE MIGRATION

### File: `database/migration_v3.3.0.sql`

**Lokasi:** Import via **cPanel → phpMyAdmin**

**Steps:**
1. Login phpMyAdmin
2. Select database: `luaregrp_clippremium_license`
3. Click "SQL" tab
4. Copy-paste isi file `migration_v3.3.0.sql`
5. Click "Go"

**What it does:**
- ✅ Add `license_code` column to `licenses` table
- ✅ Add `activated_at` column to `licenses` table
- ✅ Create `license_codes` table (untuk inventory)
- ✅ Insert 16 sample license codes (PERS, AGNC, TEST)

**Verification:**
```sql
-- Check columns added
DESCRIBE licenses;

-- Check new table exists
SHOW TABLES LIKE 'license_codes';

-- Check sample codes inserted
SELECT COUNT(*) FROM license_codes WHERE status='unused';
-- Should return: 16
```

---

## 🛠️ TOOLS (Simpan Lokal)

### File: `tools/generate_license_codes.py`

**⚠️ JANGAN UPLOAD KE CPANEL!** Simpan di komputer lokal untuk maintenance.

**Usage:**
```bash
python generate_license_codes.py

# Interactive prompts:
Starting Number: 11
License Type (PERS/AGNC): PERS
Year: 2026
Quantity: 50

# Output:
clippremium_pers_2026.csv  → Excel tracking
clippremium_pers_2026.sql  → Import ke database
```

**Kapan digunakan:**
- Generate 50-100 kode personal pertama kali
- Generate batch baru ketika stock < 20
- Generate kode agency untuk enterprise customer

---

## 📚 DOCUMENTATION

### A. `docs/DEPLOYMENT_INSTRUCTIONS.md`
- Panduan lengkap step-by-step deployment
- Testing procedures dengan cURL
- Manual payment workflow
- Admin SQL queries
- Troubleshooting common issues

### B. `docs/README_LICENSE_SYSTEM.md`
- Overview sistem lisensi
- Quick start guide
- File details & sizes
- Security checklist
- Post-deployment tasks

---

## 🚀 DEPLOYMENT SEQUENCE

### **Step 1: Pre-Deployment (WAJIB)**
- [ ] Backup seluruh `/public_html/` di cPanel
- [ ] Export database `luaregrp_clippremium_license` via phpMyAdmin
- [ ] Save backup ke local: `backup_calius_20260109.zip`

### **Step 2: Database Migration (LAKUKAN DULUAN!)**
- [ ] Login phpMyAdmin
- [ ] Import `database/migration_v3.3.0.sql`
- [ ] Verify dengan query: `DESCRIBE licenses;`
- [ ] Check license_codes table: `SELECT COUNT(*) FROM license_codes;`

### **Step 3: Upload Website Files**
- [ ] Login cPanel File Manager
- [ ] Navigate ke `/public_html/`
- [ ] **Method A:** Upload ZIP entire `website/` folder → Extract
- [ ] **Method B:** Upload via FTP dengan FileZilla

### **Step 4: Update Config Files**
- [ ] Edit `/public_html/api/license/config.php`
- [ ] Update database credentials (DB_USER, DB_PASS)
- [ ] Save changes

### **Step 5: Backup & Replace Critical Files**
- [ ] Backup: `functions.php` → `functions.php.backup_20260109`
- [ ] Replace dengan `functions.php` versi baru (v3.3.0)
- [ ] Verify: Check file size (~12 KB)

### **Step 6: Add New Files**
- [ ] Upload `api/license/activate.php` (NEW endpoint)
- [ ] Set permissions: 644 (rw-r--r--)

### **Step 7: Testing**
- [ ] Test existing endpoint: `curl https://calius.digital/api/license/check`
- [ ] Test new endpoint: `curl https://calius.digital/api/license/activate`
- [ ] Verify database: Check activation logged in `licenses` table

### **Step 8: Generate Initial Codes**
- [ ] Run `generate_license_codes.py` locally
- [ ] Generate 50 PERS codes (starting from 0011)
- [ ] Import SQL output ke phpMyAdmin
- [ ] Verify: `SELECT COUNT(*) FROM license_codes WHERE status='unused';`

### **Step 9: Post-Deployment**
- [ ] Update desktop app UI (License Activation tab)
- [ ] Update product page dengan instruksi aktivasi
- [ ] Prepare email template untuk kirim kode
- [ ] Test full activation flow: Order → Payment → Code → Activate

---

## ⚠️ FILES YANG JANGAN DIUPLOAD

| File | Alasan |
|------|--------|
| `website/index.html.backup` | Backup file, tidak diperlukan di production |
| `website/luaregrp_clippremium_license.sql` | Database dump, sudah ada di server |
| `website/DEPLOYMENT_GUIDE.md` | Dokumentasi, tidak perlu di public |
| `tools/generate_license_codes.py` | Tool admin, simpan lokal saja |
| `docs/*.md` | Dokumentasi, tidak perlu di public |

---

## 📊 File Summary

| Kategori | Jumlah File | Total Size | Upload? |
|----------|-------------|------------|---------|
| **HTML Pages** | 15 files | ~2 MB | ✅ YES |
| **Assets (CSS/JS/Images)** | 95+ files | ~8 MB | ✅ YES |
| **API Files** | 7 files | ~50 KB | ✅ YES |
| **Components** | 10 files | ~300 KB | ✅ YES |
| **Product Files** | 20 files | ~1 MB | ✅ YES |
| **Database** | 1 SQL file | ~6 KB | ⚠️ IMPORT via phpMyAdmin |
| **Tools** | 1 Python file | ~3 KB | ❌ NO (simpan lokal) |
| **Documentation** | 2 MD files | ~21 KB | ❌ NO (reference only) |
| **TOTAL UPLOAD** | **~150 files** | **~12 MB** | - |

---

## 🔍 Post-Upload Verification Checklist

### Website Functionality
- [ ] Homepage loading: `https://calius.digital/`
- [ ] Assets loading (CSS, JS, images)
- [ ] Contact form working
- [ ] Download links working

### API Endpoints
- [ ] `/api/license/check` - Status 200 ✅
- [ ] `/api/license/increment` - Status 200 ✅
- [ ] `/api/license/activate` - Status 200 ✅ (NEW)

### Database
- [ ] `licenses` table has `license_code` column
- [ ] `license_codes` table exists
- [ ] Sample codes inserted (16 rows)

### License Activation Flow
- [ ] Desktop app can check license
- [ ] Desktop app can activate license
- [ ] Database updates after activation
- [ ] HWID binding works correctly

---

## 📞 Support Contacts

**Developer:** Your Name  
**Email:** [email@example.com]  
**Server:** calius.digital cPanel  
**Database:** luaregrp_clippremium_license  

**Emergency Rollback:**
```bash
# Restore functions.php
mv /public_html/api/license/functions.php.backup_20260109 \
   /public_html/api/license/functions.php

# Remove activate.php
rm /public_html/api/license/activate.php

# Rollback database (if needed)
# Import backup SQL via phpMyAdmin
```

---

## 🎉 Deployment Complete!

Setelah semua step selesai:
1. ✅ Website live dengan license activation system
2. ✅ Database ready untuk tracking aktivasi
3. ✅ API endpoints working (check, increment, activate)
4. ✅ Admin ready untuk generate & assign codes
5. ⏳ Desktop app UI update (next step)

**Version:** 3.3.0  
**Date:** 9 Januari 2026  
**Status:** Production Ready 🚀
