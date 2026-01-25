# 📦 CLIPPREMIUM LICENSE ACTIVATION - DEPLOYMENT GUIDE
**Version:** 3.3.0  
**Date:** 2026-01-09  
**Estimated Time:** 15-20 minutes

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] Backup database: `luaregrp_clippremium_license`
- [ ] Backup existing files:
  - `/api/license/functions.php`
  - `/api/license/` folder
- [ ] Download latest database export from phpMyAdmin
- [ ] Test connection: `https://calius.digital/api/license/check.php`

---

## 🚀 DEPLOYMENT STEPS

### **STEP 1: Database Migration** 🔴 CRITICAL - DO THIS FIRST!

1. **Login to cPanel:**
   ```
   https://calius.digital:2083
   Username: [your_cpanel_username]
   Password: [your_cpanel_password]
   ```

2. **Open phpMyAdmin:**
   - Sidebar → **Databases** → **phpMyAdmin**
   - Select database: `luaregrp_clippremium_license`

3. **Run Migration SQL:**
   - Click **SQL** tab (top menu)
   - Open file: `database_migration.sql`
   - Copy ALL content
   - Paste into SQL query box
   - Click **Go** button
   
4. **Verify Migration:**
   Expected output:
   ```
   ✓ ALTER TABLE licenses... (2 columns added)
   ✓ CREATE TABLE license_codes... (1 table created)
   ✓ INSERT INTO license_codes... (16 rows inserted)
   ✓ Migration completed successfully!
   ```

5. **Check Tables:**
   ```sql
   -- Check if license_code column exists
   DESCRIBE licenses;
   
   -- Check license_codes table
   SELECT * FROM license_codes LIMIT 5;
   ```

**⚠️ If errors occur:**
- Check if columns already exist (run `DESCRIBE licenses;`)
- If "Duplicate column" error → skip ALTER TABLE, run rest
- If "Table exists" error → skip CREATE TABLE, run rest

---

### **STEP 2: Upload API Files** 🔧

**Method A: cPanel File Manager (Recommended)**

1. Login cPanel → **File Manager**
2. Navigate to: `/public_html/api/license/`
3. **Backup existing files:**
   - Select `functions.php`
   - Click **Copy** → rename to `functions.php.backup`
4. **Upload new files:**
   - Click **Upload** button
   - Upload from `upload_ready/api/license/`:
     - ✅ `activate.php` (NEW)
     - ✅ `functions.php` (REPLACE)
5. **Set permissions:**
   - Select both files → **Permissions** → `644` (rw-r--r--)

**Method B: FTP Client (FileZilla)**

```
Host: ftp.calius.digital
Username: [your_ftp_username]
Password: [your_ftp_password]
Port: 21

Upload to: /public_html/api/license/
- activate.php (NEW)
- functions.php (REPLACE)
```

---

### **STEP 3: Test API Endpoints** ✅

**Test 1: Check Endpoint (Existing)**

```bash
curl -X POST https://calius.digital/api/license/check \
  -H "Content-Type: application/json" \
  -d '{"hwid":"test123456789abcdef0123456789ab","version":"3.2.2"}'
```

**Expected Response:**
```json
{
  "ok": true,
  "license": {
    "status": "trial",
    "videos_remaining": 5,
    "license_type": "trial"
  }
}
```

**Test 2: Activate Endpoint (NEW)**

```bash
curl -X POST https://calius.digital/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "license_code": "CLIPPREM-TEST-2026-9999",
    "hwid": "test123456789abcdef0123456789ab"
  }'
```

**Expected Response:**
```json
{
  "ok": true,
  "status": "success",
  "message": "Lisensi Personal berhasil diaktivasi! 🎉",
  "license": {
    "type": "personal",
    "videos_remaining": -1,
    "expires_at": null,
    "email": "test@example.com",
    "activated_at": "2026-01-09 10:30:00"
  }
}
```

**Test 3: Verify Activation in Database**

```sql
-- Check if test activation worked
SELECT 
    hwid, 
    license_type, 
    email, 
    license_code, 
    activated_at 
FROM licenses 
WHERE hwid = 'test123456789abcdef0123456789ab';

-- Check if license code status changed
SELECT 
    license_code, 
    status, 
    activated_by_hwid, 
    activated_at 
FROM license_codes 
WHERE license_code = 'CLIPPREM-TEST-2026-9999';
```

**Expected Results:**
- `licenses.license_type` = `personal`
- `licenses.license_code` = `CLIPPREM-TEST-2026-9999`
- `license_codes.status` = `active`
- `license_codes.activated_by_hwid` = `test123456789abcdef0123456789ab`

---

### **STEP 4: Test from Desktop App** 💻

1. **Open ClipPremium v3.2.2 Desktop App**
2. **Navigate to "License Activation" tab** (jika sudah ada di UI)
3. **Enter test data:**
   - Email: `test@example.com`
   - License Code: `CLIPPREM-PERS-2026-0001`
   - HWID: Auto-filled
4. **Click "Aktivasi"**
5. **Verify:**
   - Success message: "Lisensi berhasil diaktivasi!"
   - Token counter hilang
   - Status berubah: "✅ Licensed (Personal)"

---

## 🔐 POST-DEPLOYMENT SECURITY

### **1. Update config.php Credentials**

If not already done, edit `/api/license/config.php`:

```php
// Line 13-14: Database credentials
define('DB_USER', 'luaregrp_clipuser');  // ← Use actual cPanel MySQL user
define('DB_PASS', 'your_secure_password_here');  // ← Use actual password

// Line 11: Database name
define('DB_NAME', 'luaregrp_clippremium_license');  // ✓ Already correct

// Line 18: Change secret key
define('API_SECRET_KEY', 'Cli9Pre26m1um!@#S3cur3Key2026$%^');  // ← Generate random
```

### **2. Protect PHP Files from Direct Access**

Create `.htaccess` in `/api/license/`:

```apache
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>

<Files "functions.php">
    Order Allow,Deny
    Deny from all
</Files>

# Allow only PHP endpoint files
<FilesMatch "\.(php)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>
```

### **3. Enable Error Logging (Disable Display)**

In `config.php`:

```php
// Production settings
ini_set('display_errors', 0);  // Hide errors from users
error_reporting(E_ALL);         // Log all errors
ini_set('log_errors', 1);       // Enable logging
ini_set('error_log', __DIR__ . '/../../error_log');  // Log to file
```

---

## 📊 GENERATE LICENSE CODES

### **Manual Generation (Excel)**

1. **Open:** `License_Code_Generator.xlsx`
2. **Set Starting Number:** Cell B2 = `1`
3. **Set License Type:** Cell B3 = `PERS` or `AGNC`
4. **Set Year:** Cell B4 = `2026`
5. **Set Quantity:** Cell B5 = `50` (how many codes to generate)
6. **Click "Generate Codes" button**
7. **Copy generated codes** from Column A
8. **Insert to database:**

```sql
-- Bulk insert (replace with your generated codes)
INSERT INTO license_codes (license_code, license_type, status, notes) VALUES
('CLIPPREM-PERS-2026-0011', 'personal', 'unused', 'Batch 2 - January 2026'),
('CLIPPREM-PERS-2026-0012', 'personal', 'unused', 'Batch 2 - January 2026'),
('CLIPPREM-PERS-2026-0013', 'personal', 'unused', 'Batch 2 - January 2026');
-- ... continue for all codes
```

### **SQL Direct Generation (Quick)**

```sql
-- Generate 10 personal codes (0011-0020)
INSERT INTO license_codes (license_code, license_type, status) 
SELECT 
    CONCAT('CLIPPREM-PERS-2026-', LPAD(seq, 4, '0')),
    'personal',
    'unused'
FROM (
    SELECT 11 AS seq UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL 
    SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL 
    SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
) AS numbers;
```

---

## 🔄 MANUAL PAYMENT WORKFLOW

### **Customer buys via WA/Bank Transfer:**

1. **Customer contacts:** WA/Email with payment proof
2. **Admin verifies payment**
3. **Admin assigns license code:**

```sql
-- Find unused code
SELECT license_code 
FROM license_codes 
WHERE status = 'unused' 
  AND license_type = 'personal' 
LIMIT 1;
-- Result: CLIPPREM-PERS-2026-0001

-- Update with customer info (BEFORE sending)
UPDATE license_codes 
SET order_id = 'ORDER-20260109-001',
    buyer_email = 'customer@email.com',
    buyer_name = 'John Doe',
    notes = 'Payment via BCA - Transfer Rp 3.000.000'
WHERE license_code = 'CLIPPREM-PERS-2026-0001';
```

4. **Send code to customer:**
```
Subject: Kode Lisensi ClipPremium Anda

Terima kasih atas pembelian ClipPremium Personal License!

📧 Email: customer@email.com
🔑 Kode Lisensi: CLIPPREM-PERS-2026-0001

CARA AKTIVASI:
1. Buka ClipPremium Desktop App
2. Klik menu "License Activation"
3. Masukkan email + kode lisensi
4. Klik "Aktivasi" - Done!

Jika ada masalah, hubungi: support@calius.digital
```

5. **Customer activates** via desktop app
6. **Auto-updated in database:**
   - `license_codes.status` → `active`
   - `license_codes.activated_at` → Current timestamp
   - `licenses` table → New entry with unlimited access

---

## 📝 ADMIN QUERIES (Useful)

### **Check Active Licenses**

```sql
SELECT 
    l.hwid,
    l.license_type,
    l.email,
    l.license_code,
    l.videos_used,
    l.activated_at,
    lc.buyer_name,
    lc.order_id
FROM licenses l
LEFT JOIN license_codes lc ON l.license_code = lc.license_code
WHERE l.license_type IN ('personal', 'agency')
ORDER BY l.activated_at DESC;
```

### **Check Unused Codes**

```sql
SELECT 
    license_code,
    license_type,
    generated_at
FROM license_codes
WHERE status = 'unused'
ORDER BY license_type, license_code;
```

### **Check Usage Statistics**

```sql
-- Total licenses by type
SELECT 
    license_type,
    COUNT(*) as total,
    SUM(videos_used) as total_videos_processed
FROM licenses
GROUP BY license_type;

-- Recent activations (last 30 days)
SELECT 
    DATE(activated_at) as date,
    COUNT(*) as activations
FROM licenses
WHERE activated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(activated_at)
ORDER BY date DESC;
```

### **Revoke License (if needed)**

```sql
-- Step 1: Revoke code
UPDATE license_codes 
SET status = 'revoked',
    notes = CONCAT(notes, ' | REVOKED: Refund issued - 2026-01-09')
WHERE license_code = 'CLIPPREM-PERS-2026-0001';

-- Step 2: Block HWID
UPDATE licenses 
SET license_type = 'blocked',
    notes = 'License revoked - refund issued'
WHERE license_code = 'CLIPPREM-PERS-2026-0001';
```

---

## ⚠️ TROUBLESHOOTING

### **Error: "Database connection failed"**

**Solution:**
1. Check `config.php` credentials:
   ```sql
   -- Test credentials in phpMyAdmin
   SHOW GRANTS FOR 'luaregrp_clipuser'@'localhost';
   ```
2. Verify database exists:
   ```sql
   SHOW DATABASES LIKE 'luaregrp_clippremium_license';
   ```
3. Check MySQL service status (cPanel → Service Status)

---

### **Error: "Column 'license_code' doesn't exist"**

**Solution:**
Run migration SQL again, or manually add column:
```sql
ALTER TABLE licenses 
ADD COLUMN license_code VARCHAR(50) DEFAULT NULL AFTER email,
ADD INDEX idx_license_code (license_code);
```

---

### **Error: "Rate limit exceeded"**

**Solution:**
Increase limit in `config.php`:
```php
define('MAX_REQUESTS_PER_HOUR', 200);  // Increase from 100
```

Or clear old logs:
```sql
DELETE FROM api_requests 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

---

### **Error: "License code already used"**

**Customer Scenario:** Customer tries to activate but gets "already used" error

**Investigation:**
```sql
-- Check code status
SELECT 
    license_code,
    status,
    activated_by_hwid,
    activated_by_email,
    activated_at
FROM license_codes
WHERE license_code = 'CLIPPREM-PERS-2026-XXXX';
```

**Solutions:**
1. **If legitimately used:** Customer already activated, ask them to check their device
2. **If duplicate sale:** Admin error - issue new code to customer
3. **If fraudulent:** Revoke code, block HWID

---

## 📞 SUPPORT CONTACTS

**Technical Issues:**
- Server: support@calius.digital
- Database: Check cPanel → MySQL Databases

**Customer Support:**
- Email: support@calius.digital
- WhatsApp: [Your WA Number]

---

## ✅ DEPLOYMENT COMPLETE CHECKLIST

- [ ] Database migration successful
- [ ] Files uploaded to server
- [ ] Test endpoint `/check` → 200 OK
- [ ] Test endpoint `/activate` → 200 OK
- [ ] Test activation from desktop app
- [ ] License codes generated (minimum 20)
- [ ] Security: config.php credentials updated
- [ ] Security: .htaccess protecting sensitive files
- [ ] Backup: Downloaded database export
- [ ] Documentation: Saved deployment notes

---

**🎉 Deployment Complete! System ready for production use.**

**Next Steps:**
1. Monitor API logs: `/api/license/error_log`
2. Check daily activations via admin SQL queries
3. Generate more license codes as inventory runs low
4. Update desktop app to v3.3.0 with activation UI

---

**Version History:**
- v3.3.0 (2026-01-09): Added license activation system
- v3.2.2 (2026-01-08): Initial trial + server validation
