# 🚀 SETUP GUIDE - Quick Reference

Panduan cepat untuk setup portfolio template ini dalam 10 menit!

## ⚡ Quick Setup (10 menit)

### Step 1: Install (2 menit)
```bash
npm install
```

### Step 2: Edit Config (5 menit)
Buka `config/portfolio.ts` dan ganti:

**WAJIB DIGANTI:**
- `personal.name` → Nama Anda
- `personal.title` → Job title Anda
- `personal.email` → Email Anda
- `personal.photo` → Path foto profil Anda
- `personal.bio` → Bio/deskripsi tentang Anda
- `seo.title` → Title untuk SEO
- `seo.description` → Deskripsi untuk SEO
- `seo.siteUrl` → URL domain Anda

**OPTIONAL (bisa di-skip dulu):**
- `personal.phone`
- `personal.location`
- `social.*` → Link social media
- `skills[]` → Daftar skills
- `projects[]` → Portfolio projects
- `contact.whatsappNumber`

### Step 3: Add Images (2 menit)
Upload minimal 1 foto:

```bash
public/images/profile.jpg    # Foto profil Anda (400x400px)
```

Untuk project images, bisa pakai placeholder dulu dari Unsplash.

### Step 4: Run Dev Server (1 menit)
```bash
npm run dev
```

Buka http://localhost:3000 - DONE! ✅

---

## 📸 Image Requirements

### Foto Profil (WAJIB)
- **File:** `public/images/profile.jpg`
- **Size:** 400x400px (square)
- **Format:** JPG atau PNG
- **Tips:** Pakai headshot professional dengan pencahayaan bagus

### Project Screenshots (Optional)
- **Folder:** `public/images/projects/`
- **Files:** `project-1.jpg`, `project-2.jpg`, etc.
- **Size:** 800x600px atau 1200x675px
- **Format:** JPG atau PNG

### OG Image (Optional, untuk social sharing)
- **File:** `public/images/og-image.jpg`
- **Size:** 1200x630px
- **Format:** JPG

**Need placeholder images?**
- Unsplash: https://unsplash.com
- UI Faces: https://uifaces.co

---

## 🎨 Customization Guide

### 1. Edit Personal Info
```typescript
// config/portfolio.ts
personal: {
  name: "Your Name Here",
  title: "Frontend Developer",
  email: "youremail@example.com",
  // ...
}
```

### 2. Add Projects
```typescript
// config/portfolio.ts
projects: [
  {
    id: 1,
    title: "Your Project Name",
    description: "Short description 100-150 chars",
    image: "/images/projects/project-1.jpg",
    tags: ["React", "Next.js", "Tailwind"],
    liveUrl: "https://demo.com",      // Optional
    githubUrl: "https://github.com/", // Optional
    featured: true,  // Set true untuk 1 project terbaik
  },
  // Add more projects...
]
```

### 3. Update Skills
```typescript
// config/portfolio.ts
skills: [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  // Add your skills...
]
```

### 4. Social Media Links
```typescript
// config/portfolio.ts
social: {
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  twitter: "https://twitter.com/username",    // Optional
  instagram: "https://instagram.com/username", // Optional
}
```

### 5. WhatsApp Contact
```typescript
// config/portfolio.ts
contact: {
  whatsappNumber: "6281234567890", // Format: country code + number (no +)
  whatsappMessage: "Halo! Saya ingin discuss project...",
}
```

---

## 🚀 Deployment

### Option 1: Vercel (Recommended - Gratis!)

1. Push code ke GitHub
2. Buka https://vercel.com
3. Click "New Project"
4. Import GitHub repository
5. Click "Deploy"
6. Done! 🎉

**Estimated time:** 5 menit

### Option 2: Netlify

1. Push code ke GitHub
2. Buka https://netlify.com
3. "Add new site" → "Import an existing project"
4. Connect to GitHub → Select repository
5. Deploy settings:
   - Build command: `npm run build`
   - Publish directory: `out`
6. Click "Deploy"

### Option 3: Custom Deployment Service

**Butuh bantuan deploy?** Contact kami:

**🎯 Basic Deploy - Rp 250k**
- Setup hosting
- Custom domain
- SSL certificate
- Basic SEO

**⚡ Pro Deploy - Rp 500k**
- Everything in Basic
- Contact form integration
- Analytics setup
- Performance optimization

📞 WhatsApp: +62-812-6067-561
📧 Email: hello@calius.digital
🌐 Website: https://www.calius.digital

---

## 🐛 Troubleshooting

### Images tidak muncul?
1. Check file name (case-sensitive!)
2. Check file ada di `public/images/`
3. Restart dev server: `Ctrl+C` lalu `npm run dev`
4. Clear browser cache

### Build error?
```bash
# Clear .next folder dan rebuild
rm -rf .next
npm run build
```

### Port 3000 sudah dipakai?
```bash
# Ganti port
npm run dev -- -p 3001
```

### TypeScript errors?
Ignore dulu dengan:
```typescript
// @ts-ignore
```

---

## ✅ Checklist Before Deploy

- [ ] Edit `config/portfolio.ts` dengan info Anda
- [ ] Upload foto profil ke `public/images/profile.jpg`
- [ ] Test di localhost: `npm run dev`
- [ ] Test build: `npm run build`
- [ ] Push ke GitHub
- [ ] Deploy ke Vercel/Netlify
- [ ] Test live URL
- [ ] Share ke social media! 🎉

---

## 📚 Full Documentation

Untuk dokumentasi lengkap, baca `README.md`

---

## 💬 Need Help?

**Free Template Support:**
- GitHub Issues: https://github.com/kebo-sukses/portfolio-template-free/issues
- Email: hello@calius.digital

**Paid Customization:**
- WhatsApp: +62-812-6067-561
- Package mulai dari Rp 250k

---

**Happy Building! 🚀**

Created with ❤️ by Calius Digital
