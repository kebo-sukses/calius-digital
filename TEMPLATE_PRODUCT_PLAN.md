# Rencana Integrasi Template Marketing-Honda ke Calius Digital

> Dokumen ini berisi rencana penerapan template dari repo `Marketing-Honda` sebagai produk yang dijual di marketplace `calius.digital`.

---

## 1. Overview

### Marketing-Honda (Template Source)

| Aspek | Detail |
|-------|--------|
| Repo | `git@github.com:kebo-sukses/Marketing-Honda.git` |
| Framework | **Next.js 14** (App Router) |
| CMS | **Tina CMS** (Git-based, konten di `content/site.json`) |
| Styling | Tailwind CSS + shadcn/ui |
| Deploy | Vercel |
| Konten | Semua dikelola via JSON — sangat mudah di-copy & customize |

### Calius Digital (Marketplace)

| Aspek | Detail |
|-------|--------|
| Repo | `git@github.com:kebo-sukses/calius-digital.git` |
| Frontend | React (CRA + CRACO) + Tailwind |
| Backend | Python Flask (`api/index.py`) + MongoDB |
| Payment | Midtrans Snap (tersedia tapi tidak digunakan untuk ini) |
| Template Model | Field: `slug`, `name`, `price`, `demo_url`, `features`, dll |

---

## 2. Pendekatan yang Dipilih: Manual Transfer + Personal Handover

### Alasan

- **Simple** — tidak perlu integrasi GitHub API atau Midtrans production
- **Premium** — client merasa dapat layanan personal
- **Validasi market** — uji apakah produk ini diminati sebelum automasi
- **Bisa jalan sekarang** — tanpa development tambahan yang kompleks

### Model Bisnis

```
Template Honda Dealer Landing Page
├── Harga: Rp 499.000 - 750.000
├── Pembayaran: Transfer manual (BCA/Mandiri/dll)
├── Delivery: Fork repo ke GitHub client
├── Bonus: Personal setup + panduan CMS
└── Support: Via WhatsApp
```

---

## 3. Alur Kerja (User Flow)

```
CLIENT                          ANDA (ADMIN)                    SISTEM
──────                          ────────────                    ──────
1. Lihat template di
   calius.digital
   → Klik "Pesan via WhatsApp"

2. WhatsApp ke Anda
   "Saya mau beli template
    Honda Dealer"

3. Transfer ke rekening Anda
   → Kirim bukti transfer

                                4. Konfirmasi pembayaran
                                   (cek rekening/mutasi)

                                5. Minta username GitHub client
                                   "Kasih username GitHub kamu ya"

                                6. Fork repo Marketing-Honda      → Repo baru di akun
                                   ke akun client GitHub             client terbuat
                                   ────────────────────
                                   Cara:
                                   a) Buka repo Marketing-Honda
                                   b) Klik Fork → pilih akun client
                                   ATAU
                                   c) Use Template (jika repo = template)

                                7. Setup awal untuk client:
                                   - Buat project di Vercel
                                   - Connect ke repo client
                                   - Set environment variables
                                   - Setup TinaCloud project

                                8. Serah terima via call/WA:
                                   - Tunjukkan cara akses /admin
                                   - Cara edit produk, harga, foto
                                   - Cara ganti nomor WA & info bisnis
                                   - Cara upload gambar baru

9. Client mulai edit sendiri
   via Tina CMS (/admin)
   → Website dealer jadi!
```

---

## 4. Yang Perlu Disiapkan

### A. Di Calius Digital (Website Marketplace)

Perubahan minimal:

| Komponen | Perubahan |
|----------|-----------|
| **TemplateDetailPage.js** | Ganti tombol "Buy Now" → "Pesan via WhatsApp" (link ke WA dengan pesan pre-filled) |
| **Admin Panel** | Tambahkan template Honda sebagai produk via admin |
| **Backend** | Tidak perlu diubah untuk sekarang |

### B. Di Repo Marketing-Honda

Pastikan repo siap di-fork:

| Persiapan | Status |
|-----------|--------|
| `.env.example` lengkap | ✅ Sudah ada |
| `README.md` dengan panduan | ✅ Sudah ada (sangat detail) |
| `content/site.json` mudah diedit | ✅ Sudah ada |
| Tina CMS config | ✅ Sudah ada |
| Repo bersih (tidak ada secrets) | ⚠️ Perlu dicek |

### C. Data Template untuk Didaftarkan di Admin Calius

```json
{
  "slug": "honda-dealer-landing-page",
  "name": "Honda Dealer Landing Page",
  "category": "landing-page",
  "price": 750000,
  "sale_price": 499000,
  "description_id": "Template landing page high-converting untuk dealer motor Honda. Dilengkapi Tina CMS untuk edit konten tanpa coding. Fitur: Hero section, showcase produk dengan harga & cicilan, testimonial, Google Maps, WhatsApp CTA, SEO JSON-LD, dan responsive design.",
  "description_en": "High-converting landing page template for Honda motorcycle dealers. Includes Tina CMS for no-code content editing. Features: Hero section, product showcase with pricing & installments, testimonials, Google Maps, WhatsApp CTA, SEO JSON-LD, and responsive design.",
  "features": [
    "Tina CMS (Edit tanpa coding)",
    "SEO JSON-LD (Local Business)",
    "Floating WhatsApp CTA",
    "Responsive Design",
    "Google Maps Embed",
    "Promo Banner (on/off)",
    "Product Showcase (harga + cicilan)",
    "Testimonial Section",
    "Coverage Area (Local SEO)",
    "Fast Performance (Next.js 14)"
  ],
  "technologies": ["Next.js 14", "Tailwind CSS", "Tina CMS", "shadcn/ui", "Vercel"],
  "demo_url": "https://marketing-honda.vercel.app",
  "source_repo": "kebo-sukses/Marketing-Honda",
  "is_featured": true,
  "is_new": true,
  "is_bestseller": false
}
```

---

## 5. Checklist Serah Terima per Client

Gunakan checklist ini setiap kali ada client baru yang membeli:

```
SETUP AWAL
□ Fork/create repo di akun GitHub client
□ Buat project Vercel, connect ke repo client
□ Set env vars di Vercel:
  - NEXT_PUBLIC_TINA_CLIENT_ID = (dari TinaCloud)
  - TINA_TOKEN = (dari TinaCloud)
  - NEXT_PUBLIC_TINA_BRANCH = main
  - NEXT_PUBLIC_BASE_URL = https://[domain-client].vercel.app
□ Buat project TinaCloud (https://app.tina.io)
  - Connect ke repo GitHub client
  - Copy Client ID dan Token
□ Test build & deploy berhasil
□ Test akses /admin (Tina CMS) berhasil

PANDUAN KE CLIENT
□ Tunjukkan cara akses /admin (Tina CMS)
□ Cara edit info bisnis:
  - Nama dealer, alamat, telepon, WhatsApp
  - Email, jam operasional
  - Google Maps embed URL
□ Cara edit produk:
  - Nama motor, tagline, harga
  - DP, cicilan, fitur
  - Upload gambar produk
□ Cara edit testimonial:
  - Nama, lokasi, text, rating
□ Cara edit area layanan (coverage)
□ Cara toggle promo banner (on/off)
□ Cara edit SEO (title, description)
□ Jelaskan: setiap klik Save → auto deploy ke Vercel

SELESAI
□ Pastikan client bisa login ke /admin
□ Pastikan client bisa save & website terupdate
□ Berikan nomor WA support jika ada kendala
```

---

## 6. Konten yang Bisa Diedit Client via Tina CMS

Semua ada di `content/site.json`:

| Section | Field yang Bisa Diedit | Lokasi di JSON |
|---------|----------------------|----------------|
| **SEO** | Title, description, keywords, OG image | `seo.*` |
| **Info Bisnis** | Nama dealer, alamat, telepon, WA, email, jam buka, Google Maps | `business.*` |
| **Hero** | Headline, subheadline, gambar, CTA text | `hero.*` |
| **Promo Banner** | Text promo, warna, on/off | `promoBanner.*` |
| **Produk** | Nama, tagline, gambar, harga, DP, cicilan, fitur | `products[]` |
| **Keunggulan** | Icon, judul, deskripsi (6 fitur) | `features[]` |
| **Why Choose Us** | List alasan pilih dealer ini | `whyChooseUs[]` |
| **Testimonial** | Nama, lokasi, text review, rating bintang | `testimonials[]` |
| **Area Layanan** | Daftar kota/kecamatan yang dilayani | `coverageAreas[]` |
| **Footer** | Copyright text, disclaimer | `footer.*` |

---

## 7. Environment Variables yang Diperlukan

```env
# Database (Optional - bisa dilewati dulu)
MONGO_URL=mongodb://localhost:27017
DB_NAME=honda_dealer

# Base URL
NEXT_PUBLIC_BASE_URL=https://[nama-client].vercel.app

# Tina CMS (dari TinaCloud - https://app.tina.io)
NEXT_PUBLIC_TINA_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TINA_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_TINA_BRANCH=main
```

---

## 8. Rencana Evolusi ke Depan

| Fase | Waktu | Deskripsi |
|------|-------|-----------|
| **Fase 1 (Sekarang)** | Sekarang | Manual transfer, manual fork, personal handover. Target: 5-10 client/bulan |
| **Fase 2 (Nanti)** | Setelah 10+ client | Tambah Midtrans payment, semi-auto fork, video guide + WA support. Target: 20-50 client/bulan |
| **Fase 3 (Skala)** | Setelah 50+ client | Full automated: auto payment, auto GitHub API fork, self-service portal. Target: 100+ client/bulan |

### Perubahan Teknis untuk Fase 2-3 (Nanti)

Jika sudah siap automasi, tambahkan di `api/index.py`:

```python
# Field baru di model TemplateCreate
source_repo: Optional[str] = None        # "kebo-sukses/Marketing-Honda"
repo_branch: Optional[str] = "main"
setup_guide_id: Optional[str] = None
setup_guide_en: Optional[str] = None
env_template: Optional[List[str]] = []   # List env vars yang perlu diisi client

# Endpoint baru
POST /api/templates/{slug}/deliver
├── Input: order_id, customer_github_username
├── Proses: Fork repo via GitHub API
└── Output: { delivery_url, delivery_type }
```

---

## 9. Template Pesan WhatsApp

### Pesan Pre-filled untuk Tombol "Pesan via WhatsApp"

```
Halo Admin Calius Digital! 👋

Saya tertarik dengan template *Honda Dealer Landing Page*.

Saya ingin memesan template ini. Mohon info untuk proses pembeliannya.

Terima kasih! 🙏
```

### Pesan Konfirmasi Setelah Pembayaran (Dikirim Admin ke Client)

```
Terima kasih sudah memesan template Honda Dealer Landing Page! ✅

Pembayaran sudah kami terima. Untuk proses setup, mohon kirimkan:
1. Username GitHub Anda
2. Nama bisnis/dealer Anda
3. Nomor WhatsApp bisnis Anda

Setelah itu kami akan:
1. Setup repo di GitHub Anda
2. Deploy website ke Vercel
3. Atur CMS agar Anda bisa edit sendiri
4. Panduan lengkap cara edit konten

Estimasi selesai: 1x24 jam kerja.
```

---

*Dokumen dibuat: 16 Maret 2026*
*Terakhir diupdate: 16 Maret 2026*
