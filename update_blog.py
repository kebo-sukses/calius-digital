"""
Update blog articles: better headings, spacing, and internal links.

Usage:
  $env:CALIUS_USER = "Jeslius"
  $env:CALIUS_PASS  = "Calius2026!"
  python update_blog.py
"""

import os
import sys
import requests

BASE_URL = os.environ.get("CALIUS_URL", "https://www.calius.digital").rstrip("/")

TOKEN = os.environ.get("CALIUS_TOKEN", "")
if not TOKEN:
    username = os.environ.get("CALIUS_USER", "")
    password = os.environ.get("CALIUS_PASS", "")
    if not username or not password:
        print("ERROR: Set $env:CALIUS_USER dan $env:CALIUS_PASS terlebih dahulu.")
        sys.exit(1)
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"username": username, "password": password}, timeout=20)
    r.raise_for_status()
    TOKEN = r.json().get("access_token", "")
    print(f"Login OK. Role: {r.json().get('user', {}).get('role')}\n")

HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

# ---------------------------------------------------------------------------
# Ambil semua post untuk dapatkan ID-nya
# ---------------------------------------------------------------------------
r = requests.get(f"{BASE_URL}/api/blog?limit=20", headers=HEADERS, timeout=20)
r.raise_for_status()
data = r.json()
posts = data if isinstance(data, list) else data.get("posts", data.get("items", []))
id_map = {p["slug"]: p["id"] for p in posts}
print(f"Ditemukan {len(id_map)} post di database.\n")

# ---------------------------------------------------------------------------
# Konten baru artikel — spacing lebar, headings kuat, internal links
# ---------------------------------------------------------------------------

A1_CONTENT = """
<p class="lead">
  Setiap kali Shopee, Tokopedia, atau TikTok Shop mengumumkan perubahan kebijakan biaya,
  jutaan seller UMKM langsung merasakan dampaknya ke rekening. Tapi berapa banyak yang
  benar-benar pernah duduk dan menghitung angkanya? Artikel ini akan bantu Anda melakukan
  simulasi itu — dan hasilnya mungkin mengejutkan.
</p>

<h2>Mengapa Biaya Admin Marketplace Terasa Semakin Mencekik?</h2>

<p>
  Masalahnya bukan sekedar persentase yang naik. Masalah utamanya adalah
  <strong>ketidakpastian jangka panjang</strong>. Anda tidak bisa merencanakan harga jual
  dan margin keuntungan untuk 12 bulan ke depan ketika aturan platform bisa berubah
  kapan saja tanpa negosiasi.
</p>

<p>
  Maret 2024 — Shopee menaikkan biaya layanan untuk beberapa kategori. Akhir tahun yang sama,
  TikTok Shop bergabung dengan Tokopedia dan mulai menyesuaikan struktur biaya.
  Tahun 2025, siklus ini berulang lagi. Dan setiap kali, seller hanya punya dua pilihan:
  naikkan harga (risiko kehilangan pembeli), atau serap sendiri (margin makin tipis).
</p>

<h2>5 Lapisan Potongan yang Diam-diam Menguras Margin Anda</h2>

<p>
  Sebagian besar seller hanya memperhatikan satu angka: persentase biaya admin yang tertulis
  di dashboard. Padahal ada berlapis-lapis biaya yang bekerja bersamaan dan terakumulasi
  setiap bulan:
</p>

<ul>
  <li>
    <strong>Biaya layanan (admin fee)</strong> — 2%–5% dari harga jual, tergantung kategori
    dan tier toko Anda
  </li>
  <li>
    <strong>Biaya iklan wajib (SPonsor / TopAds)</strong> — Tanpa iklan berbayar, produk
    tenggelam di algoritma. Rata-rata seller menghabiskan 5%–15% omzet hanya untuk ini
  </li>
  <li>
    <strong>Subsidi gratis ongkir</strong> — Platform mensyaratkan keikutsertaan program
    gratis ongkir. Anda menanggung sebagian biaya pengirimannya
  </li>
  <li>
    <strong>Flash sale &amp; diskon wajib kampanye</strong> — Ikut Harbolnas atau event
    marketplace berarti diskon 10%–50% yang bersifat wajib untuk menjaga visibilitas
  </li>
  <li>
    <strong>Biaya retur barang</strong> — Ongkir retur sering menjadi beban seller,
    bahkan untuk kasus yang bukan kesalahan Anda
  </li>
</ul>

<h2>Simulasi Nyata: Toko Baju UMKM dengan Omzet Rp 20 Juta/Bulan</h2>

<p>
  Mari buka spreadsheet mental dan hitung dengan angka yang realistis. Asumsikan sebuah
  toko fashion UMKM dengan omzet kotor Rp 20 juta per bulan:
</p>

<ul>
  <li>Omzet kotor: <strong>Rp 20.000.000</strong></li>
  <li>Biaya admin 4%: <strong>&minus; Rp 800.000</strong></li>
  <li>Iklan SPonsor (8% dari omzet): <strong>&minus; Rp 1.600.000</strong></li>
  <li>Subsidi gratis ongkir (estimasi): <strong>&minus; Rp 600.000</strong></li>
  <li>Potongan flash sale/campaign (estimasi): <strong>&minus; Rp 400.000</strong></li>
</ul>

<p>
  <strong>Total potongan platform: Rp 3.400.000 per bulan — atau 17% dari omzet kotor Anda.</strong>
</p>

<p>
  Jika margin produk Anda 30%, berarti lebih dari setengah profit yang seharusnya masuk ke kantong
  Anda justru habis untuk membayar platform yang tidak Anda miliki.
</p>

<h2>Bukan Soal Angka Saja — Ini Soal Siapa yang Pegang Kendali</h2>

<p>
  Ketika Anda berjualan sepenuhnya di marketplace, platform yang menentukan:
</p>

<ul>
  <li>Bagaimana produk Anda ditampilkan (dan disembunyikan)</li>
  <li>Siapa yang melihat toko Anda</li>
  <li>Kapan dan berapa besar diskon yang "harus" Anda berikan</li>
  <li>Apakah akun Anda bisa suspend kapan saja</li>
</ul>

<p>
  Data pelanggan Anda — nama, nomor HP, alamat, riwayat pembelian — semua dimiliki platform,
  bukan bisnis Anda. Jika besok platform tutup atau Anda diblokir, semua itu hilang.
</p>

<h2>Solusi: Bangun Jalur Penjualan yang Tidak Bisa Dipotong Siapapun</h2>

<p>
  Seller cerdas tidak meninggalkan marketplace sepenuhnya — tapi mereka membangun
  <strong>website toko online sendiri</strong> sebagai aset utama, dan menggunakan marketplace
  hanya sebagai saluran akuisisi pelanggan baru.
</p>

<p>
  Dengan website sendiri, Anda tidak membayar biaya admin per transaksi. Tidak ada kewajiban
  ikut program diskon paksa. Data pelanggan adalah aset bisnis Anda. Dan investasi satu kali
  bayar untuk website profesional bisa kembali modal hanya dari penghematan biaya admin
  selama 3–5 bulan.
</p>

<p>
  Calius Digital menyediakan
  <a href="/templates">template website toko online</a> yang sudah dioptimasi untuk konversi
  dan kecepatan — cocok untuk seller UMKM yang ingin membangun jalur penjualan mandiri tanpa
  biaya berulang yang menguras margin. Lihat semua pilihan template kami dan mulai hitung
  penghematan yang bisa Anda raih.
</p>

<h2>Langkah Konkret yang Bisa Anda Mulai Hari Ini</h2>

<ol>
  <li>
    Buka laporan penjualan marketplace bulan terakhir. Hitung total yang Anda bayarkan
    dalam bentuk biaya admin, iklan, dan potongan kampanye
  </li>
  <li>
    Bandingkan angka itu dengan biaya investasi website sekali bayar
  </li>
  <li>
    Mulai dengan landing page sederhana — halaman produk terlaris + tombol order via WhatsApp
  </li>
  <li>
    Secara bertahap arahkan pelanggan loyal dari marketplace ke jalur pembelian langsung
    dengan penawaran eksklusif (harga lebih baik karena tidak ada potongan)
  </li>
</ol>

<p>
  Setiap bulan yang berlalu tanpa website sendiri adalah bulan di mana margin Anda terus
  diserahkan ke platform lain. Tidak perlu langsung besar — mulai hari ini, meski dengan
  satu langkah kecil.
</p>
"""

A2_CONTENT = """
<p class="lead">
  Bosan melihat 15–20% omzet Anda menguap setiap bulan karena biaya admin, iklan wajib,
  dan potongan kampanye marketplace? Panduan ini menjelaskan langkah-langkah konkret
  membangun jalur penjualan online yang benar-benar milik Anda — tanpa potongan,
  tanpa bergantung pada aturan platform yang bisa berubah kapan saja.
</p>

<h2>Mengapa Ini Bukan Tentang "Anti Marketplace"</h2>

<p>
  Marketplace adalah alat yang sangat efektif untuk akuisisi pelanggan baru — terutama
  di awal bisnis ketika belum ada traffic organik. Masalah muncul ketika Anda
  <em>100% bergantung</em> pada satu platform yang tidak Anda kendalikan.
</p>

<p>
  Strategi seller cerdas: gunakan marketplace untuk menemukan pembeli baru, tapi miliki
  website sendiri sebagai jalur utama untuk penjualan repeat buyer. Dengan cara ini,
  Anda membangun aset bisnis jangka panjang — bukan hanya "numpang" di platform orang lain.
</p>

<h2>3 Model Jualan Online Tanpa Marketplace yang Sudah Terbukti</h2>

<h3>Model A — Website + WhatsApp (Paling Populer untuk UMKM)</h3>

<p>
  Model paling sederhana dan paling cepat diimplementasikan. Cara kerjanya: pembeli browsing
  produk di website Anda, klik tombol "Pesan via WhatsApp", lanjutkan transaksi via transfer
  atau QRIS, dan pengiriman langsung via ekspedisi tanpa perantara.
</p>

<p>
  <strong>Cocok untuk:</strong> Fashion, kuliner kemasan, kerajinan, dan produk niche dengan
  komunitas pembeli yang sudah terbentuk.
</p>

<h3>Model B — Website dengan Payment Gateway Terintegrasi</h3>

<p>
  Lebih profesional dan otomatis. Pembeli bayar langsung di website via GoPay, OVO, QRIS,
  atau transfer bank — semua terekam otomatis tanpa Anda harus konfirmasi manual satu per satu.
  Biaya payment gateway umumnya 0,5%–2% per transaksi, jauh lebih rendah dibanding biaya
  admin marketplace yang bisa mencapai 4%–6%.
</p>

<p>
  <strong>Cocok untuk:</strong> Toko dengan volume transaksi tinggi yang ingin scale dan
  mengurangi kerja operasional manual.
</p>

<h3>Model C — Landing Page Khusus + Iklan Langsung</h3>

<p>
  Arahkan iklan Google atau Meta langsung ke landing page produk Anda — bukan ke marketplace.
  Return on Ad Spend (ROAS) untuk website sendiri umumnya 3–5x lebih tinggi karena tidak ada
  distraksi ke produk kompetitor yang sering terjadi di dalam marketplace.
</p>

<p>
  <strong>Cocok untuk:</strong> Produk premium bernilai tinggi atau produk dengan target
  audiens yang sangat spesifik dan terdefinisi dengan baik.
</p>

<h2>5 Langkah Membangun Jalur Penjualan Mandiri dari Nol</h2>

<h3>Langkah 1 — Pilih Template Website yang Tepat</h3>

<p>
  Membangun website dari nol membutuhkan waktu berbulan-bulan dan biaya puluhan juta rupiah.
  Gunakan <a href="/templates">template website siap pakai</a> yang sudah mencakup halaman produk,
  sistem checkout, dan integrasi WhatsApp. Investasi awal jauh lebih kecil, dan Anda bisa
  langsung berjualan.
</p>

<h3>Langkah 2 — Mulai dengan 5–10 Produk Terlaris</h3>

<p>
  Jangan upload semua katalog sekaligus. Fokus pada produk dengan margin tertinggi yang
  paling dirugikan oleh potongan marketplace. Produk terlaris berarti sudah terbukti ada
  permintaannya — lebih mudah untuk dikonversi di website sendiri.
</p>

<h3>Langkah 3 — Pindahkan Social Proof</h3>

<p>
  Screenshot ulasan bintang 5 dari marketplace (dengan izin) dan tampilkan sebagai
  testimoni di website. Kepercayaan yang sudah dibangun di marketplace bisa dan
  harus dibawa ke aset digital milik Anda sendiri.
</p>

<h3>Langkah 4 — Arahkan Pelanggan Lama ke Website</h3>

<p>
  Kirim pesan personal ke pelanggan setia: <em>"Hai Kak, kami sekarang punya website
  sendiri di [URL]. Khusus pelanggan setia seperti Kakak, ada diskon 10% untuk
  pembelian pertama via website."</em>
</p>

<p>
  Pelanggan yang sudah percaya pada Anda akan dengan senang hati beralih — terutama
  jika Anda bisa menawarkan harga sedikit lebih baik karena tidak ada potongan platform.
</p>

<h3>Langkah 5 — Mulai Iklan Kecil ke Website</h3>

<p>
  Budget Rp 50.000–100.000 per hari sudah cukup untuk mulai. Arahkan langsung ke
  halaman produk website — bukan ke marketplace. Lacak konversi dengan teliti dan
  optimalkan secara bertahap berdasarkan data nyata.
</p>

<h2>Kalkulasi Break Even Point yang Realistis</h2>

<p>
  Asumsikan omzet marketplace Rp 15 juta/bulan, dan Anda berhasil memindahkan 30%
  ke website dalam tiga bulan pertama:
</p>

<ul>
  <li>Penghematan biaya admin + iklan per bulan: <strong>~Rp 800.000</strong></li>
  <li>Biaya template website sekali bayar: <strong>~Rp 4.000.000</strong></li>
  <li>Estimasi break even: <strong>5 bulan</strong></li>
</ul>

<p>
  Setelah break even, penghematan itu masuk ke kantong Anda selamanya. Tidak ada
  biaya berulang yang signifikan, tidak ada aturan platform yang mengancam margin,
  dan data pelanggan adalah aset bisnis yang terus berkembang milik Anda.
</p>

<p>
  Siap mulai? Lihat koleksi <a href="/templates">template website toko online dari Calius Digital</a>
  — didesain khusus untuk UMKM yang ingin membangun saluran penjualan mandiri yang
  cepat, profesional, dan bebas potongan marketplace.
</p>
"""

A3_CONTENT = """
<p class="lead">
  Pukul 22.30 malam. Seorang calon penyewa butuh mobil untuk perjalanan penting besok pagi.
  Dia buka Google, mencari "rental mobil [kota Anda]" — dan menemukan beberapa hasil.
  Satu website terlihat profesional, ada galeri armada lengkap dan tombol booking yang
  jelas. Yang lainnya hanya Instagram. Dia langsung isi form di website yang profesional.
  Booking terkonfirmasi malam itu juga.
</p>

<p>
  Pertanyaannya: apakah website itu milik Anda, atau milik kompetitor?
</p>

<h2>Mengapa Bisnis Rental Mobil Kehilangan Puluhan Booking Setiap Bulan</h2>

<p>
  Sebagian besar bisnis rental mobil skala kecil–menengah masih mengandalkan cara-cara
  yang membatasi jangkauan mereka secara drastis:
</p>

<ul>
  <li>DM Instagram yang hanya aktif saat pemilik online</li>
  <li>Nomor WhatsApp yang disebarkan di grup Facebook tanpa sistem yang jelas</li>
  <li>Referral mulut ke mulut yang tidak bisa di-scale</li>
  <li>Listing di platform OTA yang memotong 15–20% per setiap booking</li>
</ul>

<p>
  Masalah fundamentalnya sederhana: <strong>Anda tidak bisa diakses saat calon penyewa
  paling butuh.</strong> Orang memesan rental mobil malam hari, akhir pekan, dan saat
  merencanakan perjalanan mendadak. Saat tim Anda istirahat, peluang itu langsung pindah
  ke bisnis lain yang punya sistem aktif 24 jam.
</p>

<h2>7 Fitur Wajib di Template Website Rental Mobil Profesional</h2>

<h3>1. Galeri Armada yang Bisa Difilter</h3>

<p>
  Tampilkan setiap unit dengan foto dari berbagai sudut — eksterior, interior, dan bagasi.
  Lengkapi dengan spesifikasi (kapasitas penumpang, transmisi, fasilitas AC), dan biarkan
  calon penyewa filter berdasarkan tipe atau rentang harga. Ini mengurangi pertanyaan
  berulang di WhatsApp secara drastis.
</p>

<h3>2. Tombol Booking WhatsApp dengan Pesan Otomatis</h3>

<p>
  Setiap halaman unit punya tombol "Pesan Sekarang" yang membuka WhatsApp dengan pesan
  yang sudah terformat: <em>"Halo, saya tertarik menyewa [nama unit]. Tanggal: ___. Durasi: ___ hari."</em>
  Calon penyewa tinggal melengkapi detail dan mengirim — tidak perlu mengetik manual dari nol.
</p>

<h3>3. Halaman Syarat &amp; Ketentuan Sewa yang Transparan</h3>

<p>
  Dokumen yang dibutuhkan, jumlah deposit, cakupan asuransi, area yang diizinkan — semua
  tertulis jelas sebelum calon penyewa menghubungi. Transparansi ini membangun kepercayaan
  dan memangkas pertanyaan repetitif yang menghabiskan waktu.
</p>

<h3>4. Testimoni Pelanggan yang Nyata</h3>

<p>
  Screenshot ulasan Google atau pesan WhatsApp dari penyewa yang puas. Di bisnis jasa
  transportasi, bukti sosial adalah faktor kepercayaan nomor satu yang mendorong keputusan
  booking dari calon penyewa yang belum pernah menggunakan jasa Anda sebelumnya.
</p>

<h3>5. Informasi Kontak dan Area Layanan yang Jelas</h3>

<p>
  Peta area operasional, jam layanan, nomor WhatsApp yang aktif, dan alamat pool kendaraan.
  Calon penyewa dari luar kota sangat membutuhkan informasi ini sebelum memutuskan
  untuk memesan.
</p>

<h3>6. Halaman "Cara Pemesanan" Step-by-Step</h3>

<p>
  Proses yang sederhana dan jelas: pilih unit → hubungi WhatsApp → konfirmasi ketersediaan
  → bayar DP → unit diantar/diambil. Calon penyewa baru yang belum pernah menyewa
  sebelumnya akan jauh lebih percaya diri untuk melanjutkan.
</p>

<h3>7. FAQ yang Menjawab Keberatan Umum</h3>

<p>
  Lima sampai sepuluh pertanyaan paling sering diajukan, dijawab secara langsung di website.
  Calon penyewa yang pertanyaannya sudah terjawab jauh lebih cepat mengambil keputusan
  dibanding yang harus menunggu balasan chat.
</p>

<h2>Perbandingan: Website Mandiri vs Platform OTA Rental</h2>

<p>
  Platform aggregator rental memang mendatangkan booking, tapi dengan biaya yang tidak
  sedikit dan kontrol yang sangat terbatas:
</p>

<ul>
  <li>Komisi platform: 15–20% per setiap booking yang masuk</li>
  <li>Harga sering dikontrol atau ditekan oleh platform untuk bersaing</li>
  <li>Data penyewa dimiliki platform — bukan bisnis Anda</li>
  <li>Aturan bisa berubah kapan saja tanpa persetujuan Anda</li>
</ul>

<p>
  Dengan website sendiri: <strong>tidak ada komisi, tidak ada aturan platform.</strong>
  Booking ke-1 sampai ke-1000 — semuanya 100% masuk ke rekening Anda langsung.
</p>

<h2>Kalkulasi Return on Investment yang Nyata</h2>

<p>
  Jika omzet booking bulanan Anda Rp 15 juta dan selama ini listing di OTA dengan komisi 15%:
</p>

<ul>
  <li>Komisi yang Anda bayar ke platform: <strong>Rp 2.250.000/bulan</strong></li>
  <li>Biaya template website rental sekali bayar: <strong>~Rp 3.500.000</strong></li>
  <li>Break even: <strong>kurang dari 2 bulan</strong></li>
</ul>

<p>
  Setelah itu, lebih dari Rp 2 juta per bulan yang tadinya jadi komisi platform akan
  masuk ke kantong Anda — selamanya.
</p>

<p>
  Calius Digital menyediakan <a href="/templates">template website khusus untuk bisnis rental
  dan jasa</a>, sudah dilengkapi integrasi WhatsApp otomatis, galeri armada dengan filter,
  halaman syarat sewa, dan form pemesanan. Setup cepat, tanpa coding, tanpa keahlian teknis.
  Mulai terima booking 24 jam tanpa komisi.
</p>
"""

A4_CONTENT = """
<p class="lead">
  Anda sudah membangun reputasi travel umroh selama bertahun-tahun. Tapi setiap kali
  calon jamaah membuka website Anda, mereka pergi tanpa menghubungi. Bukan karena harga
  Anda tidak kompetitif. Bukan karena jamaah tidak serius. Tapi karena landing page Anda
  gagal membangun kepercayaan dalam 10 detik pertama — dan di industri umroh,
  kepercayaan adalah satu-satunya mata uang yang berlaku.
</p>

<h2>Mengapa Landing Page Travel Umroh Berbeda dari Bisnis Lain</h2>

<p>
  Calon jamaah tidak memutuskan berangkat umroh dalam hitungan menit. Mereka riset berhari-hari,
  membandingkan banyak travel, berbicara dengan keluarga, dan — yang paling krusial —
  mencari tanda-tanda bahwa bisnis Anda <em>dapat dipercaya sepenuhnya</em>.
</p>

<p>
  Kerugian dari penipuan travel umroh sangat besar: uang hilang, impian berangkat ke
  Tanah Suci hancur. Itulah mengapa setiap elemen di landing page Anda harus berbicara
  satu hal: <strong>Anda aman, terdaftar resmi, dan terbukti berhasil memberangkatkan jamaah.</strong>
</p>

<h2>8 Elemen Wajib Landing Page Travel Umroh yang Menghasilkan Leads</h2>

<h3>1. Headline yang Langsung Menjawab Ketakutan Terbesar</h3>

<p>
  Ketakutan terbesar calon jamaah: penipuan dan uang yang tidak kembali. Headline yang
  efektif bukan sekadar "Travel Umroh Terpercaya" — tapi lebih spesifik dan terukur:
  <em>"Terdaftar Resmi Kemenag RI, 500+ Jamaah Telah Diberangkatkan, Jaminan Kepastian
  Keberangkatan atau Uang Kembali 100%."</em>
</p>

<h3>2. Nomor Izin PPIU Kemenag yang Mencolok dan Mudah Diverifikasi</h3>

<p>
  Nomor izin Penyelenggara Perjalanan Ibadah Umrah (PPIU) dari Kemenag harus ditampilkan
  di posisi paling terlihat — bukan tersembunyi di footer. Tambahkan link verifikasi
  langsung ke website resmi Kemenag. Ini adalah sinyal kepercayaan nomor satu yang
  pertama kali dicari oleh calon jamaah yang hati-hati.
</p>

<h3>3. Paket dengan Harga dan Fasilitas yang Transparan</h3>

<p>
  Tampilkan beberapa paket dengan harga jelas, apa yang sudah termasuk, dan apa yang
  tidak termasuk. Calon jamaah yang menemukan "hubungi kami untuk harga" akan langsung
  meninggalkan halaman dan mencari travel lain yang lebih terbuka. Transparansi harga
  adalah bentuk respek terhadap calon jamaah.
</p>

<h3>4. Foto dan Video Jamaah Asli yang Sudah Berangkat</h3>

<p>
  Foto jamaah dengan seragam travel Anda di depan Ka'bah jauh lebih meyakinkan
  dibanding 100 kata deskripsi sekalipun. Video testimoni singkat 30–60 detik dari jamaah
  yang sudah kembali adalah aset konversi terkuat — dan paling sulit dipalsukan oleh
  calon penipu.
</p>

<h3>5. Jadwal Keberangkatan dengan Sisa Kursi</h3>

<p>
  Tampilkan jadwal keberangkatan berikutnya dengan jumlah kursi yang tersisa secara
  real-time atau diupdate rutin. <em>"Keberangkatan 15 Agustus — Sisa 8 kursi"</em>
  menciptakan urgensi nyata yang mendorong calon jamaah untuk segera menghubungi
  sebelum terlambat.
</p>

<h3>6. Detail Hotel, Jarak ke Masjidil Haram, dan Nama Maskapai</h3>

<p>
  Jangan hanya tulis "Hotel bintang 4 dekat Masjidil Haram". Tampilkan nama hotel,
  foto kamar, jarak ke Masjidil Haram dalam satuan meter atau menit jalan kaki, dan
  nama maskapai yang digunakan. Detail yang terukur seperti ini membangun kredibilitas
  secara visual dan menunjukkan bahwa Anda punya pengalaman nyata.
</p>

<h3>7. CTA yang Sederhana dan Tidak Menakutkan</h3>

<p>
  Formulir pendaftaran yang panjang menciptakan hambatan psikologis. Cukup minta nama
  dan nomor HP untuk konsultasi awal. Atau yang lebih efektif: tombol
  <em>"Konsultasi Gratis via WhatsApp"</em> yang langsung membuka percakapan personal.
  Kontak pertama yang tidak mengintimidasi jauh lebih efektif menghasilkan leads.
</p>

<h3>8. Garansi Berani yang Tertulis Eksplisit</h3>

<p>
  Contoh yang kuat: <em>"Jika keberangkatan dibatalkan dari pihak kami karena alasan
  apapun, uang kembali 100% dalam 7 hari kerja tanpa syarat."</em> Jaminan eksplisit
  seperti ini jauh lebih persuasif dibanding klaim "terpercaya" yang tanpa bukti
  dan tanpa komitmen nyata.
</p>

<h2>Kesalahan Paling Umum di Landing Page Travel Umroh</h2>

<p>
  Berdasarkan audit landing page travel umroh yang umum ditemukan, ini adalah
  kesalahan yang paling sering menggagalkan konversi:
</p>

<ul>
  <li>
    <strong>Desain terlalu penuh dan ramai</strong> — Terlalu banyak elemen membuat
    calon jamaah kebingungan harus fokus ke mana
  </li>
  <li>
    <strong>Loading lambat di mobile</strong> — Mayoritas calon jamaah membuka website
    dari smartphone. Halaman yang butuh lebih dari 3 detik untuk dimuat akan langsung
    ditinggalkan
  </li>
  <li>
    <strong>Tidak ada bukti legitimasi yang mudah diverifikasi</strong> — Tanpa nomor
    izin Kemenag yang bisa dicek, kepercayaan tidak akan terbangun
  </li>
  <li>
    <strong>CTA yang tidak jelas atau terlalu banyak</strong> — Satu halaman, satu
    tujuan, satu CTA yang dominan
  </li>
</ul>

<h2>Template Landing Page Travel Umroh dari Calius Digital</h2>

<p>
  Calius Digital menyediakan <a href="/templates">template website khusus untuk bisnis
  travel dan umroh</a> — sudah mencakup semua elemen di atas: galeri paket dengan harga
  transparan, jadwal keberangkatan, section testimoni video, form konsultasi ringan,
  dan integrasi WhatsApp yang mudah dikonfigurasi.
</p>

<p>
  Fast loading, mobile-first, dan dioptimasi untuk menghasilkan leads berkualitas —
  bukan sekadar traffic. Lihat detail template di halaman template kami dan mulai
  ubah website menjadi mesin penghasil calon jamaah.
</p>
"""

A5_CONTENT = """
<p class="lead">
  Anda sudah pasang foto produk berkualitas tinggi. Deskripsi lengkap dan menarik.
  Harga kompetitif. Tapi penjualan tetap stagnan. Calon pembeli datang, tapi pergi
  sebelum sempat checkout. Salah satu penyebab yang paling sering diabaikan oleh
  pemilik toko online: <strong>website Anda terlalu lambat</strong> — dan akibatnya
  jauh lebih serius dari yang Anda kira.
</p>

<h2>Data yang Harus Membuat Anda Berhenti dan Berpikir Ulang</h2>

<p>
  Ini bukan asumsi atau perkiraan. Ada data riset konkret di balik setiap angka berikut:
</p>

<ul>
  <li>
    <strong>53%</strong> pengguna mobile meninggalkan halaman yang butuh lebih dari
    <strong>3 detik</strong> untuk dimuat — bahkan sebelum melihat produk Anda
  </li>
  <li>
    Setiap <strong>1 detik</strong> keterlambatan loading menurunkan konversi rata-rata
    <strong>7%</strong>
  </li>
  <li>
    Website yang loading dalam <strong>1 detik</strong> memiliki tingkat konversi
    <strong>3x lebih tinggi</strong> dibanding website yang loading 5 detik
  </li>
  <li>
    <strong>79%</strong> pembeli online yang tidak puas dengan performa website
    tidak akan pernah kembali
  </li>
</ul>

<p>
  Dengan kata lain: website yang lambat adalah mesin pengusir pembeli yang bekerja
  24 jam tanpa henti — sementara Anda terus membuang uang untuk iklan yang membawa
  orang ke halaman yang mereka langsung tinggalkan.
</p>

<h2>7 Kerugian Nyata Akibat Website Toko Online yang Lambat</h2>

<h3>1. Calon Pembeli Pergi Sebelum Halaman Selesai Dimuat</h3>

<p>
  Bounce rate website yang lambat bisa mencapai 70–80%. Artinya: dari 100 orang yang
  mengklik iklan Anda, 75 orang pergi sebelum sempat melihat satu pun produk Anda.
  Uang iklan hangus, peluang hilang, tanpa Anda sadari mengapa.
</p>

<h3>2. Biaya Iklan Membengkak Tanpa Hasil yang Sepadan</h3>

<p>
  Jika Anda memasang iklan Google atau Meta yang mengarah ke website lambat, Anda
  membayar untuk setiap klik — termasuk dari orang yang langsung menutup halaman
  karena frustasi menunggu. Return on Ad Spend (ROAS) iklan Anda anjlok drastis
  hanya karena masalah teknis yang sebenarnya bisa diatasi.
</p>

<h3>3. Peringkat Google Turun Secara Sistematis</h3>

<p>
  Sejak Google resmi menggunakan Core Web Vitals sebagai faktor ranking, website lambat
  mendapat penalti di hasil pencarian organik. Ini berarti kompetitor yang website-nya
  lebih cepat — meski produknya tidak selalu lebih baik — akan terus muncul di atas Anda.
  Traffic organik gratis yang seharusnya jadi milik Anda justru mengalir ke mereka.
</p>

<h3>4. Kepercayaan Pembeli Runtuh di Kesan Pertama</h3>

<p>
  Website yang lambat secara psikologis menciptakan persepsi: toko ini tidak profesional,
  atau mungkin tidak serius. Di e-commerce, kepercayaan adalah fondasi transaksi.
  Jika kesan pertama sudah buruk, sangat sulit untuk recovery — bahkan dengan produk
  terbaik sekalipun.
</p>

<h3>5. Tingkat Pengabaian Keranjang Belanja Meningkat</h3>

<p>
  Bahkan pembeli yang sudah memasukkan produk ke keranjang belanja pun bisa pergi
  jika halaman checkout loading lambat. Setiap detik tambahan di proses pembayaran
  adalah kesempatan bagi pembeli untuk berubah pikiran dan menutup tab.
</p>

<h3>6. Pengalaman Mobile yang Menyiksa Mayoritas Pembeli Anda</h3>

<p>
  Lebih dari 70% pembeli online Indonesia menggunakan smartphone sebagai perangkat utama
  mereka. Website yang lambat di mobile bukan hanya mengganggu — ini membuat pembeli
  frustrasi dan langsung pindah ke toko online lain yang lebih responsif dan cepat.
</p>

<h3>7. Kompetitor Menang Hanya Karena Website yang Lebih Cepat</h3>

<p>
  Ketika dua toko menjual produk yang hampir identik dengan harga yang serupa, pembeli
  akan memilih yang website-nya lebih cepat dan lebih nyaman digunakan. Kecepatan
  website adalah competitive advantage yang nyata — dan sering kali lebih mudah
  dicapai dibanding unggul di kualitas produk atau harga.
</p>

<h2>Penyebab Paling Umum Website Toko Online Menjadi Lambat</h2>

<ul>
  <li>
    <strong>Gambar produk tidak dikompres</strong> — Upload foto 5–10 MB langsung
    tanpa resize atau kompres adalah penyebab paling umum dan paling mudah diatasi
  </li>
  <li>
    <strong>Hosting murah dengan server yang overloaded</strong> — Shared hosting
    Rp 50.000/bulan sering menjadi bottleneck utama yang membatasi seluruh performa
    website Anda
  </li>
  <li>
    <strong>Template yang terlalu berat dengan fitur tidak perlu</strong> — Animasi
    berlebihan, slider gambar yang besar, dan plugin yang tidak dioptimasi memperlambat
    rendering halaman secara signifikan
  </li>
  <li>
    <strong>Tidak menggunakan CDN (Content Delivery Network)</strong> — Tanpa CDN,
    setiap gambar dan aset harus diambil dari satu server pusat setiap kali halaman dimuat
  </li>
</ul>

<h2>Standar Performa yang Harus Dicapai Website Toko Online Anda</h2>

<p>
  Target performa yang realistis dan terukur untuk toko online yang sehat:
</p>

<ul>
  <li>First Contentful Paint (FCP): <strong>di bawah 1,8 detik</strong></li>
  <li>Largest Contentful Paint (LCP): <strong>di bawah 2,5 detik</strong></li>
  <li>Time to Interactive (TTI): <strong>di bawah 3,8 detik</strong></li>
  <li>Skor Google PageSpeed Insights mobile: <strong>di atas 70</strong></li>
</ul>

<p>
  Cek kecepatan website Anda sekarang di <strong>pagespeed.web.dev</strong> — gratis,
  langsung terlihat skor dan rekomendasinya, tanpa perlu keahlian teknis apapun.
</p>

<h2>Solusi: Template Website yang Dibangun untuk Kecepatan dari Awal</h2>

<p>
  Template <a href="/templates">website toko online dari Calius Digital</a> dibangun
  dengan fokus pada performa sejak baris kode pertama: gambar dikompres otomatis,
  kode bersih tanpa fitur bloat yang tidak perlu, dan hosting pada infrastruktur
  yang dioptimasi untuk kecepatan.
</p>

<p>
  Hasilnya adalah website yang tidak hanya tampak profesional dan meyakinkan —
  tapi juga cukup cepat agar setiap rupiah yang Anda keluarkan untuk iklan
  tidak terbuang sia-sia karena calon pembeli keburu pergi. Lihat koleksi template
  kami dan mulai jalankan toko online yang benar-benar bekerja untuk Anda.
</p>
"""

# ---------------------------------------------------------------------------
# Data update — key = slug
# ---------------------------------------------------------------------------

UPDATES = {
    "biaya-admin-marketplace-mahal-hitung-kerugian": {
        "title_id": "Biaya Admin Marketplace Menguras Margin? Hitung Kerugian Nyata Anda Setiap Bulan",
        "seo_title": "Biaya Admin Marketplace Naik? Hitung Kerugian Nyata Setiap Bulan",
        "excerpt_id": "Setiap kali kebijakan biaya marketplace berubah, jutaan seller UMKM merasakan dampaknya langsung ke rekening. Sebelum terus menerima begitu saja, hitung dulu kerugian nyata yang sudah Anda tanggung selama ini — angkanya mungkin mengejutkan.",
        "content_id": A1_CONTENT.strip(),
    },
    "cara-jualan-online-tanpa-potongan-marketplace": {
        "title_id": "Cara Jualan Online Tanpa Potongan Marketplace: Panduan Lengkap Seller UMKM 2026",
        "seo_title": "Cara Jualan Online Tanpa Potongan Marketplace — Panduan UMKM 2026",
        "excerpt_id": "Bosan 15–20% omzet menguap setiap bulan ke platform yang tidak Anda miliki? Inilah panduan step-by-step membangun jalur penjualan online mandiri yang bebas dari biaya admin dan aturan sepihak marketplace.",
        "content_id": A2_CONTENT.strip(),
    },
    "template-website-rental-mobil-terintegrasi-whatsapp": {
        "title_id": "Template Website Rental Mobil Terintegrasi WhatsApp: Terima Booking 24 Jam Tanpa Komisi",
        "seo_title": "Template Website Rental Mobil + Booking WhatsApp Otomatis 24 Jam",
        "excerpt_id": "Bisnis rental mobil yang masih andalkan DM Instagram kehilangan puluhan booking setiap bulan — dan membayar komisi besar ke OTA. Inilah cara punya website rental profesional dengan booking WhatsApp otomatis yang aktif 24 jam.",
        "content_id": A3_CONTENT.strip(),
    },
    "contoh-landing-page-travel-umroh-konversi-tinggi": {
        "title_id": "Landing Page Travel Umroh yang Menghasilkan Leads: 8 Elemen Wajib & Panduan 2026",
        "seo_title": "Contoh Landing Page Travel Umroh Konversi Tinggi — 8 Elemen Wajib",
        "excerpt_id": "Landing page travel umroh yang buruk membuat ratusan calon jamaah memilih kompetitor sebelum sempat menghubungi Anda. Inilah 8 elemen kritis yang harus ada — beserta panduan implementasi yang terbukti menghasilkan leads berkualitas.",
        "content_id": A4_CONTENT.strip(),
    },
    "website-toko-online-lemot-kerugian-omzet": {
        "title_id": "Website Toko Online Lambat? 7 Kerugian Nyata yang Diam-diam Menguras Omzet Anda",
        "seo_title": "Website Toko Online Lambat? 7 Kerugian Nyata yang Menguras Omzet",
        "excerpt_id": "Setiap detik tambahan loading time website toko online Anda sama artinya dengan kehilangan calon pembeli. Bukan teori — ada datanya. Dan ada solusi konkretnya yang bisa Anda mulai hari ini.",
        "content_id": A5_CONTENT.strip(),
    },
}

# ---------------------------------------------------------------------------
# Eksekusi update
# ---------------------------------------------------------------------------

success = 0
for slug, patch in UPDATES.items():
    post_id = id_map.get(slug)
    if not post_id:
        print(f"  [SKIP] {slug} — tidak ditemukan di database")
        continue

    # Ambil data post lengkap dulu
    r = requests.get(f"{BASE_URL}/api/blog/{slug}", timeout=20)
    if r.status_code != 200:
        print(f"  [SKIP] {slug} — GET gagal ({r.status_code})")
        continue

    post = r.json()
    # Merge patch ke data post yang ada
    post.update(patch)
    # Hapus field yang tidak ada di BlogCreate model
    for key in ["_id", "id", "published_at", "created_at", "updated_at"]:
        post.pop(key, None)

    r2 = requests.put(
        f"{BASE_URL}/api/admin/blog/{post_id}",
        json=post,
        headers=HEADERS,
        timeout=30,
    )
    if r2.status_code == 200:
        print(f"  [OK] {slug}")
        success += 1
    else:
        try:
            detail = r2.json().get("detail", r2.text[:200])
        except Exception:
            detail = r2.text[:200]
        print(f"  [FAIL {r2.status_code}] {slug} — {detail}")

print(f"\nDone: {success}/{len(UPDATES)} artikel berhasil diupdate.")
