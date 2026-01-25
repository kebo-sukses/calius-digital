# 🚀 Calius Digital - Website Integration Complete

## ✅ What's Included

### 📁 Folder Structure
```
calius.digital/
├── api/
│   ├── license/          # License API (already tested ✅)
│   │   ├── check.php
│   │   ├── increment.php
│   │   ├── config.php
│   │   └── functions.php
│   ├── download.php      # NEW: Download handler with tracking
│   └── version.json
│
├── product/              # NEW: Product pages
│   └── ai-clip-premium.html
│
├── downloads/            # NEW: Software distribution
│   └── clip-premium/
│       ├── ClipPremium_v3.2.2_Setup.exe (10.72 MB)
│       └── ClipPremium_v3.2.2.bat
│
├── admin/                # Admin panel
├── assets/               # CSS, JS, Images
├── components/           # Header, Footer
├── data/                 # JSON data files
└── [other pages]         # Index, About, Contact, etc.
```

---

## 🌐 New URLs Available

### Product Page
📍 **https://calius.digital/product/ai-clip-premium.html**
- Professional landing page
- Feature showcase
- Download buttons
- Pricing information
- System requirements

### Download API
📍 **https://calius.digital/api/download.php?file=ClipPremium_v3.2.2_Setup.exe**
- Automatic download with tracking
- IP and user-agent logging
- Security validation

---

## 🎯 Features Implemented

### 1. Product Landing Page ✅
- **Modern Design**: Gradient hero section, feature cards
- **Download Section**: Two options (Installer + Portable)
- **Stats Dashboard**: User count, videos processed, rating
- **Feature Grid**: 6 key features with icons
- **Pricing Cards**: Personal (Rp 3 Juta) + Agency (Rp 15 Juta)
- **System Requirements**: Hardware specs
- **CTA Section**: Call-to-action for conversions
- **Responsive**: Mobile-friendly design

### 2. Download Handler ✅
- **Security**: File validation, MIME type checking
- **Logging**: Track downloads with IP, timestamp, user-agent
- **Error Handling**: 404, 400, 500 responses
- **CORS Support**: Cross-origin requests allowed
- **Chunked Transfer**: Efficient for large files

### 3. License API Integration ✅
- **Already Working**: Tested with HTTP 200 ✅
- **Database**: `luaregrp_clippremium_license`
- **User**: `luaregrp_admin`
- **Endpoints**:
  - `/api/license/check.php` - Check license status
  - `/api/license/increment.php` - Track video usage

---

## 📦 Upload Instructions

### Option A: Upload via cPanel File Manager

1. **Create ZIP file**:
   ```powershell
   # Run in PowerShell (already extracted to temp_extract/)
   Compress-Archive -Path "E:\SAAS Autemates Ai Video\temp_extract\*" `
     -DestinationPath "E:\SAAS Autemates Ai Video\calius_digital_FINAL.zip" -Force
   ```

2. **Upload to cPanel**:
   - Go to: cPanel → File Manager
   - Navigate to: `/home/luaregrp/calius.digital/`
   - Upload: `calius_digital_FINAL.zip`
   - Right-click → Extract
   - Select "Extract to current directory"

3. **Set Permissions**:
   ```bash
   # In cPanel Terminal or SSH
   chmod 755 /home/luaregrp/calius.digital/api/download.php
   chmod 755 /home/luaregrp/calius.digital/api/license/*.php
   chmod 777 /home/luaregrp/calius.digital/data/downloads.log
   ```

### Option B: Upload via FTP/SFTP

1. **Connect to server**:
   - Host: business901.web-hosting.com
   - Protocol: SFTP (Port 22) or FTP (Port 21)
   - Username: luaregrp
   - Password: [Your cPanel password]

2. **Upload folders**:
   - Upload `product/` folder
   - Upload `downloads/` folder
   - Upload `api/download.php`
   - Keep existing files (don't overwrite `api/license/`)

---

## 🧪 Testing Checklist

### After Upload, Test These URLs:

1. **Product Page**:
   ```
   https://calius.digital/product/ai-clip-premium.html
   ```
   Expected: Beautiful landing page loads

2. **Download Installer**:
   ```
   https://calius.digital/api/download.php?file=ClipPremium_v3.2.2_Setup.exe
   ```
   Expected: File downloads (10.72 MB)

3. **Download Portable**:
   ```
   https://calius.digital/api/download.php?file=ClipPremium_v3.2.2.bat
   ```
   Expected: File downloads (487 bytes)

4. **License API** (already working ✅):
   ```powershell
   $body = @{hwid="88877766655544433322211100AABBCC"; version="3.2.2"} | ConvertTo-Json
   Invoke-WebRequest -Uri "https://calius.digital/api/license/check.php" `
     -Method POST -Body $body -ContentType "application/json"
   ```
   Expected: HTTP 200 with license data

5. **Download Logs**:
   ```
   https://calius.digital/data/downloads.log
   ```
   Expected: Log entries with IP and timestamps

---

## 🔒 Security Notes

### API Files Protected ✅
- `config.php` contains database credentials
- Password: `WwX&ff*waL@?` (Very Strong 100/100)
- User: `luaregrp_admin`

### File Permissions
```bash
# Recommended permissions
chmod 644 *.html
chmod 644 *.css *.js
chmod 755 *.php
chmod 755 api/license/*.php
chmod 777 data/*.log data/*.json
chmod 644 downloads/clip-premium/*
```

### .htaccess Protection
Create `/downloads/.htaccess`:
```apache
# Prevent direct access - force downloads through API
Order Deny,Allow
Deny from all

# Allow download.php to read files
<Files ~ "\.(exe|bat|zip)$">
    Allow from env=REDIRECT_STATUS
</Files>
```

---

## 📊 Analytics & Monitoring

### Download Tracking
Logs saved to: `/data/downloads.log`

Example log entry:
```
[2026-01-08 11:30:15] IP: 203.123.45.67 | File: ClipPremium_v3.2.2_Setup.exe | Status: success | User-Agent: Mozilla/5.0...
```

### License Usage
Check database tables:
```sql
-- License records
SELECT * FROM licenses ORDER BY created_at DESC LIMIT 10;

-- Usage logs
SELECT * FROM usage_logs ORDER BY created_at DESC LIMIT 20;

-- API requests
SELECT * FROM api_requests ORDER BY created_at DESC LIMIT 20;
```

---

## 🎨 Customization

### Update Pricing
Edit: `/product/ai-clip-premium.html`
```html
<!-- Line ~250-260 -->
<div class="price">Rp 3 Juta <span>/lifetime</span></div>
```

### Add More Downloads
Edit: `/api/download.php`
```php
// Line 23-30
$ALLOWED_FILES = [
    'ClipPremium_v3.2.2_Setup.exe' => [...],
    'YourNewFile.zip' => [
        'size' => 12345678,
        'mime' => 'application/zip',
        'description' => 'Your Description'
    ]
];
```

### Change License Limits
Edit: `/api/license/config.php`
```php
// Line 24-28
define('TRIAL_VIDEO_LIMIT', 5);      // Free trial limit
define('PRICE_PERSONAL', 3000000);   // Rp 3 Juta
define('PRICE_AGENCY', 15000000);    // Rp 15 Juta
```

---

## 🚀 Next Steps

### 1. Upload Website ⏳
- Create final ZIP file
- Upload to cPanel
- Extract and set permissions

### 2. Test All Features ⏳
- Product page loads correctly
- Downloads work properly
- License API functioning
- Logs being written

### 3. Marketing Setup ⏳
- Add to navigation menu
- Update homepage with product link
- Create blog post announcement
- Social media promotion

### 4. Payment Integration ⏳
- Integrate payment gateway (Midtrans, Stripe, etc.)
- Link checkout page to payment processor
- Automate license key delivery

### 5. Monitor & Optimize ⏳
- Check download logs daily
- Monitor license activations
- Gather user feedback
- Update product based on feedback

---

## 📞 Support

### Technical Issues
- Database: Check `/api/license/config.php`
- Downloads: Check `/data/downloads.log`
- Errors: Check cPanel error_log

### Contact
- Website: https://calius.digital
- API Support: https://calius.digital/api/
- Admin Panel: https://calius.digital/admin/

---

## ✅ Final Checklist

Before going live:
- [ ] Upload all files to cPanel
- [ ] Set correct file permissions
- [ ] Test product page loads
- [ ] Test download links work
- [ ] Verify license API works
- [ ] Check download logs created
- [ ] Test on mobile devices
- [ ] Update navigation menu
- [ ] Create backup of website
- [ ] Monitor for 24 hours

---

**Status**: Ready for deployment! 🎉
**Version**: 1.0.0
**Date**: January 8, 2026
