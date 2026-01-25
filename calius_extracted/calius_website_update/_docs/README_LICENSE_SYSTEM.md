# 📦 ClipPremium License Activation System v3.3.0

**Package Date:** 2026-01-09  
**Purpose:** License activation system files untuk upload ke cPanel  
**Status:** ✅ Ready for Deployment

---

## 📁 CONTENTS OF THIS PACKAGE

```
upload_ready/
├── api/
│   └── license/
│       ├── activate.php       [NEW] Endpoint aktivasi lisensi
│       └── functions.php      [UPDATE] Added activation logic
│
├── database_migration.sql     [RUN FIRST] Add license_code columns & table
├── generate_license_codes.py  [TOOL] Python script untuk generate codes
├── DEPLOYMENT_INSTRUCTIONS.md [GUIDE] Complete step-by-step deployment
└── README.md                  [THIS FILE]
```

---

## 🎯 QUICK START (5 STEPS)

### 1. **Backup Database**
```bash
# Di phpMyAdmin:
Export → luaregrp_clippremium_license → SQL → Go
# Save file: backup_before_activation_2026-01-09.sql
```

### 2. **Run Database Migration**
```bash
# Di phpMyAdmin:
SQL Tab → Open 'database_migration.sql' → Copy & Paste → Go
```

### 3. **Upload API Files**
```bash
# Via cPanel File Manager:
/public_html/api/license/
  - activate.php     (upload NEW)
  - functions.php    (replace EXISTING)
```

### 4. **Generate License Codes**
```bash
cd upload_ready
python generate_license_codes.py

# Input:
Starting Number: 1
License Type: PERS
Year: 2026
Quantity: 50

# Output:
clippremium_pers_2026.sql  ← Upload to phpMyAdmin
```

### 5. **Test Activation**
```bash
curl -X POST https://calius.digital/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "license_code": "CLIPPREM-TEST-2026-9999",
    "hwid": "test123456789abcdef0123456789ab"
  }'
```

---

## 📋 FILE DETAILS

### **api/license/activate.php** [NEW]

**Purpose:** API endpoint untuk aktivasi lisensi dengan kode  
**Size:** ~4 KB  
**Location Server:** `/public_html/api/license/activate.php`  
**Permissions:** `644` (rw-r--r--)

**Features:**
- ✅ Validasi email format
- ✅ Validasi license code format (CLIPPREM-XXXX-2026-0000)
- ✅ Check code availability (unused/active/revoked)
- ✅ Prevent double activation per HWID
- ✅ Transaction-safe database updates
- ✅ Rate limiting support
- ✅ CORS enabled for desktop app

**Testing:**
```bash
curl -X POST https://calius.digital/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","license_code":"CLIPPREM-PERS-2026-0001","hwid":"abc123..."}'
```

---

### **api/license/functions.php** [UPDATE]

**Purpose:** Helper functions (updated with activation logic)  
**Size:** ~12 KB  
**Location Server:** `/public_html/api/license/functions.php`  
**Action:** **REPLACE** existing file

**Changes:**
- ✅ Added: `validate_license_code()` - Format validation
- ✅ Added: `activate_license()` - Main activation logic
- ✅ Updated: `validate_hwid()` - More strict validation
- ✅ Backward compatible - existing endpoints unchanged

**New Functions:**
```php
validate_license_code($code)    // Check format CLIPPREM-XXXX-2026-0000
activate_license($hwid, $email, $code)  // Perform activation
```

---

### **database_migration.sql** [RUN FIRST]

**Purpose:** Add database columns and license_codes table  
**Size:** ~3 KB  
**Run In:** phpMyAdmin → SQL Tab

**Changes:**
1. Add columns to `licenses` table:
   - `license_code` VARCHAR(50)
   - `activated_at` TIMESTAMP
   
2. Create `license_codes` table:
   - Store pre-generated codes
   - Track activation status
   - Link to buyer info

3. Insert 16 sample codes:
   - 10x Personal (CLIPPREM-PERS-2026-0001 to 0010)
   - 5x Agency (CLIPPREM-AGNC-2026-0001 to 0005)
   - 1x Test (CLIPPREM-TEST-2026-9999)

**Verification:**
```sql
-- Check columns added
DESCRIBE licenses;

-- Check sample codes
SELECT * FROM license_codes LIMIT 5;
```

---

### **generate_license_codes.py** [TOOL]

**Purpose:** Generate batch license codes untuk dijual  
**Size:** ~2 KB  
**Run:** `python generate_license_codes.py`

**Usage:**
```bash
python generate_license_codes.py

# Interactive prompts:
Starting Number: 11          # Next batch starts from 11
License Type: PERS          # PERS or AGNC
Year: 2026                  # Current year
Quantity: 100               # Generate 100 codes

# Output files:
clippremium_pers_2026.csv   # For Excel/spreadsheet
clippremium_pers_2026.sql   # For database import
```

**Generated SQL Format:**
```sql
INSERT INTO license_codes (license_code, license_type, status, notes) VALUES
('CLIPPREM-PERS-2026-0011', 'personal', 'unused', 'Batch 2026-01-09'),
('CLIPPREM-PERS-2026-0012', 'personal', 'unused', 'Batch 2026-01-09'),
...
```

---

### **DEPLOYMENT_INSTRUCTIONS.md** [GUIDE]

**Purpose:** Complete step-by-step deployment manual  
**Size:** ~18 KB  
**Format:** Markdown

**Sections:**
1. Pre-deployment checklist
2. Database migration steps
3. File upload instructions
4. Testing procedures
5. Security hardening
6. Manual payment workflow
7. Admin queries reference
8. Troubleshooting guide

**Read this first before deployment!**

---

## 🔐 SECURITY NOTES

### **Before Deployment:**

1. **Update Database Credentials**
   
   Edit `/api/license/config.php`:
   ```php
   define('DB_USER', 'luaregrp_clipuser');  // Your actual MySQL user
   define('DB_PASS', 'your_strong_password_here');
   define('API_SECRET_KEY', 'random_32_char_string_here');
   ```

2. **Protect Sensitive Files**
   
   Create `/api/license/.htaccess`:
   ```apache
   <Files "config.php">
       Order Allow,Deny
       Deny from all
   </Files>
   <Files "functions.php">
       Order Allow,Deny
       Deny from all
   </Files>
   ```

3. **Enable Error Logging**
   
   In `config.php`:
   ```php
   ini_set('display_errors', 0);  // Hide from users
   error_reporting(E_ALL);         // Log everything
   ```

---

## 🧪 TESTING CHECKLIST

- [ ] **Database Migration:**
  ```sql
  SELECT * FROM license_codes LIMIT 1;
  -- Should return sample code
  ```

- [ ] **Check Endpoint:**
  ```bash
  curl https://calius.digital/api/license/check \
    -X POST -H "Content-Type: application/json" \
    -d '{"hwid":"test123456789abcdef0123456789ab","version":"3.2.2"}'
  # Expected: {"ok":true,"license":{"status":"trial",...}}
  ```

- [ ] **Activate Endpoint:**
  ```bash
  curl https://calius.digital/api/license/activate \
    -X POST -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","license_code":"CLIPPREM-TEST-2026-9999","hwid":"test123456789abcdef0123456789ab"}'
  # Expected: {"ok":true,"status":"success",...}
  ```

- [ ] **Verify Activation:**
  ```sql
  SELECT license_type, license_code FROM licenses WHERE hwid = 'test123456789abcdef0123456789ab';
  -- Should show 'personal' with code 'CLIPPREM-TEST-2026-9999'
  ```

---

## 📞 SUPPORT

**Technical Issues:**
- Email: support@calius.digital
- GitHub: [Issue Tracker]
- WhatsApp: [Your Number]

**Documentation:**
- Full Guide: `DEPLOYMENT_INSTRUCTIONS.md`
- API Docs: `api/license/activate.php` (inline comments)
- SQL Schema: `database_migration.sql` (comments)

---

## 🚀 POST-DEPLOYMENT TASKS

### **Immediate (After Upload):**
1. ✅ Test all 3 endpoints (/check, /increment, /activate)
2. ✅ Generate 50-100 license codes untuk inventory awal
3. ✅ Update desktop app UI (add License Activation tab)

### **Within 1 Week:**
1. Update product page dengan info aktivasi
2. Create FAQ: "Bagaimana cara aktivasi lisensi?"
3. Setup email template untuk kirim kode otomatis

### **Ongoing:**
1. Monitor API logs: `/api/license/error_log`
2. Check daily activations:
   ```sql
   SELECT COUNT(*) FROM license_codes WHERE status='active' AND DATE(activated_at) = CURDATE();
   ```
3. Generate kode baru jika inventory < 20

---

## 📊 VERSION HISTORY

### v3.3.0 (2026-01-09) - License Activation System
- ✅ Added `/api/license/activate` endpoint
- ✅ Added `license_codes` table
- ✅ Added `validate_license_code()` function
- ✅ Added `activate_license()` function
- ✅ Format: `CLIPPREM-PERS-2026-0001`
- ✅ Manual payment workflow support

### v3.2.2 (2026-01-08) - Initial Release
- ✅ Trial system (5 videos)
- ✅ HWID tracking
- ✅ Server validation
- ✅ Usage logging

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Backup database before deployment
- [ ] Run `database_migration.sql` in phpMyAdmin
- [ ] Upload `activate.php` to `/api/license/`
- [ ] Replace `functions.php` in `/api/license/`
- [ ] Update `config.php` credentials
- [ ] Test all endpoints with cURL
- [ ] Generate first batch of license codes (50+)
- [ ] Document MySQL credentials securely
- [ ] Setup monitoring/logging
- [ ] Update desktop app with activation UI

---

**🎉 Ready for Production!**

**Next:** Upload to cPanel → Test → Go Live!
