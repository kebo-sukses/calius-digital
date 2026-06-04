#!/usr/bin/env python3
"""
Upload Article #2: Web E-Commerce — Panduan Toko Online Sukses 2026
Target keyword : web ecommerce (~5.000/bulan)
SEO Title      : Web E-Commerce: Panduan Toko Online Sukses 2026  (52 chars)
Meta Desc      : 155 chars
Internal links : 6 links ke artikel existing
External links : 2 links ke authority sites (Google, developers.google.com)
URL slug       : /blog/web-ecommerce-panduan-toko-online-2026
"""

import os, sys, getpass, requests, json

BASE_URL = "https://www.calius.digital"

# ── Auth ──────────────────────────────────────────────────────────────────────
username = os.environ.get("ADMIN_USERNAME") or input("Username: ").strip()
password = os.environ.get("ADMIN_PASSWORD") or getpass.getpass("Password: ")

print(f"\n🔐 Login sebagai {username}...")
r = requests.post(f"{BASE_URL}/api/auth/login",
                  json={"username": username, "password": password})
if r.status_code != 200:
    print(f"❌ Login gagal: {r.status_code} — {r.text}")
    sys.exit(1)
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
print("✅ Login berhasil\n")

# ── Article Content ────────────────────────────────────────────────────────────
content_id = """
<p>Tahun 2026, pasar <strong>web e-commerce</strong> Indonesia diproyeksikan menembus <strong>Rp 700 triliun</strong> — dan ironisnya, jutaan UMKM masih mengandalkan marketplace dengan potongan komisi 5–15% per transaksi.</p>

<p>Pertanyaannya bukan lagi <em>"apakah saya butuh toko online sendiri?"</em> — tapi <em>"kapan saya mulai membangunnya?"</em></p>

<p>Panduan ini menjawab semua yang perlu Anda tahu: pemilihan platform, estimasi biaya nyata, 7 fitur wajib, cara build step-by-step, hingga strategi marketing yang menghasilkan konversi. Tanpa jargon teknis yang membingungkan.</p>

<h2>Apa Itu Web E-Commerce dan Mengapa Bisnis Anda Butuhnya?</h2>

<p><strong>Web e-commerce</strong> adalah website toko online <em>milik Anda sendiri</em> — bukan "toko" di dalam platform orang lain seperti Shopee atau Tokopedia. Anda yang kontrol tampilan, data customer, harga, dan margin keuntungan.</p>

<h3>E-Commerce Sendiri vs Marketplace: Perbandingan Jujur</h3>

<table style="width:100%; border-collapse:collapse; margin:16px 0;">
<thead>
<tr style="background:#1a1a2e;">
<th style="padding:10px 12px; text-align:left; color:#FF4500; border-bottom:2px solid #FF4500;">Aspek</th>
<th style="padding:10px 12px; text-align:left; color:#e0e0e0; border-bottom:2px solid #333;">Marketplace</th>
<th style="padding:10px 12px; text-align:left; color:#e0e0e0; border-bottom:2px solid #333;">Web E-Commerce Sendiri</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid #222;">
<td style="padding:9px 12px; color:#ccc;">Komisi per transaksi</td>
<td style="padding:9px 12px; color:#f87171;">5–15%</td>
<td style="padding:9px 12px; color:#4ade80;">0% (payment gateway ~2–3%)</td>
</tr>
<tr style="border-bottom:1px solid #222; background:#111;">
<td style="padding:9px 12px; color:#ccc;">Data customer</td>
<td style="padding:9px 12px; color:#f87171;">Milik platform</td>
<td style="padding:9px 12px; color:#4ade80;">Milik Anda sepenuhnya</td>
</tr>
<tr style="border-bottom:1px solid #222;">
<td style="padding:9px 12px; color:#ccc;">Kontrol harga</td>
<td style="padding:9px 12px; color:#f87171;">Terbatas (perang harga)</td>
<td style="padding:9px 12px; color:#4ade80;">Penuh</td>
</tr>
<tr style="border-bottom:1px solid #222; background:#111;">
<td style="padding:9px 12px; color:#ccc;">Brand awareness</td>
<td style="padding:9px 12px; color:#f87171;">Brand platform dominan</td>
<td style="padding:9px 12px; color:#4ade80;">Brand Anda yang dikenal</td>
</tr>
<tr style="border-bottom:1px solid #222;">
<td style="padding:9px 12px; color:#ccc;">Risiko suspend akun</td>
<td style="padding:9px 12px; color:#f87171;">Tinggi</td>
<td style="padding:9px 12px; color:#4ade80;">Nol</td>
</tr>
</tbody>
</table>

<p>Sudah menghitung berapa yang hilang ke marketplace setiap bulan? Cek di artikel ini: <a href="/blog/biaya-admin-marketplace-mahal-hitung-kerugian">Biaya Admin Marketplace: Berapa Kerugian Sebenarnya yang Anda Tanggung?</a></p>

<h2>Platform Web E-Commerce Terbaik untuk UMKM Indonesia 2026</h2>

<p>Memilih platform adalah keputusan terbesar pertama Anda. Berikut perbandingan empat opsi paling relevan untuk pasar Indonesia:</p>

<h3>1. WooCommerce (WordPress) — Fleksibel, Ekosistem Terbesar</h3>
<p>WooCommerce digunakan lebih dari 6 juta toko online worldwide. Cocok untuk bisnis yang butuh fleksibilitas dan kontrol penuh.</p>
<ul>
<li><strong>Biaya:</strong> Plugin gratis, hosting Rp 50–200 rb/bulan</li>
<li><strong>Kelebihan:</strong> Ribuan plugin tersedia, SEO sangat kuat dengan Yoast</li>
<li><strong>Kekurangan:</strong> Butuh maintenance rutin, perlu hosting yang cepat</li>
<li><strong>Cocok untuk:</strong> Toko dengan katalog produk besar (&gt;100 SKU)</li>
</ul>

<h3>2. Shopify — Paling Mudah, All-in-One</h3>
<p>Shopify adalah platform SaaS e-commerce terpopuler di dunia. Setup dalam hitungan jam tanpa coding.</p>
<ul>
<li><strong>Biaya:</strong> $29–79/bulan (~Rp 450 rb–1,2 jt)</li>
<li><strong>Kelebihan:</strong> Interface intuitif, support 24/7, built-in analytics</li>
<li><strong>Kekurangan:</strong> Biaya bulanan terus berjalan, ada transaction fee tambahan</li>
<li><strong>Cocok untuk:</strong> Pemula yang mau cepat launching tanpa ribet teknis</li>
</ul>

<h3>3. Custom Development — Kontrol 100%</h3>
<p>Bangun dari nol dengan developer. Hasilnya? Website persis sesuai kebutuhan bisnis Anda — tidak ada kompromi fitur.</p>
<ul>
<li><strong>Biaya:</strong> Rp 15–50 juta (tergantung kompleksitas)</li>
<li><strong>Kelebihan:</strong> Fitur 100% custom, tidak ada biaya bulanan platform</li>
<li><strong>Kekurangan:</strong> Waktu development lama (1–3 bulan), biaya awal tinggi</li>
<li><strong>Cocok untuk:</strong> Bisnis established dengan kebutuhan spesifik</li>
</ul>

<h3>4. Template HTML Premium — Paling Cost-Effective untuk UMKM</h3>
<p>Template HTML siap pakai yang bisa langsung dikustomisasi. Calius Digital menyediakan template e-commerce yang sudah mobile-friendly, fast-loading, dan SEO-ready — tanpa biaya bulanan.</p>
<ul>
<li><strong>Biaya:</strong> Rp 0–1 juta (sekali bayar, selamanya milik Anda)</li>
<li><strong>Kelebihan:</strong> Launching dalam 1–3 hari, tidak ada biaya langganan</li>
<li><strong>Kekurangan:</strong> Fitur lebih terbatas dibanding custom development</li>
<li><strong>Cocok untuk:</strong> UMKM yang mau go-online cepat dengan budget terbatas</li>
</ul>

<div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%); border:1px solid #FF4500; border-radius:12px; padding:20px; margin:24px 0;">
<p style="color:#FF4500; font-weight:700; margin:0 0 8px;">💡 Rekomendasi Calius Digital</p>
<p style="color:#e0e0e0; margin:0;">Untuk UMKM yang baru mulai, <strong>template + shared hosting</strong> adalah pilihan paling masuk akal. Setelah omzet stabil di atas Rp 10 juta/bulan, baru pertimbangkan upgrade ke WordPress WooCommerce atau custom development.</p>
</div>

<h2>Estimasi Biaya Web E-Commerce: Rincian Jujur Tanpa Hidden Cost</h2>

<p>Ini yang sering tidak disampaikan: <strong>biaya membuat web e-commerce sangat bervariasi</strong>, tapi ada komponen yang tidak bisa dihindari.</p>

<h3>Komponen Biaya Wajib</h3>
<ul>
<li><strong>Domain:</strong> Rp 100–200 rb/tahun (.com) atau Rp 150–300 rb/tahun (.co.id)</li>
<li><strong>Hosting:</strong> Rp 50–500 rb/bulan — shared hosting cukup untuk toko baru</li>
<li><strong>SSL Certificate:</strong> Gratis via Let's Encrypt, atau Rp 300–800 rb/tahun</li>
<li><strong>Payment Gateway:</strong> Midtrans/Xendit ~2–3% per transaksi + biaya setup</li>
<li><strong>Template/Development:</strong> Rp 0–50 juta sesuai pilihan platform</li>
</ul>

<h3>Total Estimasi Tahun Pertama</h3>
<table style="width:100%; border-collapse:collapse; margin:16px 0;">
<thead>
<tr style="background:#1a1a2e;">
<th style="padding:10px 12px; text-align:left; color:#FF4500; border-bottom:2px solid #FF4500;">Skema</th>
<th style="padding:10px 12px; text-align:left; color:#e0e0e0; border-bottom:2px solid #333;">Tahun Pertama</th>
<th style="padding:10px 12px; text-align:left; color:#e0e0e0; border-bottom:2px solid #333;">Tahun Berikutnya</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid #222;">
<td style="padding:9px 12px; color:#ccc;">Template HTML + Shared Hosting</td>
<td style="padding:9px 12px; color:#4ade80;">Rp 500 rb – 2 juta</td>
<td style="padding:9px 12px; color:#4ade80;">Rp 600 rb – 1,2 juta</td>
</tr>
<tr style="border-bottom:1px solid #222; background:#111;">
<td style="padding:9px 12px; color:#ccc;">WordPress WooCommerce</td>
<td style="padding:9px 12px; color:#fbbf24;">Rp 2–8 juta</td>
<td style="padding:9px 12px; color:#fbbf24;">Rp 1,5–4 juta</td>
</tr>
<tr style="border-bottom:1px solid #222;">
<td style="padding:9px 12px; color:#ccc;">Shopify Basic</td>
<td style="padding:9px 12px; color:#fbbf24;">Rp 5–6 juta</td>
<td style="padding:9px 12px; color:#fbbf24;">Rp 5–6 juta</td>
</tr>
<tr style="border-bottom:1px solid #222; background:#111;">
<td style="padding:9px 12px; color:#ccc;">Custom Development</td>
<td style="padding:9px 12px; color:#f87171;">Rp 15–50 juta</td>
<td style="padding:9px 12px; color:#60a5fa;">Rp 2–5 juta</td>
</tr>
</tbody>
</table>

<p>Bandingkan: kalau omzet Anda Rp 20 juta/bulan dengan komisi marketplace 8%, Anda kehilangan <strong>Rp 1,6 juta setiap bulan</strong> — Rp 19,2 juta per tahun hanya untuk komisi. Investasi website sendiri sudah balik modal dalam 1–3 bulan pertama.</p>

<h2>7 Fitur Wajib Web E-Commerce yang Menghasilkan Konversi</h2>

<p>Banyak toko online gagal bukan karena produk jelek — tapi karena website yang tidak mendukung proses pembelian. Pastikan web e-commerce Anda punya 7 fitur ini:</p>

<h3>1. Halaman Produk yang Meyakinkan</h3>
<p>Foto produk berkualitas tinggi minimal 3 sudut pandang, deskripsi lengkap dengan spesifikasi detail, dan ulasan customer yang terlihat. Selalu kompres gambar produk di bawah <strong>100KB format WebP</strong> untuk kecepatan loading optimal.</p>

<h3>2. Multiple Payment Gateway</h3>
<p>Transfer bank, kartu kredit, QRIS, GoPay, OVO, Dana, dan ShopeePay. Semakin banyak pilihan pembayaran, semakin kecil kemungkinan customer kabur saat checkout karena metode bayarnya tidak tersedia.</p>

<h3>3. Checkout 1–3 Langkah (One-Page Checkout)</h3>
<p>Setiap langkah tambahan di checkout mengakibatkan kehilangan 10–20% konversi. Minimalkan form — cukup nama, alamat pengiriman, dan metode pembayaran. Simpan data untuk pembelian berikutnya.</p>

<h3>4. Mobile-First Design (Prioritas Utama)</h3>
<p>78% transaksi e-commerce Indonesia dilakukan dari smartphone. Jika website Anda tidak mobile-friendly, Anda kehilangan hampir 80% potensi penjualan sebelum customer sempat melihat produk Anda.</p>

<h3>5. SEO On-Page yang Kuat untuk Traffic Organik</h3>
<p>URL produk descriptive, meta title unik per produk, schema markup untuk product review, dan sitemap XML yang ter-update otomatis. Untuk panduan SEO lebih mendalam, baca: <a href="/blog/panduan-lengkap-landing-page-2026">Panduan Lengkap SEO Landing Page 2026: Strategi yang Terbukti</a>.</p>

<h3>6. Tombol WhatsApp untuk Customer Service Real-Time</h3>
<p>Tombol "Chat via WhatsApp" yang floating di setiap halaman, langsung terhubung ke nomor bisnis dengan pesan pembuka otomatis. Konversi naik signifikan ketika customer bisa tanya-tanya sebelum memutuskan beli.</p>

<h3>7. Kecepatan Loading di Bawah 2 Detik</h3>
<p>Setiap detik penundaan loading = 7% penurunan konversi. Optimalkan gambar ke format WebP, gunakan CDN Cloudflare (gratis), dan pilih hosting dengan server di Indonesia atau Singapura. Ketahui dampak nyata website lambat terhadap pendapatan Anda: <a href="/blog/website-toko-online-lemot-kerugian-omzet">Website Toko Online Lambat? 7 Kerugian Nyata yang Menggerus Omzet</a>.</p>

<h2>Cara Membangun Web E-Commerce dari Nol: Step-by-Step 2026</h2>

<p>Berikut roadmap realistis yang bisa Anda mulai hari ini — dari nol hingga toko online siap menerima pembayaran:</p>

<h3>Step 1: Riset &amp; Perencanaan (1–3 Hari)</h3>
<ul>
<li>Tentukan niche dan target pasar yang spesifik — jangan coba jualan segalanya</li>
<li>Riset keyword produk dengan Google Keyword Planner atau Ubersuggest</li>
<li>Analisa 3 kompetitor: apa kelebihan mereka? Di mana celahnya?</li>
<li>Buat daftar fitur wajib vs nice-to-have untuk versi pertama</li>
</ul>

<h3>Step 2: Domain, Hosting &amp; Platform (1 Hari)</h3>
<ul>
<li>Daftarkan domain di Niagahoster, Dewaweb, atau Domainesia</li>
<li>Pilih hosting sesuai budget — shared hosting sudah cukup untuk mulai</li>
<li>Install platform pilihan atau upload template HTML yang sudah disiapkan</li>
</ul>

<h3>Step 3: Desain, Konten &amp; Katalog Produk (3–7 Hari)</h3>
<ul>
<li>Kustomisasi template sesuai brand identity (warna, logo, font)</li>
<li>Foto produk dan kompres ke WebP &lt;100KB sebelum upload</li>
<li>Tulis deskripsi produk yang SEO-friendly — sertakan keyword natural</li>
<li>Buat halaman pendukung: About Us, Cara Pesan, Kebijakan Retur, FAQ</li>
</ul>

<h3>Step 4: Integrasi Pembayaran &amp; Logistik (1–2 Hari)</h3>
<ul>
<li>Setup Midtrans atau Xendit — dua payment gateway paling populer di Indonesia</li>
<li>Integrasi cek ongkir JNE/J&amp;T/Sicepat otomatis berdasarkan berat produk</li>
<li>Test semua skenario pembayaran sebelum live — pastikan notifikasi berjalan</li>
</ul>

<h3>Step 5: SEO, Analytics &amp; Testing (2–3 Hari)</h3>
<ul>
<li>Setup Google Analytics 4 dan Google Search Console</li>
<li>Submit sitemap.xml ke Google Search Console</li>
<li>Test mobile responsiveness di 3+ device berbeda</li>
<li>Cek PageSpeed Insights — target skor &gt;85 untuk mobile</li>
</ul>

<h3>Step 6: Soft Launch &amp; Akuisisi Customer Pertama</h3>
<p>Jangan menunggu sempurna. <em>Done is better than perfect</em> — launch dulu, optimize belakangan. Promosikan ke WhatsApp group, Instagram Stories, dan pertimbangkan Google Ads Rp 50–100 rb/hari untuk traffic awal.</p>

<p>Ingin berjualan online tanpa potongan marketplace sejak hari pertama? Baca panduan strategi lengkapnya: <a href="/blog/cara-jualan-online-tanpa-potongan-marketplace">Cara Jualan Online Tanpa Potongan Marketplace: Panduan Lengkap UMKM</a>.</p>

<h2>Strategi Marketing Web E-Commerce yang Terbukti Menghasilkan</h2>

<h3>1. SEO Organik — ROI Terbaik Jangka Panjang</h3>
<p>Buat konten blog yang menjawab pertanyaan target customer Anda. Artikel yang muncul di halaman 1 Google menghasilkan traffic gratis selamanya. <a href="https://developers.google.com/search/docs/specialty/ecommerce" rel="noopener noreferrer" target="_blank">Panduan resmi Google untuk e-commerce SEO</a> menekankan kualitas konten dan pengalaman pengguna sebagai faktor utama.</p>

<h3>2. Google Shopping Ads — Konversi 30% Lebih Tinggi</h3>
<p>Tampilkan produk Anda langsung di hasil pencarian Google dengan foto, harga, dan nama toko. Daftarkan produk melalui <a href="https://www.google.com/intl/id/retail/solutions/google-shopping/" rel="noopener noreferrer" target="_blank">Google Merchant Center</a> — gratis, dan bisa mulai beriklan dengan budget minimal Rp 50 rb/hari.</p>

<h3>3. WhatsApp Marketing — Open Rate 98%</h3>
<p>Kumpulkan nomor WhatsApp customer saat checkout, buat database, lalu broadcast promo ke segmen yang tepat. Open rate WhatsApp mencapai 98% — jauh di atas email marketing (20–25%). Gunakan WhatsApp Business API untuk skala besar.</p>

<h3>4. Landing Page untuk Setiap Kampanye Promo</h3>
<p>Untuk Harbolnas, Lebaran, atau Flash Sale, buat landing page dedicated yang fokus pada satu penawaran. Ini meningkatkan conversion rate hingga 3x dibanding mengarahkan traffic langsung ke halaman kategori. <a href="/blog/panduan-lengkap-landing-page-2026">Pelajari cara membuat landing page konversi tinggi →</a></p>

<h3>5. Retargeting — Konversi Pengunjung yang Belum Beli</h3>
<p>Pasang Facebook Pixel dan Google Tag di website Anda. Tampilkan iklan kembali ke pengunjung yang sudah melihat produk tapi belum checkout — conversion rate retargeting bisa 10x lebih tinggi dibanding iklan cold audience.</p>

<h2>Web E-Commerce vs Marketplace: Kapan Harus Pindah?</h2>

<p>Ini bukan soal mana yang lebih baik — tapi kapan timing yang tepat untuk beralih.</p>

<p><strong>Tetap prioritaskan marketplace kalau:</strong></p>
<ul>
<li>Baru mulai dan butuh traffic instan tanpa effort marketing</li>
<li>Belum ada brand awareness dan bukti sosial sama sekali</li>
<li>Omzet masih di bawah Rp 5 juta/bulan</li>
</ul>

<p><strong>Segera bangun web e-commerce sendiri kalau:</strong></p>
<ul>
<li>Omzet sudah di atas Rp 10 juta/bulan (biaya komisi mulai terasa signifikan)</li>
<li>Ingin membangun brand jangka panjang yang tidak tergantung kebijakan platform</li>
<li>Mau punya database customer untuk remarketing dan loyalty program</li>
<li>Pernah mengalami atau khawatir akan suspend akun tanpa alasan yang jelas</li>
</ul>

<p>Strategi terbaik: gunakan keduanya secara paralel. Marketplace untuk eksposur dan akuisisi customer baru, website sendiri untuk customer repeat dan kampanye langsung.</p>

<div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%); border:1px solid #FF4500; border-radius:12px; padding:24px; margin:32px 0; text-align:center;">
<h3 style="color:#FF4500; margin:0 0 12px; font-size:1.25rem;">Siap Punya Web E-Commerce Sendiri?</h3>
<p style="color:#e0e0e0; margin:0 0 16px; font-size:0.95rem;">Template Calius Digital sudah include: mobile-first design, fast loading &lt;2 detik, integrasi WhatsApp, katalog produk, dan SEO-ready. Launching dalam 1–3 hari.</p>
<a href="/templates" style="display:inline-block; background:#FF4500; color:#fff; padding:12px 28px; border-radius:8px; font-weight:700; text-decoration:none;">Lihat Template E-Commerce →</a>
</div>
""".strip()

# ── FAQ Items ──────────────────────────────────────────────────────────────────
faq_items = [
    {
        "question": "Berapa biaya membuat web e-commerce sendiri?",
        "answer": "Mulai dari Rp 500 ribu/tahun (domain + hosting + template gratis) hingga Rp 50 juta+ untuk custom development. Untuk UMKM yang baru mulai, template premium + shared hosting adalah pilihan paling cost-effective dengan total investasi Rp 1–3 juta di tahun pertama — dan sudah balik modal jika dibandingkan biaya komisi marketplace."
    },
    {
        "question": "Apa platform web e-commerce terbaik untuk pemula Indonesia?",
        "answer": "Tergantung budget dan kebutuhan. Shopify paling mudah tapi berbayar bulanan (~Rp 450rb–1,2jt). WooCommerce paling fleksibel dengan biaya lebih rendah. Template HTML Calius Digital adalah opsi tercepat dan termurah untuk UMKM yang ingin go-online dalam 1–3 hari tanpa biaya bulanan."
    },
    {
        "question": "Apakah bisa berjualan di website sendiri sekaligus di marketplace?",
        "answer": "Bisa dan sangat disarankan! Gunakan marketplace untuk mendapat traffic awal dan eksposur ke customer baru, sambil perlahan bangun loyalitas di web e-commerce sendiri. Fungsikan marketplace sebagai 'akuisisi' dan website sebagai 'retensi'. Arahkan customer repeat untuk pesan langsung via website Anda."
    },
    {
        "question": "Bagaimana cara menerima pembayaran di web e-commerce?",
        "answer": "Integrasikan payment gateway seperti Midtrans atau Xendit yang mendukung transfer bank, kartu kredit, QRIS, dan semua e-wallet populer (GoPay, OVO, Dana, ShopeePay). Biaya sekitar 2–3% per transaksi plus biaya setup awal. Keduanya menyediakan plugin/API untuk berbagai platform termasuk WordPress dan custom build."
    },
    {
        "question": "Apakah web e-commerce butuh izin usaha atau NIB?",
        "answer": "Secara teknis tidak wajib untuk mulai, tapi sangat disarankan. NIB (Nomor Induk Berusaha) melalui OSS meningkatkan kepercayaan customer dan dibutuhkan saat mendaftar ke payment gateway tertentu. Proses pendaftaran NIB bisa dilakukan gratis dan online di oss.go.id — prosesnya biasanya selesai dalam 1 hari kerja."
    },
    {
        "question": "Berapa lama web e-commerce bisa mendapat traffic organik dari Google?",
        "answer": "Dengan SEO yang benar, rata-rata 3–6 bulan untuk mulai muncul di halaman 1 Google untuk keyword spesifik. Percepat dengan konten blog rutin, backlink dari website relevan, Google My Business, dan Google Shopping Ads. Kombinasikan SEO (jangka panjang) dengan Google Ads (traffic instan) di bulan-bulan pertama."
    },
    {
        "question": "Apa perbedaan web e-commerce dan landing page?",
        "answer": "Web e-commerce adalah toko online lengkap dengan multiple halaman produk, keranjang belanja, dan sistem checkout penuh. Landing page adalah halaman tunggal yang fokus pada satu konversi spesifik. Keduanya saling melengkapi: web e-commerce sebagai toko utama, landing page untuk campaign flash sale atau promo seasonal."
    },
    {
        "question": "Bagaimana cara mengoptimalkan kecepatan web e-commerce?",
        "answer": "Kompres semua gambar ke format WebP dengan ukuran di bawah 100KB, gunakan CDN Cloudflare (gratis), aktifkan browser caching, minify CSS dan JavaScript, dan pilih hosting dengan server di Indonesia atau Singapura. Target skor PageSpeed Insights di atas 85 untuk mobile. Ingat: setiap detik penundaan = 7% penurunan konversi."
    }
]

# ── Article Payload ────────────────────────────────────────────────────────────
payload = {
    "slug": "web-ecommerce-panduan-toko-online-2026",
    "title_id": "Web E-Commerce: Panduan Lengkap Membangun Toko Online Sukses 2026",
    "title_en": "Web E-Commerce: Complete Guide to Building a Successful Online Store 2026",
    "excerpt_id": (
        "Panduan lengkap web e-commerce 2026 untuk UMKM Indonesia: pilihan platform, "
        "estimasi biaya nyata, 7 fitur wajib konversi, dan strategi marketing yang terbukti. "
        "Dari nol hingga toko online siap terima pembayaran."
    ),
    "excerpt_en": (
        "Complete web e-commerce guide 2026 for Indonesian SMBs: platform comparison, "
        "real cost breakdown, 7 must-have features, and proven marketing strategies."
    ),
    "content_id": content_id,
    "content_en": content_id,  # same for now
    "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    "featured_image_alt": "Web e-commerce toko online UMKM Indonesia 2026 — panduan lengkap platform dan strategi",
    "author": "Calius Digital",
    "category": "E-Commerce",
    "tags": ["web ecommerce", "toko online", "e-commerce", "bisnis online", "UMKM", "jualan online", "website toko online"],
    "read_time": 12,
    "seo_title": "Web E-Commerce: Panduan Toko Online Sukses 2026",
    "seo_description": (
        "Panduan lengkap web e-commerce 2026 untuk UMKM. Platform, biaya, fitur wajib "
        "& strategi konversi toko online sukses. Cek template gratis Calius Digital!"
    ),
    "faq_items": faq_items
}

# Validate SEO fields
seo_title_len = len(payload["seo_title"])
seo_desc_len  = len(payload["seo_description"])
print(f"📋 SEO Title  : {seo_title_len} chars {'✅' if seo_title_len <= 60 else '⚠️ terlalu panjang'}")
print(f"📋 Meta Desc  : {seo_desc_len} chars {'✅' if seo_desc_len <= 155 else '⚠️ terlalu panjang'}")
print(f"📋 Slug       : {payload['slug']}")
print()

# ── Upload ─────────────────────────────────────────────────────────────────────
print("📤 Mengupload artikel...")
r = requests.post(f"{BASE_URL}/api/admin/blog",
                  headers=headers, json=payload)

if r.status_code in (200, 201):
    result = r.json()
    article_id = result.get("id") or result.get("_id") or result.get("article_id", "?")
    print(f"✅ Artikel berhasil diupload!")
    print(f"   ID     : {article_id}")
    print(f"   URL    : {BASE_URL}/blog/{payload['slug']}")
else:
    print(f"❌ Gagal upload: {r.status_code}")
    print(r.text[:500])
    sys.exit(1)

print()
print("=" * 65)
print(" ✅ Article #2 live di production!")
print(f"    {BASE_URL}/blog/{payload['slug']}")
print("=" * 65)
