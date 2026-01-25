# Calius Digital - Website Jasa & Template + Admin Panel

## Project Overview
Modern website untuk jasa pembuatan website dan penjualan template dengan admin panel lengkap.

## Tech Stack
- Frontend: React 19, Tailwind CSS, Framer Motion, Shadcn UI, TipTap (WYSIWYG)
- Backend: FastAPI, Motor (async MongoDB), JWT Auth, Resend Email
- Database: MongoDB
- Payment: Midtrans Snap
- Image Upload: Cloudinary

## What's Been Implemented (Jan 2025)

### Phase 1: Public Website ✅
- Homepage, Services, Templates, Portfolio, Pricing, Blog, Contact
- Bilingual (ID/EN), Dark mode, WhatsApp button
- Midtrans checkout

### Phase 2: Admin Panel ✅
- JWT Auth dengan roles (Admin/Editor)
- Dashboard statistik
- CRUD: Templates, Portfolio, Blog, Testimonials, Pricing
- Messages & Orders management
- Users management (Admin only)
- Export data

### Phase 3: Enhanced Features ✅ NEW
- **Rich Text Editor (WYSIWYG)** - TipTap untuk penulisan blog
  - Toolbar: Bold, Italic, Strikethrough, Code
  - Headings (H1, H2, H3), Lists, Blockquote
  - Link, Image insertion
  - Undo/Redo
  - Tab switch Indonesia/English
  - Preview post
  
- **Email Notification** - Resend
  - Auto email ke admin saat order sukses
  - Confirmation email ke customer
  - HTML template profesional

## Credentials & Access

### Admin Panel
- URL: `/admin/login`
- Default: `admin` / `admin123`

### API Keys Required (Production)
1. **RESEND_API_KEY** - untuk email notification
2. **ADMIN_EMAIL** - email penerima notifikasi order
3. **CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET** - untuk upload gambar
4. **MIDTRANS_SERVER_KEY, CLIENT_KEY** - untuk payment

## Environment Variables
```
# Backend (.env)
RESEND_API_KEY=re_xxxx
ADMIN_EMAIL=your@email.com
SENDER_EMAIL=noreply@yourdomain.com (atau onboarding@resend.dev untuk testing)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
MIDTRANS_SERVER_KEY=xxx
MIDTRANS_CLIENT_KEY=xxx
```

## Next Tasks
1. Dapatkan Resend API key dari https://resend.com
2. Setup domain email untuk sender (opsional)
3. Dapatkan Cloudinary credentials dari https://cloudinary.com
4. Dapatkan Midtrans production keys
5. Ganti admin password default
