# 🚀 ClipPremium Auto-Update System - Deployment Guide

## Overview

Sistem Semi-Automatic Update yang memungkinkan user mendapatkan notifikasi update, download dengan progress bar, dan one-click install.

---

## 📁 Files to Deploy

### Server-Side (Upload ke calius.digital)

| File | Path Server | Description |
|------|-------------|-------------|
| `version.json` | `/api/version.json` | Version info untuk update checking |
| `update-check.php` | `/api/update-check.php` | API endpoint untuk check/download/changelog |

### Client-Side (Sudah terintegrasi di app)

| File | Description |
|------|-------------|
| `update_checker.py` | Client-side update checker dengan download & install |
| `video_processor_dashboard.py` | Dashboard dengan update notification |

---

## 📤 Deployment Steps

### Step 1: Upload version.json

```bash
# Upload file ini ke server
scp api/version.json user@calius.digital:/var/www/html/api/version.json
```

**Lokasi:** `https://calius.digital/api/version.json`

### Step 2: Upload update-check.php

```bash
# Upload file ini ke server
scp api/update-check.php user@calius.digital:/var/www/html/api/update-check.php
```

**Lokasi:** `https://calius.digital/api/update-check.php`

### Step 3: Set File Permissions

```bash
# Di server, set permissions
chmod 644 /var/www/html/api/version.json
chmod 644 /var/www/html/api/update-check.php
```

### Step 4: Upload Installer

Upload installer ke folder downloads:

```bash
# Upload installer file
scp installers/ClipPremium_Setup_v3.4.4.exe user@calius.digital:/var/www/html/downloads/ClipPremium_v3.4.4_Setup.exe
```

**Lokasi:** `https://calius.digital/downloads/ClipPremium_v3.4.4_Setup.exe`

---

## 🔧 API Endpoints

### 1. Check Update

```http
GET /api/update-check.php?action=check&current_version=3.4.3

Response:
{
    "update_available": true,
    "latest_version": "3.4.4",
    "current_version": "3.4.3",
    "download_url": "https://calius.digital/downloads/ClipPremium_v3.4.4_Setup.exe",
    "download_size_mb": 180,
    "changelog": "...",
    "is_critical": false,
    "force_update": false
}
```

### 2. Get Download Info

```http
GET /api/update-check.php?action=download&version=3.4.4

Response:
{
    "version": "3.4.4",
    "files": {
        "installer": {
            "url": "https://calius.digital/downloads/ClipPremium_v3.4.4_Setup.exe",
            "filename": "ClipPremium_v3.4.4_Setup.exe",
            "size_mb": 180
        }
    },
    "checksums": {...}
}
```

### 3. Get Changelog

```http
GET /api/update-check.php?action=changelog

Response:
{
    "version": "3.4.4",
    "release_date": "2026-01-15",
    "changelog_html": "<h2>...</h2>..."
}
```

---

## ⚙️ How to Release New Version

### 1. Update version.json

Edit `/api/version.json`:

```json
{
    "version": "3.4.5",  // New version
    "version_code": 345,
    "changelog": "🆕 New features...",
    ...
}
```

### 2. Build New Installer

```bash
# Di lokal
python build_production.py
```

### 3. Upload Installer

```bash
# Upload ke server
scp installers/ClipPremium_Setup_v3.4.5.exe user@calius.digital:/var/www/html/downloads/ClipPremium_v3.4.5_Setup.exe
```

### 4. Test Update

```bash
# Di lokal, test update checker
cd python-scripts
python update_checker.py
```

---

## 🧪 Testing

### Test Locally (Before Deployment)

```bash
# Test update checker
cd python-scripts
python update_checker.py
```

Expected output:
```
Current Version: 3.4.4
Server URL: https://calius.digital/api/version.json
Checking for updates...
Update Available: False  (same version)
```

### Test API Endpoint (After Deployment)

```bash
# Test check endpoint
curl "https://calius.digital/api/update-check.php?action=check&current_version=3.4.3"

# Test download endpoint
curl "https://calius.digital/api/update-check.php?action=download&version=3.4.4"

# Test changelog endpoint
curl "https://calius.digital/api/update-check.php?action=changelog"
```

---

## 📊 Update Analytics

Update logs disimpan di server:
- Location: `/api/logs/update_checks.log`
- Format: `[timestamp] [IP] Checked version X.X.X -> Y.Y.Y`

---

## 🔒 Security Notes

1. **CORS**: API sudah di-configure untuk allow cross-origin dari `https://calius.digital`
2. **Rate Limiting**: Recommend implement rate limiting di server
3. **HTTPS**: Pastikan semua URL menggunakan HTTPS
4. **File Integrity**: Consider adding SHA256 checksums untuk installer

---

## 📞 Support

- Email: support@calius.digital
- WhatsApp: +628126067561
- Documentation: https://docs.calius.digital

---

## 🗂️ File Structure

```
calius.digital/
├── api/
│   ├── version.json          ← Version info
│   ├── update-check.php      ← API endpoint
│   └── logs/
│       └── update_checks.log ← Analytics
└── downloads/
    └── ClipPremium_v3.4.4_Setup.exe  ← Installer
```

---

**Last Updated:** January 16, 2026  
**System Version:** 2.0.0  
**Compatible App Version:** 3.4.4+
