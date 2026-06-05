# 🛍️ Fashion Template Free

Template fashion marketplace premium yang tersedia **gratis** untuk semua orang. Dibangun dengan Next.js 16, TypeScript, Tailwind CSS v4, dan Framer Motion — dirancang untuk terasa seperti template senilai $150.

**Live Demo:** [fashion-template-free.vercel.app](https://fashion-template-free.vercel.app) *(coming soon)*  
**Dibuat oleh:** [Calius Digital](https://caliusdigital.com)

---

## ✨ Fitur Utama

- **Announcement Bar** — Sliding marquee dengan promo teks (gratis ongkir, COD, original, dll)
- **Navbar** — Sticky glassmorphism dengan mobile drawer, cart badge, dan gold hover underline
- **Hero Section** — Split layout bold typography, dual CTA, image grid dengan animasi floating card
- **Category Showcase** — Grid 4 kategori (Wanita, Pria, Hijab, Aksesoris) dengan hover zoom overlay
- **Flash Sale Section** — 8 product card dengan countdown timer live, discount badge, dan stock progress bar
- **Value Proposition** — 6 keunggulan toko di dark background (Original, Ongkir, COD, Retur, CS 24/7, Aman)
- **Testimonial Section** — Masonry grid 6 testimoni dengan rating bintang dan avatar inisial
- **FAQ Section** — Accordion 7 pertanyaan umum dengan animasi height collapse + WhatsApp CTA
- **Footer** — Newsletter, 3 kolom links, payment badges (BCA, GoPay, OVO, DANA, QRIS, COD)

---

## 🛠️ Tech Stack

| Teknologi | Versi |
|-----------|-------|
| [Next.js](https://nextjs.org) | 16+ (App Router) |
| [TypeScript](https://typescriptlang.org) | ^5 (strict mode) |
| [Tailwind CSS](https://tailwindcss.com) | v4 |
| [Framer Motion](https://framer.com/motion) | ^11 |
| [Lucide React](https://lucide.dev) | ^0.417 |

**Font:** Playfair Display (serif, headings) + Plus Jakarta Sans (sans, body)  
**Color Accent:** Gold `#D4AF37`  
**Images:** Unsplash via `next/image`

---

## 🚀 Cara Pakai

### 1. Clone repo

```bash
git clone https://github.com/kebo-sukses/fashion-template-free.git
cd fashion-template-free
```

### 2. Install dependencies

```bash
npm install
```

### 3. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 4. Build untuk production

```bash
npm run build
npm start
```

---

## 📁 Struktur Project

```
fashion-template-free/
├── app/
│   ├── globals.css          # Tailwind import + CSS variables
│   ├── layout.tsx           # Root layout + font loading + SEO metadata
│   └── page.tsx             # Main page (assembles semua komponen)
├── components/
│   ├── AnnouncementBar.tsx  # Sliding promo marquee
│   ├── Navbar.tsx           # Sticky glassmorphism navbar
│   ├── HeroSection.tsx      # Split hero + stats + dual CTA
│   ├── CategoryShowcase.tsx # Grid kategori dengan hover zoom
│   ├── FlashSaleSection.tsx # Product cards + countdown timer
│   ├── ValueProposition.tsx # 6 value props di dark background
│   ├── TestimonialSection.tsx # Masonry testimoni grid
│   ├── FaqSection.tsx       # Accordion FAQ + WhatsApp CTA
│   └── Footer.tsx           # Footer lengkap + payment badges
├── next.config.ts           # Next.js config (Unsplash remote images)
├── tailwind.config.ts       # Custom colors, fonts, marquee animation
├── postcss.config.mjs       # Tailwind v4 PostCSS config
└── tsconfig.json            # TypeScript strict config
```

---

## 🎨 Kustomisasi

### Ganti Warna Gold
Edit `tailwind.config.ts`:
```ts
colors: {
  gold: {
    DEFAULT: "#D4AF37", // ganti sesuai brand kamu
    light: "#E8D07A",
    dark: "#A88A1A",
  }
}
```

### Ganti Nama Toko
Cari dan replace `"Veloria"` di seluruh file dengan nama toko kamu.

### Ganti Produk Flash Sale
Edit array `products` di `components/FlashSaleSection.tsx` — update nama, harga, gambar Unsplash, dan diskon sesuai kebutuhan.

### Ganti Kategori
Edit array `categories` di `components/CategoryShowcase.tsx` — update nama dan URL gambar.

---

## 📦 Deploy ke Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kebo-sukses/fashion-template-free)

Atau manual:

```bash
npm install -g vercel
vercel
```

---

## 📄 Lisensi

Template ini bebas digunakan untuk keperluan **personal maupun komersial**. Tidak perlu atribusi, meski sangat diapresiasi 🙏

---

## 🤝 Tentang Calius Digital

Template ini dibuat dan didistribusikan gratis oleh **[Calius Digital](https://caliusdigital.com)** — platform tools & template untuk pelaku bisnis online Indonesia.

Butuh template lainnya? Kunjungi [caliusdigital.com/templates](https://caliusdigital.com/templates)
