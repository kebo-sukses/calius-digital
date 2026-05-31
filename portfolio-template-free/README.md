# 🎨 Portfolio Template - Free

Template portfolio modern dan professional yang **100% gratis** untuk siapa saja! Built dengan Next.js 14, TypeScript, Tailwind CSS, dan shadcn/ui.

## ✨ Features

- 🎯 **Easy Customization** - Edit 1 file config saja (`config/portfolio.ts`)
- 📱 **Fully Responsive** - Perfect di semua device (mobile, tablet, desktop)
- ⚡ **Fast Performance** - Built with Next.js 14 App Router
- 🎨 **Modern Design** - Clean, minimal, dan professional
- 🌙 **Dark Mode Support** - Auto dark/light mode
- 🔍 **SEO Optimized** - Meta tags, Open Graph, Twitter Card
- ♿ **Accessible** - ARIA labels dan semantic HTML
- 🚀 **Easy Deploy** - Deploy ke Vercel dalam 2 menit!

## 📦 What's Included

- ✅ Hero Section (Profile photo, name, title, CTA buttons)
- ✅ About Section (Bio, skills badges, contact info)
- ✅ Projects Section (Grid layout with featured project)
- ✅ Contact Section (Contact form + WhatsApp integration)
- ✅ Responsive Navbar (Smooth scroll navigation)
- ✅ Footer (Social links, quick navigation)

## 🚀 Quick Start

### 1. Download Template

Download template ini dari GitHub:

```bash
# Via Git Clone
git clone https://github.com/kebo-sukses/portfolio-template-free.git
cd portfolio-template-free

# Atau download ZIP langsung dari GitHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Customize Portfolio

Buka file `config/portfolio.ts` dan edit informasi Anda:

```typescript
export const portfolioConfig = {
  personal: {
    name: "Nama Anda",
    title: "Job Title Anda",
    email: "email@anda.com",
    // ... edit semua field
  },
  projects: [
    // Tambah/edit projects Anda
  ],
  // ... dan seterusnya
};
```

### 4. Add Your Images

Upload foto dan gambar Anda ke folder `public/images/`:

```
public/
  images/
    profile.jpg          # Foto profil Anda (400x400px, format: jpg/png)
    og-image.jpg         # Untuk social media share (1200x630px)
    projects/
      project-1.jpg      # Screenshot project 1 (800x600px)
      project-2.jpg      # Screenshot project 2
      ...
```

**Tips:**
- Foto profil: 400x400px, format JPG/PNG
- Project images: 800x600px atau 16:9 ratio
- OG Image: 1200x630px untuk optimal social sharing

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat portfolio Anda!

### 6. Deploy ke Vercel (Gratis!)

1. Push code Anda ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repository Anda
4. Klik "Deploy"
5. Done! Portfolio Anda sudah online 🎉

## 📝 Configuration Guide

### Personal Information

Edit informasi personal Anda:

```typescript
personal: {
  name: "John Doe",                    // Nama lengkap
  title: "Frontend Developer",         // Job title
  tagline: "I build beautiful...",     // Tagline singkat
  email: "john@example.com",           // Email
  phone: "+62 812 3456 7890",          // No. telepon
  location: "Jakarta, Indonesia",      // Lokasi
  photo: "/images/profile.jpg",        // Path foto profil
  bio: `Halo! Saya seorang...`,       // Bio lengkap (multi-line OK)
},
```

### Social Media Links

Tambahkan link social media Anda:

```typescript
social: {
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  twitter: "https://twitter.com/username",    // optional
  instagram: "https://instagram.com/username", // optional
  website: "https://yourwebsite.com",         // optional
},
```

### Skills

Daftar skills/teknologi yang Anda kuasai:

```typescript
skills: [
  "React",
  "Next.js",
  "TypeScript",
  // ... tambah sebanyak yang Anda mau
],
```

### Projects

Showcase projects/portfolio Anda:

```typescript
projects: [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack toko online dengan...",
    image: "/images/projects/project-1.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    liveUrl: "https://demo.com",        // URL live demo (optional)
    githubUrl: "https://github.com/...", // URL repo GitHub (optional)
    featured: true,  // Set true untuk tampil lebih besar
  },
  // ... tambah projects lain
],
```

**Tips Projects:**
- Set `featured: true` untuk 1 project terbaik Anda
- `liveUrl` dan `githubUrl` bisa `null` jika tidak ada
- Gunakan `tags` untuk highlight teknologi yang dipakai
- Description: 100-150 karakter optimal

### Contact Settings

Atur preferensi kontak:

```typescript
contact: {
  preferredMethod: "email",        // "email" atau "form"
  formEnabled: true,               // Enable/disable contact form
  formSubmitText: "Kirim Pesan",  // Text button form
  
  // WhatsApp quick link (optional)
  whatsappNumber: "6281234567890",  // Format: countrycode + number
  whatsappMessage: "Halo! Saya tertarik...",
},
```

### SEO Settings

Optimize untuk search engines:

```typescript
seo: {
  title: "John Doe - Frontend Developer Portfolio",
  description: "Portfolio website of...",
  keywords: ["frontend developer", "react", ...],
  ogImage: "/images/og-image.jpg",
  siteUrl: "https://yourwebsite.com",
},
```

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js` untuk customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Edit primary color di sini
      }
    }
  }
}
```

### Add More Sections

Ingin tambah sections seperti "Experience" atau "Education"?

1. Create component baru di `components/`
2. Import dan tambahkan ke `app/page.tsx`
3. Update navbar di `components/navbar.tsx`

## 📁 Project Structure

```
portfolio-template-free/
├── app/
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Main homepage
│   └── globals.css         # Global styles
├── components/
│   ├── hero-section.tsx    # Hero section
│   ├── about-section.tsx   # About section
│   ├── projects-section.tsx # Projects grid
│   ├── contact-section.tsx # Contact form
│   ├── navbar.tsx          # Navigation bar
│   ├── footer.tsx          # Footer
│   └── ui/                 # shadcn/ui components
├── config/
│   └── portfolio.ts        # ⭐ MAIN CONFIG FILE - Edit this!
├── public/
│   └── images/             # Your images here
├── lib/
│   └── utils.ts            # Utility functions
└── package.json
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI)
- **Icons:** Lucide React
- **Deployment:** Vercel (recommended)

## ❓ FAQ

### Q: Apakah benar-benar gratis?
**A:** Yes! 100% gratis. Silakan pakai untuk portfolio pribadi atau client.

### Q: Boleh dijual ulang?
**A:** Boleh! Tapi kami recommend untuk tidak dijual as-is. Modify dan add value dulu.

### Q: Butuh coding skill?
**A:** Minimal. Anda cukup:
- Tau cara edit file `.ts` (copy-paste values)
- Bisa run commands di terminal (`npm install`, `npm run dev`)
- Upload gambar ke folder

### Q: Bisa request custom feature?
**A:** Template ini adalah base yang simpel. Untuk custom features, silakan hire kami! 😊

### Q: Contact form tidak jalan?
**A:** Form ini mock implementation. Untuk production, Anda perlu:
1. Setup backend API (Next.js API Routes)
2. Integrate email service (Resend, SendGrid, dll)
3. Atau pakai service seperti Formspree, Getform

### Q: Gimana cara ganti font?
**A:** Edit `app/layout.tsx` dan import font dari `next/font/google`.

### Q: Bisa add blog?
**A:** Bisa! Tapi perlu setup content management. Recommend: MDX atau Sanity CMS.

## 🚀 Deployment Service

**Butuh bantuan deploy atau customize?** Calius Digital menyediakan deployment service:

### Paket Deployment

**🎯 Basic Deploy - Rp 250.000**
- Setup hosting (Vercel/Netlify)
- Custom domain connection
- SSL certificate
- Basic SEO setup

**⚡ Pro Deploy - Rp 500.000**
- Everything in Basic
- Contact form integration (email notifications)
- Google Analytics setup
- Performance optimization
- Minor customization (colors, layout)

**🎨 Enterprise - Rp 1.000.000+**
- Everything in Pro
- Full custom design modifications
- Additional sections (Blog, Testimonials, etc)
- CMS integration
- Advanced features & animations
- Priority support

📞 **Contact:** 
- WhatsApp: +62-812-6067-561
- Email: hello@calius.digital
- Website: https://www.calius.digital

## 📄 License

MIT License - Feel free to use for personal or commercial projects!

## 🙏 Credits

Created with ❤️ by [Calius Digital](https://www.calius.digital)

- **Design:** Minimalist modern portfolio
- **Built with:** Next.js, TypeScript, Tailwind CSS, shadcn/ui

---

**⭐ If you find this template useful, please star the repo on GitHub!**

**🐛 Found a bug?** Open an issue on GitHub

**💡 Have suggestions?** We'd love to hear from you!

---

## 🎯 Next Steps After Setup

1. ✅ Edit `config/portfolio.ts`
2. ✅ Add your images to `public/images/`
3. ✅ Test locally with `npm run dev`
4. ✅ Push to GitHub
5. ✅ Deploy to Vercel
6. ✅ Share your awesome portfolio! 🚀

**Good luck with your portfolio! 🎉**


To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
