# 🚀 Quick Start Guide - Full Pack Deployment

## Cara Upload Full Pack ke cPanel

### ⏱️ Estimasi Waktu: 15-20 menit

---

## 📦 Isi Package Ini

```
full_pack_deployment/
├── website/           (70 files, 12 MB) → Upload ke /public_html/
├── database/          (1 SQL file)       → Import via phpMyAdmin  
├── tools/             (1 Python script)  → Simpan lokal
├── docs/              (3 dokumentasi)    → Reference
├── DEPLOYMENT_MAPPING.md                 → Peta lengkap
└── QUICK_START.md                        → File ini
```

---

## ✅ Checklist Cepat (5 Steps)

### **1. Backup Dulu! (WAJIB)**
```bash
# Di cPanel File Manager:
1. Klik kanan folder "public_html"
2. Pilih "Compress"
3. Format: zip
4. Nama: backup_calius_20260109.zip
5. Download ke komputer

# Di phpMyAdmin:
1. Select database: luaregrp_clippremium_license
2. Tab "Export"
3. Format: SQL
4. Klik "Go"
5. Save: backup_database_20260109.sql
```

---

### **2. Database Migration (LAKUKAN DULUAN!)**
```bash
# Di phpMyAdmin:
1. Select database: luaregrp_clippremium_license
2. Tab "SQL"
3. Buka file: database/migration_v3.3.0.sql
4. Copy isi file, paste ke SQL box
5. Klik "Go"

# Verification:
DESCRIBE licenses;
# Harus ada kolom: license_code, activated_at

SELECT COUNT(*) FROM license_codes;
# Harus return: 16
```

---

### **3. Upload Website Files**

**Method A: ZIP Upload (Recommended - Cepat)**
```bash
1. Compress folder "website/" jadi ZIP di komputer
2. Login cPanel → File Manager
3. Navigate ke /public_html/
4. Upload website.zip
5. Klik kanan ZIP → Extract → Confirm
6. Hapus file ZIP setelah extract
7. Verify: Folder /public_html/api/license/ ada
```

**Method B: FTP (Alternative)**
```bash
# FileZilla:
Host: ftp.calius.digital
Port: 21
Username: [cpanel_username]
Password: [cpanel_password]

# Upload:
Drag folder "website/*" → /public_html/
Wait hingga selesai (~150 files)
```

---

### **4. Update Config & Critical Files**

#### A. Update Database Credentials
```bash
# Edit file: /public_html/api/license/config.php

# Ganti baris ini:
define('DB_USER', 'luaregrp_cpuser');        // ← Username cPanel database
define('DB_PASS', 'your_password_here');     // ← Password database production

# Save changes
```

#### B. Backup & Replace functions.php
```bash
# Di File Manager:
1. Navigate: /public_html/api/license/
2. Klik kanan "functions.php" → Rename
3. Nama baru: functions.php.backup_20260109
4. Verify file size baru ~12 KB (versi lama ~8 KB)
```

#### C. Verify New Endpoint
```bash
# Check file exists:
/public_html/api/license/activate.php

# File size: ~4 KB
# Status: ✅ Must exist
```

---

### **5. Testing API Endpoints**

#### Test A: Existing Endpoint (Check License)
```bash
curl -X POST https://calius.digital/api/license/check \
  -H "Content-Type: application/json" \
  -d '{"hwid":"test123456789abcdef0123456789ab","version":"3.3.0"}'

# Expected response:
{
  "ok": true,
  "license": {
    "status": "trial",
    "type": "trial",
    "videos_remaining": 5,
    ...
  }
}
```

#### Test B: New Endpoint (Activate License)
```bash
curl -X POST https://calius.digital/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "license_code": "CLIPPREM-TEST-2026-9999",
    "hwid": "test123456789abcdef0123456789ab"
  }'

# Expected response:
{
  "ok": true,
  "status": "success",
  "message": "Lisensi berhasil diaktivasi! 🎉",
  "license": {
    "type": "personal",
    "license_code": "CLIPPREM-TEST-2026-9999",
    ...
  }
}
```

#### Test C: Verify in Database
```sql
-- Di phpMyAdmin:
SELECT license_type, license_code, activated_at 
FROM licenses 
WHERE hwid='test123456789abcdef0123456789ab';

-- Expected:
-- | license_type | license_code | activated_at |
-- | personal | CLIPPREM-TEST-2026-9999 | 2026-01-09 ... |

SELECT license_code, status, activated_by_hwid 
FROM license_codes 
WHERE license_code='CLIPPREM-TEST-2026-9999';

-- Expected:
-- | license_code | status | activated_by_hwid |
-- | CLIPPREM-TEST-2026-9999 | active | test123456... |
```

---

## 🎯 Post-Deployment Tasks

### Immediate (Lakukan Hari Ini)
- [ ] Generate 50 kode PERS pertama
  ```bash
  # Di komputer lokal:
  python tools/generate_license_codes.py
  
  # Input:
  Starting Number: 11
  License Type: PERS
  Year: 2026
  Quantity: 50
  
  # Output: clippremium_pers_2026.sql
  # Import file ini ke phpMyAdmin
  ```

- [ ] Test full activation flow dari desktop app
- [ ] Verify website live: https://calius.digital/

### This Week (7 hari ke depan)
- [ ] Update desktop app UI (License Activation tab)
- [ ] Update product page dengan instruksi aktivasi
- [ ] Prepare email template untuk kirim kode ke customer
- [ ] Generate 50 kode AGNC untuk enterprise

### Ongoing (Maintenance)
- [ ] Monitor database: Cek stock kode unused
  ```sql
  SELECT license_type, COUNT(*) as stock 
  FROM license_codes 
  WHERE status='unused' 
  GROUP BY license_type;
  ```

- [ ] Generate batch baru jika stock < 20
- [ ] Backup database setiap minggu

---

## ⚠️ Troubleshooting

### Error: "Database connection failed"
```bash
Solution:
1. Check config.php credentials
2. Verify database user exists di cPanel
3. Check database name: luaregrp_clippremium_license
```

### Error: "Column 'license_code' doesn't exist"
```bash
Solution:
Migration belum dijalankan!
1. Run database/migration_v3.3.0.sql di phpMyAdmin
2. Verify: DESCRIBE licenses;
```

### Error: "License code already used"
```bash
Solution:
Kode sudah digunakan HWID lain
1. Check: SELECT * FROM license_codes WHERE license_code='CLIPPREM-...'
2. Generate kode baru untuk customer
3. Refund atau assign kode berbeda
```

### Error: 500 Internal Server Error
```bash
Solution:
1. Check error_log di cPanel
2. Verify file permissions (644 untuk PHP)
3. Check PHP version (minimal 7.4)
```

---

## 📊 File Changes Summary

| File | Action | Size | Notes |
|------|--------|------|-------|
| `api/license/functions.php` | 🔄 REPLACE | 12 KB | Backup old version first |
| `api/license/activate.php` | ✨ ADD | 4 KB | New endpoint |
| `api/license/config.php` | ⚠️ EDIT | 2 KB | Update DB credentials |
| Database `licenses` table | 🔄 ALTER | - | Add 2 columns |
| Database `license_codes` table | ✨ CREATE | - | New table |

---

## 🎉 Success Criteria

Deployment sukses jika:
- ✅ Website https://calius.digital/ loading normal
- ✅ API `/api/license/check` return status 200
- ✅ API `/api/license/activate` return status 200
- ✅ Database punya kolom `license_code` di table `licenses`
- ✅ Database punya table `license_codes` dengan 16+ rows
- ✅ Test activation berhasil (kode test jadi `active`)

---

## 📞 Need Help?

**Baca dokumentasi lengkap:**
- [DEPLOYMENT_MAPPING.md](DEPLOYMENT_MAPPING.md) - Peta lengkap semua file
- [docs/DEPLOYMENT_INSTRUCTIONS.md](docs/DEPLOYMENT_INSTRUCTIONS.md) - Panduan detail
- [docs/README_LICENSE_SYSTEM.md](docs/README_LICENSE_SYSTEM.md) - Overview sistem

**Emergency Rollback:**
```bash
# Restore dari backup
1. cPanel File Manager → Upload backup_calius_20260109.zip
2. Extract → Replace all
3. phpMyAdmin → Import backup_database_20260109.sql
```

---

**Version:** 3.3.0  
**Last Updated:** 9 Januari 2026  
**Deployment Ready:** ✅ YES
