"""
Seed script: insert 5 KGR-optimized blog posts into calius.digital via Admin API.

Usage (auto-login — RECOMMENDED):
  Masukkan username + password admin langsung di terminal ini:
    $env:CALIUS_USER = "username_admin"
    $env:CALIUS_PASS = "password_anda"
    python seed_blog.py

Usage (manual token):
    $env:CALIUS_TOKEN = "token_dari_browser_localStorage"
    python seed_blog.py

Optional: override base URL (default: https://calius.digital)
    $env:CALIUS_URL = "https://preview-url.vercel.app"
"""

import os
import sys
import requests

BASE_URL = os.environ.get("CALIUS_URL", "https://www.calius.digital").rstrip("/")

# --- Auto-login jika CALIUS_EMAIL + CALIUS_PASS tersedia ---
TOKEN = os.environ.get("CALIUS_TOKEN", "")
if not TOKEN:
    username = os.environ.get("CALIUS_USER", "")
    password = os.environ.get("CALIUS_PASS", "")
    if not username or not password:
        print("ERROR: Berikan kredensial login.")
        print("  $env:CALIUS_USER = 'username_admin'")
        print("  $env:CALIUS_PASS  = 'password_admin'")
        print("  python seed_blog.py")
        sys.exit(1)
    print(f"Logging in as {username} ...")
    try:
        r = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": username, "password": password},
            timeout=20,
        )
        r.raise_for_status()
        TOKEN = r.json().get("access_token", "")
        if not TOKEN:
            print("ERROR: Login berhasil tapi token tidak ditemukan dalam response.")
            sys.exit(1)
        print("Login OK.\n")
    except requests.exceptions.HTTPError as exc:
        print(f"ERROR: Login gagal ({exc.response.status_code}) — periksa email/password.")
        sys.exit(1)
    except requests.exceptions.RequestException as exc:
        print(f"ERROR: Tidak bisa menghubungi {BASE_URL} — {exc}")
        sys.exit(1)

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}

# ---------------------------------------------------------------------------
# Article content (HTML format - rendered by TipTap)
# ---------------------------------------------------------------------------

ARTICLE_1_CONTENT = """
<p>Maret 2024. Shopee mengumumkan kenaikan biaya layanan untuk kategori tertentu. Beberapa bulan kemudian, Tokopedia dan TikTok Shop bergabung dan mulai menyesuaikan struktur biaya. Tahun 2025, kebijakan berubah lagi.</p>
<p><strong>Pertanyaannya: sudah berapa juta yang habis dari kantong Anda tanpa Anda sadari?</strong></p>
<p>Banyak seller yang sudah terbiasa "menerima saja" setiap ada pengumuman kenaikan biaya. Tapi coba luangkan 5 menit untuk menghitung dengan jujur — Anda akan terkejut.</p>

<h2>5 Lapisan Potongan yang Diam-diam Menguras Margin Anda</h2>
<p>Sebagian besar seller hanya memperhatikan persentase biaya admin yang tertulis di dashboard. Padahal ada berlapis-lapis potongan yang bekerja bersamaan:</p>
<ul>
  <li><strong>Biaya layanan (admin fee)</strong>: 2%–5% dari harga jual, tergantung kategori dan tier toko</li>
  <li><strong>Biaya iklan (SPonsor/TopAds)</strong>: Tanpa iklan, produk tertekan algoritma. Rata-rata seller menghabiskan 5%–15% omzet untuk ini</li>
  <li><strong>Subsidi gratis ongkir</strong>: Marketplace mensyaratkan ikut program gratis ongkir. Anda menanggung sebagian ongkirnya</li>
  <li><strong>Flash sale &amp; diskon wajib</strong>: Ikut Harbolnas atau campaign marketplace = diskon 10%–50% yang dipaksa</li>
  <li><strong>Biaya retur barang</strong>: Ongkir retur sering menjadi beban seller</li>
</ul>

<h2>Simulasi Nyata: Toko Baju UMKM dengan Omzet Rp 20 Juta/Bulan</h2>
<p>Mari hitung dengan angka yang realistis:</p>
<ul>
  <li>Omzet kotor: <strong>Rp 20.000.000</strong></li>
  <li>Biaya admin 4%: <strong>&minus; Rp 800.000</strong></li>
  <li>Iklan SPonsor (8% dari omzet): <strong>&minus; Rp 1.600.000</strong></li>
  <li>Subsidi gratis ongkir (estimasi): <strong>&minus; Rp 600.000</strong></li>
  <li>Potongan flash sale/campaign (estimasi): <strong>&minus; Rp 400.000</strong></li>
</ul>
<p><strong>Total yang dipotong platform: Rp 3.400.000 per bulan — 17% dari omzet kotor Anda.</strong></p>
<p>Jika margin produk Anda 30%, berarti lebih dari separuh profit habis untuk membayar platform yang bukan milik Anda.</p>

<h2>Masalahnya Bukan Cuma Angka — Tapi Ketidakpastian</h2>
<p>Yang lebih menyakitkan dari biaya tinggi adalah <em>ketidakpastian</em>. Anda tidak bisa merencanakan bisnis jangka panjang ketika aturan bisa berubah kapan saja.</p>
<p>Bayangkan: Anda sudah menetapkan harga jual dengan asumsi biaya admin 3%. Besok platform mengumumkan naik ke 5%. Anda harus pilih: naikkan harga (risiko kehilangan pembeli) atau telan sendiri kerugiannya (margin makin tipis).</p>
<p>Ini bukan bisnis yang Anda kendalikan. Ini bisnis yang Anda <em>titipkan</em> ke platform lain.</p>

<h2>Solusi Konkret: Bangun Aset Digital Sendiri</h2>
<p>Seller cerdas tidak meninggalkan marketplace sepenuhnya — tapi mereka membangun <strong>website toko online sendiri</strong> sebagai aset utama, dan menggunakan marketplace hanya sebagai saluran tambahan.</p>
<p>Dengan website sendiri:</p>
<ul>
  <li>Biaya admin: <strong>Rp 0 selamanya</strong> (hanya bayar hosting/domain tahunan ~Rp 200-500 ribu)</li>
  <li>Tidak ada kewajiban ikut campaign diskon paksa</li>
  <li>Data pelanggan Anda adalah aset Anda, bukan aset platform</li>
  <li>Bisa pasang iklan Google &amp; Meta langsung ke website tanpa perantara</li>
  <li>Riwayat pembelian pelanggan tersimpan untuk remarketing</li>
</ul>
<p>Biaya investasi website profesional satu kali bayar jauh lebih kecil dibanding 6–12 bulan biaya admin marketplace yang terus naik. Template toko online Calius Digital sudah dioptimasi untuk konversi dan kecepatan — cocok untuk seller UMKM yang ingin membangun jalur penjualan mandiri.</p>

<h2>Langkah Pertama yang Bisa Anda Mulai Hari Ini</h2>
<ol>
  <li>Hitung total potongan marketplace Anda bulan ini menggunakan simulasi di atas</li>
  <li>Bandingkan dengan biaya investasi website satu kali bayar</li>
  <li>Mulai dengan website landing page sederhana — halaman produk + form pemesanan via WhatsApp</li>
  <li>Secara bertahap arahkan pelanggan loyal dari marketplace ke jalur pembelian langsung</li>
</ol>
<p>Tidak perlu langsung menutup toko di marketplace. Tapi mulailah membangun <strong>jalur alternatif yang tidak bisa dipotong siapapun</strong>.</p>
"""

ARTICLE_2_CONTENT = """
<p>Setiap kali ada pesanan masuk di marketplace, ada kebahagiaan sesaat. Tapi begitu melihat detail pembayaran yang masuk ke rekening, kebahagiaan itu langsung terpotong biaya admin, subsidi ongkir, dan potongan kampanye.</p>
<p>Artikel ini bukan tentang memusuhi marketplace. Tapi tentang <strong>membangun jalan mandiri</strong> agar Anda tidak 100% bergantung pada platform yang bisa mengubah aturan kapan saja.</p>

<h2>Kenapa Seller UMKM Perlu Website Sendiri?</h2>

<h3>1. Kepemilikan Data Pelanggan</h3>
<p>Di marketplace, data pembeli — nama, nomor HP, alamat, riwayat pembelian — dimiliki platform, bukan Anda. Jika besok Anda diblokir atau platform tutup, semua data itu hilang. Di website sendiri, semua data pelanggan adalah aset bisnis Anda selamanya.</p>

<h3>2. Kontrol Harga Penuh</h3>
<p>Marketplace sering memaksa seller ikut flash sale atau diskon tertentu untuk meningkatkan visibilitas. Dengan website sendiri, Anda yang menentukan kapan dan berapa besar diskon — tidak ada paksaan dari siapapun.</p>

<h3>3. Margin Bersih Lebih Tinggi</h3>
<p>Bahkan jika Anda menjual sedikit lebih murah di website sendiri untuk menarik pembeli, Anda masih bisa lebih untung dibanding menjual di marketplace — karena tidak ada biaya admin, iklan wajib, dan potongan kampanye.</p>

<h2>3 Model Jualan Online Tanpa Marketplace yang Terbukti</h2>

<h3>Model A: Website + WhatsApp (Paling Populer untuk UMKM)</h3>
<p>Cara kerjanya:</p>
<ul>
  <li>Pembeli browsing produk di website Anda</li>
  <li>Klik tombol "Beli via WhatsApp" atau isi form pemesanan</li>
  <li>Transaksi via transfer bank / QRIS</li>
  <li>Pengiriman via jasa ekspedisi langsung</li>
</ul>
<p><strong>Cocok untuk:</strong> Fashion, kuliner, kerajinan, produk niche</p>

<h3>Model B: Website dengan Payment Gateway Terintegrasi</h3>
<p>Lebih profesional dan otomatis. Pembeli bisa langsung bayar via GoPay, OVO, QRIS, atau kartu kredit — semua terekam otomatis. Biaya payment gateway umumnya 0,5%–2% per transaksi, jauh lebih murah dari biaya admin marketplace.</p>
<p><strong>Cocok untuk:</strong> Toko dengan volume transaksi tinggi yang ingin scale</p>

<h3>Model C: Landing Page + Iklan Google/Meta Langsung</h3>
<p>Arahkan iklan langsung ke landing page produk Anda, bukan ke marketplace. Return on Ad Spend (ROAS) website sendiri umumnya 3–5x lebih baik dibanding iklan di dalam marketplace — karena tidak ada "distraksi" ke produk kompetitor.</p>
<p><strong>Cocok untuk:</strong> Produk bernilai tinggi atau produk dengan target audiens yang spesifik</p>

<h2>5 Langkah Membangun Jalur Penjualan Mandiri</h2>

<h3>Step 1: Siapkan atau Beli Template Website</h3>
<p>Buat dari nol butuh waktu berbulan-bulan dan biaya puluhan juta. Gunakan template website siap pakai yang sudah mencakup halaman produk, checkout, dan integrasi WhatsApp. Mulai dari Rp 3-4 juta sekali bayar.</p>

<h3>Step 2: Mulai dengan 5–10 Produk Terlaris</h3>
<p>Jangan upload semua produk sekaligus. Fokus pada produk terlaris dengan margin tertinggi yang paling banyak dirugikan oleh biaya marketplace.</p>

<h3>Step 3: Bangun Social Proof</h3>
<p>Ambil screenshot ulasan bintang 5 dari marketplace, minta izin untuk ditampilkan di website. Testimoni adalah aset kepercayaan yang bisa Anda bawa ke mana saja.</p>

<h3>Step 4: Arahkan Pelanggan Lama ke Website</h3>
<p>Kirim pesan personal ke pelanggan setia: "Hai Kak [nama], kami kini punya toko website di [URL]. Khusus pelanggan setia, diskon 10% untuk pembelian pertama via website." Pelanggan yang sudah percaya ke Anda akan dengan senang hati beralih.</p>

<h3>Step 5: Pasang Iklan Kecil di Google atau Meta</h3>
<p>Mulai dengan budget Rp 50.000–100.000 per hari. Target audiens spesifik sesuai profil pembeli ideal Anda. Arahkan langsung ke halaman produk website — bukan ke marketplace.</p>

<h2>Simulasi Break Even Point</h2>
<p>Asumsi omzet marketplace Rp 15 juta/bulan, berhasil memindahkan 30% ke website dalam 3 bulan:</p>
<ul>
  <li>Penghematan biaya admin per bulan: ~Rp 800.000</li>
  <li>Biaya website sekali bayar: ~Rp 4.000.000</li>
  <li><strong>Break even: sekitar 5 bulan</strong></li>
</ul>
<p>Setelah break even, semua penghematan itu masuk ke kantong Anda selamanya — tidak ada biaya berulang yang signifikan.</p>

<h2>Kesimpulan</h2>
<p>Anda tidak perlu langsung keluar dari marketplace. Tapi <strong>tidak memulai sama sekali adalah pilihan paling mahal</strong>. Setiap bulan yang berlalu tanpa website sendiri adalah bulan di mana margin Anda terus diserahkan ke platform lain. Mulai hari ini, meski dengan langkah kecil.</p>
"""

ARTICLE_3_CONTENT = """
<p>Pukul 22.30 malam. Ada calon penyewa yang butuh mobil besok pagi. Dia buka Google, ketik "rental mobil [nama kota]" — menemukan beberapa hasil. Satu website terlihat profesional, ada galeri armada lengkap dan tombol booking langsung. Yang lainnya hanya link Instagram.</p>
<p>Dia isi form di website yang profesional itu. Booking confirm malam itu juga.</p>
<p>Pertanyaannya: apakah website itu punya Anda — atau milik kompetitor?</p>

<h2>Mengapa Bisnis Rental Mobil Kehilangan Booking Tanpa Sadar</h2>
<p>Kebanyakan bisnis rental mobil skala kecil–menengah masih mengandalkan:</p>
<ul>
  <li>DM Instagram dengan foto mobil</li>
  <li>Nomor WhatsApp yang disebarkan di grup Facebook</li>
  <li>Referral mulut ke mulut</li>
  <li>Listing di platform OTA yang memotong 15–20% per booking</li>
</ul>
<p>Masalah utamanya: <strong>Anda tidak bisa diakses saat prospek paling butuh.</strong> Orang booking rental mobil malam hari, akhir pekan, saat merencanakan perjalanan mendadak. Saat tim Anda tidur, prospek itu beralih ke bisnis lain yang sistem pemesanannya aktif 24 jam.</p>

<h2>Yang Dibutuhkan: Website Sederhana tapi Fungsional</h2>
<p>Anda tidak perlu sistem seprestisius Traveloka. Yang dibutuhkan adalah website yang melakukan 3 hal dengan baik:</p>
<ol>
  <li><strong>Menampilkan armada secara visual</strong> — foto berkualitas, spesifikasi lengkap, harga transparan</li>
  <li><strong>Memandu calon penyewa</strong> — persyaratan, area layanan, cara pemesanan</li>
  <li><strong>Menghubungkan ke WhatsApp secara instan</strong> — dengan pesan yang sudah terformat otomatis</li>
</ol>

<h2>7 Fitur Wajib di Template Website Rental Mobil</h2>

<h3>1. Galeri Armada dengan Filter</h3>
<p>Tampilkan semua unit dengan foto dari berbagai sudut. Calon penyewa bisa filter berdasarkan kapasitas penumpang, tipe mobil (MPV, SUV, city car), atau rentang harga. Ini mengurangi pertanyaan berulang di WhatsApp secara signifikan.</p>

<h3>2. Tombol Booking WhatsApp Otomatis</h3>
<p>Setiap halaman unit mobil punya tombol "Pesan Sekarang" yang membuka WhatsApp dengan pesan terformat: "Halo, saya tertarik menyewa [nama unit]. Tanggal: ___. Durasi: ___ hari." Calon penyewa tinggal isi detail dan kirim — tidak perlu ngetik manual.</p>

<h3>3. Halaman Syarat &amp; Ketentuan Sewa</h3>
<p>Dokumen yang dibutuhkan, jumlah deposit, cakupan asuransi, area yang diperbolehkan — semua tertulis jelas. Ini membangun kepercayaan dan memangkas pertanyaan repetitif.</p>

<h3>4. FAQ yang Menjawab Keberatan Umum</h3>
<p>5–10 pertanyaan paling sering diajukan pelanggan. Calon penyewa yang sudah terjawab pertanyaannya di website akan jauh lebih cepat mengambil keputusan.</p>

<h3>5. Testimoni Pelanggan</h3>
<p>Screenshot ulasan Google atau WhatsApp dari penyewa puas. Bukti sosial adalah faktor kepercayaan terbesar untuk bisnis jasa transportasi.</p>

<h3>6. Informasi Kontak &amp; Area Layanan</h3>
<p>Peta area operasional, jam layanan, nomor WhatsApp, dan alamat pool kendaraan. Calon penyewa dari luar kota perlu informasi ini sebelum memutuskan.</p>

<h3>7. Halaman "Cara Pemesanan"</h3>
<p>Step-by-step yang sederhana: pilih unit → hubungi WhatsApp → konfirmasi ketersediaan → bayar DP → unit diantar/diambil. Proses yang jelas mengurangi kecemasan calon penyewa baru.</p>

<h2>Perbandingan: Website Mandiri vs Listing OTA</h2>
<p>Platform aggregator rental mobil memang mendatangkan booking, tapi dengan harga yang mahal:</p>
<ul>
  <li>Komisi platform: 15–20% per booking</li>
  <li>Harga sering dikontrol platform (tidak bisa pasang harga sendiri)</li>
  <li>Data penyewa dimiliki platform, bukan bisnis Anda</li>
</ul>
<p>Dengan website sendiri: <strong>tidak ada komisi</strong>. Booking ke-1 sampai ke-1000 — semuanya 100% masuk ke rekening Anda.</p>

<h2>Kalkulasi Balik Modal</h2>
<p>Jika omzet booking bulanan Anda Rp 15 juta dan selama ini Anda listing di OTA dengan komisi 15%:</p>
<ul>
  <li>Komisi yang Anda bayar: Rp 2.250.000/bulan</li>
  <li>Biaya website sekali bayar: ~Rp 3.500.000</li>
  <li><strong>Break even: kurang dari 2 bulan</strong></li>
</ul>
<p>Setelah itu, Rp 2+ juta per bulan yang tadinya jadi komisi platform masuk ke kantong Anda selamanya.</p>

<h2>Langkah Memulai</h2>
<p>Calius Digital menyediakan template website khusus untuk bisnis rental dan jasa, sudah dilengkapi integrasi WhatsApp otomatis, galeri armada, dan form pemesanan. Proses setup cepat — tanpa perlu coding, tanpa keahlian teknis. Lihat pilihan template kami dan mulai terima booking tanpa komisi.</p>
"""

ARTICLE_4_CONTENT = """
<p>Anda sudah membangun brand travel umroh selama bertahun-tahun. Tapi setiap kali calon jamaah membuka website Anda, mereka pergi begitu saja tanpa menghubungi.</p>
<p>Bukan karena harga Anda mahal. Bukan karena jamaah tidak serius. Tapi karena <strong>landing page Anda gagal membangun kepercayaan dalam 10 detik pertama</strong> — dan di industri travel umroh, kepercayaan adalah satu-satunya mata uang yang berlaku.</p>

<h2>Mengapa Industri Travel Umroh Butuh Landing Page Khusus</h2>
<p>Bisnis travel umroh berbeda dari toko online biasa. Calon jamaah tidak memutuskan berangkat umroh dalam hitungan menit. Mereka riset berhari-hari, membandingkan banyak travel, dan — yang paling penting — mencari tanda-tanda bahwa bisnis Anda <em>dapat dipercaya</em>.</p>
<p>Landing page yang baik harus melakukan satu pekerjaan: <strong>mengubah rasa penasaran menjadi kepercayaan, dan kepercayaan menjadi kontak telepon atau WhatsApp.</strong></p>

<h2>8 Elemen Wajib Landing Page Travel Umroh yang Konvertif</h2>

<h3>1. Headline yang Menjawab Ketakutan Terbesar Calon Jamaah</h3>
<p>Ketakutan terbesar: penipuan, travel tidak berizin, uang hilang. Headline harus langsung menyentuh ini. Bukan hanya "Travel Umroh Terpercaya" — tapi lebih spesifik: "Terdaftar Resmi Kemenag, 500+ Jamaah Diberangkatkan, Jaminan Kepastian Keberangkatan."</p>

<h3>2. Logo &amp; Nomor Izin Kemenag yang Mencolok</h3>
<p>Tampilkan nomor izin Penyelenggara Perjalanan Ibadah Umrah (PPIU) dari Kemenag di posisi paling terlihat — bukan tersembunyi di footer. Ini adalah sinyal kepercayaan nomor satu yang dicari calon jamaah.</p>

<h3>3. Paket dengan Harga Transparan</h3>
<p>Tampilkan beberapa paket dengan harga jelas, apa saja yang termasuk dan tidak termasuk. Calon jamaah yang melihat harga tersembunyi atau "hubungi untuk harga" akan langsung pergi mencari travel lain yang lebih transparan.</p>

<h3>4. Testimoni Video atau Foto Jamaah Berangkat</h3>
<p>Foto jamaah dengan seragam travel Anda di depan Ka'bah jauh lebih meyakinkan dibanding 100 kata deskripsi. Video testimoni singkat 30–60 detik dari jamaah yang sudah berangkat adalah aset konversi terkuat yang bisa Anda miliki.</p>

<h3>5. Jadwal Keberangkatan yang Aktif Diupdate</h3>
<p>Tampilkan jadwal keberangkatan berikutnya dengan jumlah kursi tersisa. "Keberangkatan 15 Agustus — Sisa 8 kursi" menciptakan urgensi yang mendorong calon jamaah untuk segera menghubungi Anda.</p>

<h3>6. Fasilitas Hotel &amp; Maskapai dengan Foto Nyata</h3>
<p>Jangan hanya tulis "Hotel bintang 4 dekat Masjidil Haram". Tampilkan foto hotel, jarak ke Masjidil Haram dalam satuan meter/menit jalan kaki, dan nama maskapai yang digunakan. Detail ini membangun kredibilitas secara visual.</p>

<h3>7. Form Konsultasi Gratis yang Sederhana</h3>
<p>Form pendaftaran yang panjang menakutkan. Cukup: nama, nomor HP, dan pilihan paket yang diminati. Atau lebih baik lagi: tombol "Konsultasi Gratis via WhatsApp" yang langsung membuka percakapan.</p>

<h3>8. Garansi atau Jaminan yang Berani</h3>
<p>Contoh: "Jika keberangkatan dibatalkan dari pihak kami, uang kembali 100% dalam 7 hari kerja." Jaminan eksplisit seperti ini jauh lebih persuasif dibanding klaim "terpercaya" tanpa bukti.</p>

<h2>Studi Kasus: Perbedaan Sebelum dan Sesudah Perbaikan Landing Page</h2>
<p>Perubahan yang paling berdampak pada konversi landing page travel umroh umumnya adalah:</p>
<ul>
  <li>Menambahkan nomor izin Kemenag yang terlihat: konversi naik 30–40%</li>
  <li>Menampilkan harga paket secara transparan: bounce rate turun signifikan</li>
  <li>Menambahkan video testimoni jamaah: waktu di halaman naik rata-rata 2x lipat</li>
  <li>Mengubah form panjang menjadi tombol WhatsApp: inquiry meningkat</li>
</ul>

<h2>Kesalahan Paling Umum di Landing Page Travel Umroh</h2>
<ul>
  <li><strong>Desain terlalu ramai</strong>: Terlalu banyak elemen visual membuat calon jamaah bingung harus fokus ke mana</li>
  <li><strong>Loading lambat</strong>: Calon jamaah yang menunggu lebih dari 3 detik akan pergi sebelum halaman selesai dimuat</li>
  <li><strong>Tidak mobile-friendly</strong>: Mayoritas pencarian dilakukan via smartphone. Jika tampilan di HP berantakan, peluang hilang</li>
  <li><strong>CTA tidak jelas</strong>: "Klik di sini" bukan CTA yang baik. "Konsultasi Gratis Sekarang" jauh lebih efektif</li>
</ul>

<h2>Template Landing Page Travel Umroh dari Calius Digital</h2>
<p>Calius Digital menyediakan template website khusus untuk bisnis travel dan umroh — sudah mencakup semua elemen di atas: galeri paket, jadwal keberangkatan, testimoni, form konsultasi, dan integrasi WhatsApp. Fast loading, mobile-first, dan dioptimasi untuk mendapatkan leads berkualitas. Lihat detail template di halaman template kami.</p>
"""

ARTICLE_5_CONTENT = """
<p>Anda sudah pasang foto produk bagus. Deskripsi lengkap. Harga kompetitif. Tapi penjualan tetap stagnan. Calon pembeli datang, tapi pergi sebelum checkout.</p>
<p>Salah satu penyebab paling sering yang diabaikan: <strong>website Anda terlalu lambat.</strong></p>
<p>Ini bukan asumsi. Ini data. Dan angkanya lebih mengerikan dari yang Anda kira.</p>

<h2>Data yang Tidak Bisa Anda Abaikan</h2>
<p>Berdasarkan riset Google dan berbagai studi e-commerce:</p>
<ul>
  <li>53% pengguna mobile meninggalkan halaman yang membutuhkan lebih dari <strong>3 detik</strong> untuk dimuat</li>
  <li>Setiap 1 detik keterlambatan loading menurunkan konversi rata-rata <strong>7%</strong></li>
  <li>Website yang loading dalam 1 detik memiliki tingkat konversi 3x lebih tinggi dibanding yang loading 5 detik</li>
  <li>79% pembeli online yang tidak puas dengan performa website tidak akan kembali</li>
</ul>
<p>Dengan kata lain: website lambat adalah mesin pengusir pembeli yang bekerja 24 jam tanpa henti.</p>

<h2>7 Kerugian Nyata Akibat Website Toko Online yang Lemot</h2>

<h3>1. Pembeli Pergi Sebelum Halaman Selesai Dimuat</h3>
<p>Bounce rate website lambat bisa mencapai 70–80%. Bayangkan: dari 100 orang yang mengklik iklan Anda, 75 pergi sebelum sempat melihat produk Anda. Uang iklan hangus, pembeli hilang.</p>

<h3>2. Biaya Iklan Membengkak Tanpa Hasil</h3>
<p>Jika Anda pasang iklan Google atau Meta yang mengarah ke website lambat, Anda membayar setiap klik — termasuk klik dari orang yang langsung menutup halaman karena loading terlalu lama. ROI iklan Anda anjlok drastis.</p>

<h3>3. Peringkat Google Turun</h3>
<p>Sejak 2021, Google resmi menggunakan Core Web Vitals sebagai faktor ranking. Website lambat mendapat penalti ranking. Artinya: website Anda muncul lebih rendah di hasil pencarian Google, kalah dengan kompetitor yang website-nya lebih cepat.</p>

<h3>4. Kepercayaan Pembeli Runtuh</h3>
<p>Website lambat menciptakan persepsi: "Toko ini tidak profesional." Di e-commerce, kepercayaan adalah fondasi transaksi. Jika kesan pertama sudah buruk, sangat sulit untuk recovery.</p>

<h3>5. Tingkat Pengabaian Cart Meningkat</h3>
<p>Bahkan pembeli yang sudah memasukkan produk ke keranjang pun bisa pergi jika halaman checkout loading lambat. Setiap momen lambat di proses checkout adalah kesempatan pembeli untuk berubah pikiran.</p>

<h3>6. Mobile Experience yang Menyiksa</h3>
<p>Lebih dari 70% pembeli online Indonesia menggunakan smartphone. Website yang lambat di mobile bukan hanya mengganggu — ini membuat pembeli frustrasi dan pindah ke toko online lain yang lebih responsif.</p>

<h3>7. Kompetitor Lebih Mudah Menang</h3>
<p>Jika dua toko menjual produk yang hampir sama dengan harga serupa, pembeli akan memilih yang website-nya lebih cepat dan nyaman digunakan. Kecepatan website adalah competitive advantage yang sering diremehkan.</p>

<h2>Penyebab Umum Website Toko Online Lemot</h2>
<ul>
  <li><strong>Gambar produk tidak dikompres</strong>: Upload foto 5 MB langsung tanpa resize adalah penyebab utama loading lambat</li>
  <li><strong>Hosting murah dengan server lambat</strong>: Hosting Rp 50rb/bulan sering menjadi bottleneck performa</li>
  <li><strong>Template yang terlalu berat</strong>: Template dengan banyak animasi dan plugin tidak perlu memperlambat loading secara signifikan</li>
  <li><strong>Tidak menggunakan CDN</strong>: Tanpa Content Delivery Network, gambar harus diambil dari server pusat setiap kali halaman dimuat</li>
  <li><strong>Kode yang tidak dioptimasi</strong>: CSS dan JavaScript yang bloat memperlambat rendering halaman</li>
</ul>

<h2>Standar Kecepatan yang Harus Dicapai</h2>
<p>Target performa website toko online yang baik:</p>
<ul>
  <li>First Contentful Paint (FCP): &lt; 1,8 detik</li>
  <li>Largest Contentful Paint (LCP): &lt; 2,5 detik</li>
  <li>Time to Interactive (TTI): &lt; 3,8 detik</li>
  <li>Skor Google PageSpeed Insights mobile: &gt; 70</li>
</ul>
<p>Anda bisa cek kecepatan website Anda sekarang di <strong>pagespeed.web.dev</strong> — gratis dan langsung terlihat hasilnya.</p>

<h2>Solusi: Template Website yang Dibangun untuk Kecepatan</h2>
<p>Template website Calius Digital dibangun dengan fokus pada performa: gambar otomatis dikompres, kode bersih tanpa bloat, dan hosting pada infrastruktur yang dioptimasi. Hasilnya: website yang tidak hanya tampak profesional, tapi juga cepat — sehingga setiap rupiah iklan Anda tidak terbuang sia-sia. Lihat pilihan template toko online kami di halaman template.</p>
"""

# ---------------------------------------------------------------------------
# Post definitions
# ---------------------------------------------------------------------------

POSTS = [
    {
        "slug": "biaya-admin-marketplace-mahal-hitung-kerugian",
        "title_id": "Biaya Admin Marketplace Makin Menguras? Hitung Kerugian Nyata Anda Setiap Bulan",
        "title_en": "Marketplace Admin Fees Eating Your Profit? Calculate Your Real Monthly Loss",
        "excerpt_id": "Setiap kali kebijakan biaya admin marketplace naik, jutaan seller UMKM kena dampaknya langsung. Sebelum terus menerus menerima, yuk hitung dulu kerugian nyata yang sudah Anda tanggung selama ini.",
        "excerpt_en": "Every time marketplace admin fee policies change, millions of UMKM sellers are directly impacted. Before accepting it endlessly, calculate the real losses you have been bearing.",
        "content_id": ARTICLE_1_CONTENT.strip(),
        "content_en": "",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
        "featured_image_alt": "Seller UMKM menghitung kerugian biaya admin marketplace",
        "author": "Tim Calius Digital",
        "category": "business",
        "tags": ["biaya admin marketplace", "marketplace", "seller umkm", "toko online", "potongan marketplace"],
        "read_time": 8,
        "seo_title": "Biaya Admin Marketplace Naik? Hitung Kerugian Nyata Anda",
        "seo_description": "Simulasi lengkap kerugian seller UMKM akibat biaya admin, iklan wajib, dan potongan kampanye marketplace. Hitung sebelum terlambat.",
        "faq_items": [
            {
                "question": "Apakah biaya admin marketplace bisa dinegosiasi?",
                "answer": "Tidak. Biaya admin ditetapkan platform secara sepihak dan berlaku untuk semua seller, kecuali seller dengan status official store atau brand partner khusus yang memiliki perjanjian tersendiri."
            },
            {
                "question": "Berapa biaya membuat website toko online sendiri?",
                "answer": "Bergantung kompleksitas. Template website siap pakai dari Calius Digital mulai dari Rp 3.500.000 sekali bayar. Tidak ada biaya admin bulanan — hanya biaya hosting/domain tahunan yang jauh lebih kecil."
            },
            {
                "question": "Apakah pembeli mau belanja di website sendiri, bukan di marketplace?",
                "answer": "Ya, terutama pelanggan repeat buyer. Bangun kepercayaan lewat layanan baik di marketplace dulu, lalu arahkan pelanggan setia ke website Anda dengan insentif seperti harga khusus atau ongkir gratis."
            },
            {
                "question": "Bagaimana cara menerima pembayaran di website sendiri?",
                "answer": "Bisa integrasi payment gateway seperti Midtrans yang mendukung transfer bank, QRIS, GoPay, OVO, dan kartu kredit. Atau paling simpel: pembayaran via transfer langsung dengan konfirmasi WhatsApp."
            }
        ]
    },
    {
        "slug": "cara-jualan-online-tanpa-potongan-marketplace",
        "title_id": "Cara Jualan Online Tanpa Potongan Marketplace: Panduan Lengkap Seller UMKM 2026",
        "title_en": "How to Sell Online Without Marketplace Cuts: Complete Guide for UMKM Sellers 2026",
        "excerpt_id": "Bosan dipotong 5–20% setiap transaksi di marketplace? Inilah panduan step-by-step membangun jalur penjualan online mandiri yang bebas dari biaya admin dan aturan sepihak platform.",
        "excerpt_en": "Tired of losing 5–20% per transaction in marketplaces? Here is a step-by-step guide to building your own independent online sales channel free from admin fees.",
        "content_id": ARTICLE_2_CONTENT.strip(),
        "content_en": "",
        "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
        "featured_image_alt": "Seller UMKM membangun website toko online mandiri tanpa potongan marketplace",
        "author": "Tim Calius Digital",
        "category": "tutorial",
        "tags": ["jualan online tanpa marketplace", "website toko online", "seller umkm", "toko online mandiri"],
        "read_time": 10,
        "seo_title": "Cara Jualan Online Tanpa Potongan Marketplace 2026",
        "seo_description": "Panduan lengkap step-by-step untuk seller UMKM membangun website toko online mandiri tanpa biaya admin marketplace. Mulai dari Rp 3 juta sekali bayar.",
        "faq_items": [
            {
                "question": "Apakah jualan di website sendiri bisa sebesar di marketplace?",
                "answer": "Tidak otomatis karena marketplace punya traffic bawaan. Tapi dengan strategi iklan dan SEO yang tepat, website sendiri bisa menghasilkan profit lebih besar karena tidak ada potongan. Banyak seller yang omzet lebih kecil dari marketplace tapi untung lebih banyak."
            },
            {
                "question": "Apakah perlu toko online sekompleks Tokopedia?",
                "answer": "Tidak perlu. Untuk UMKM, website dengan 10-20 halaman produk, form pemesanan WhatsApp, dan payment gateway sederhana sudah lebih dari cukup. Semakin simpel, semakin mudah dikelola dan lebih cepat loading-nya."
            },
            {
                "question": "Bagaimana cara mendatangkan pembeli ke website sendiri?",
                "answer": "Ada 3 cara utama: (1) Iklan berbayar Google/Meta langsung ke website, (2) SEO — artikel blog yang menarik pembeli organik dari Google, (3) Redirect pelanggan lama dari marketplace ke website dengan penawaran eksklusif."
            },
            {
                "question": "Apakah website sendiri harus selalu online 24 jam?",
                "answer": "Ya, dan itu sudah otomatis dengan layanan hosting profesional. Website tidak perlu dijaga manual — hosting yang baik menjamin uptime 99.9% tanpa perlu intervensi dari Anda."
            }
        ]
    },
    {
        "slug": "template-website-rental-mobil-terintegrasi-whatsapp",
        "title_id": "Template Website Rental Mobil Terintegrasi WhatsApp: Booking Langsung Tanpa Komisi",
        "title_en": "WhatsApp-Integrated Car Rental Website Template: Direct Booking Without Commission",
        "excerpt_id": "Bisnis rental mobil yang masih andalkan DM Instagram atau listing OTA kehilangan puluhan booking setiap bulan — dan membayar komisi besar. Inilah cara mudah punya website rental mobil profesional dengan booking WhatsApp otomatis.",
        "excerpt_en": "Car rental businesses relying on Instagram DMs or OTA listings lose dozens of bookings monthly while paying big commissions. Here is how to have a professional rental website with automatic WhatsApp booking.",
        "content_id": ARTICLE_3_CONTENT.strip(),
        "content_en": "",
        "image": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80",
        "featured_image_alt": "Website rental mobil profesional terintegrasi WhatsApp untuk bisnis UMKM",
        "author": "Tim Calius Digital",
        "category": "tips",
        "tags": ["website rental mobil", "rental mobil whatsapp", "template bisnis rental", "booking online rental mobil"],
        "read_time": 7,
        "seo_title": "Template Website Rental Mobil + WhatsApp Booking Otomatis",
        "seo_description": "Template website rental mobil profesional dengan integrasi WhatsApp booking otomatis. Tanpa komisi OTA, tanpa coding rumit. Mulai terima booking 24 jam.",
        "faq_items": [
            {
                "question": "Apakah website rental mobil bisa diakses 24 jam?",
                "answer": "Ya. Berbeda dengan DM Instagram yang terbatas jam aktif Anda, website aktif 24 jam 7 hari seminggu. Calon penyewa bisa melihat armada dan mengirim inquiry via WhatsApp kapan saja, termasuk tengah malam."
            },
            {
                "question": "Apakah perlu sistem kalender ketersediaan di website?",
                "answer": "Untuk rental kecil dengan 1–10 unit, kalender online biasanya tidak diperlukan. WhatsApp sudah cukup untuk konfirmasi manual. Kalender online baru dibutuhkan saat jumlah unit sudah lebih dari 20 dan volume booking sangat tinggi."
            },
            {
                "question": "Bagaimana cara mendatangkan pengunjung ke website rental mobil?",
                "answer": "Strategi paling efektif: (1) Daftarkan di Google Business Profile agar muncul di Google Maps, (2) Optimalkan konten website dengan keyword 'rental mobil [nama kota]', (3) Pasang iklan Google dengan budget Rp 50-100 ribu per hari."
            },
            {
                "question": "Apakah website rental bisa terintegrasi dengan WhatsApp Business?",
                "answer": "Ya. Tombol booking di website terhubung langsung ke nomor WhatsApp Business Anda, dengan pesan yang sudah terformat otomatis berisi detail permintaan sewa sehingga proses konfirmasi jadi lebih cepat."
            }
        ]
    },
    {
        "slug": "contoh-landing-page-travel-umroh-konversi-tinggi",
        "title_id": "Contoh Landing Page Travel Umroh yang Menghasilkan: 8 Elemen Wajib & Panduan Lengkap 2026",
        "title_en": "High-Converting Umrah Travel Landing Page Examples: 8 Must-Have Elements 2026",
        "excerpt_id": "Landing page travel umroh yang buruk bisa membuat ratusan prospek memilih kompetitor sebelum sempat menghubungi Anda. Inilah elemen kritis yang harus ada — beserta panduan implementasi yang terbukti meningkatkan konversi.",
        "excerpt_en": "A poor umrah travel landing page can make hundreds of prospects choose competitors before contacting you. Here are the critical elements that must be present to increase conversions.",
        "content_id": ARTICLE_4_CONTENT.strip(),
        "content_en": "",
        "image": "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=1200&q=80",
        "featured_image_alt": "Contoh landing page travel umroh profesional dengan konversi tinggi",
        "author": "Tim Calius Digital",
        "category": "tips",
        "tags": ["landing page travel umroh", "website travel umroh", "digital marketing umroh", "konversi leads umroh"],
        "read_time": 9,
        "seo_title": "Contoh Landing Page Travel Umroh dengan Konversi Tinggi 2026",
        "seo_description": "8 elemen wajib landing page travel umroh yang terbukti meningkatkan konversi. Panduan lengkap beserta contoh implementasi dan template siap pakai.",
        "faq_items": [
            {
                "question": "Apa perbedaan landing page dan website untuk travel umroh?",
                "answer": "Landing page adalah halaman tunggal yang difokuskan pada satu tujuan — mendapatkan kontak calon jamaah. Website biasanya memiliki banyak halaman (profil, paket, galeri, kontak). Untuk iklan berbayar, landing page umumnya lebih efektif karena tidak ada distraksi navigasi."
            },
            {
                "question": "Elemen apa yang paling meningkatkan kepercayaan calon jamaah?",
                "answer": "Nomor izin Kemenag yang terlihat jelas, foto jamaah asli yang sudah diberangkatkan, dan testimoni video dari jamaah puas. Ketiga elemen ini mengatasi kekhawatiran penipuan yang menjadi hambatan utama keputusan calon jamaah."
            },
            {
                "question": "Berapa budget iklan yang dibutuhkan untuk travel umroh kecil?",
                "answer": "Mulai dari Rp 100.000-200.000 per hari untuk iklan Google atau Meta. Dengan landing page yang dioptimasi, budget ini sudah bisa menghasilkan 3-5 leads per hari. Yang terpenting adalah landing page-nya dioptimasi dulu sebelum iklan dipasang."
            },
            {
                "question": "Apakah template landing page umroh bisa diupdate sendiri?",
                "answer": "Ya. Template dari Calius Digital dilengkapi dengan CMS admin yang memungkinkan Anda mengupdate jadwal, harga paket, dan foto secara mandiri tanpa perlu pengetahuan coding."
            }
        ]
    },
    {
        "slug": "website-toko-online-lemot-kerugian-omzet",
        "title_id": "Website Toko Online Lemot? Ini 7 Kerugian Nyata yang Menguras Omzet Bisnis Anda",
        "title_en": "Slow Online Store Website? Here Are 7 Real Losses Draining Your Business Revenue",
        "excerpt_id": "Setiap detik tambahan loading time website toko online Anda setara dengan kehilangan calon pembeli. Ini bukan teori — ada datanya. Dan ada solusi konkretnya untuk Anda.",
        "excerpt_en": "Every extra second of loading time in your online store means losing potential buyers. This is not theory — there is data. And there is a concrete solution.",
        "content_id": ARTICLE_5_CONTENT.strip(),
        "content_en": "",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        "featured_image_alt": "Grafik kerugian omzet akibat website toko online yang lambat dan lemot",
        "author": "Tim Calius Digital",
        "category": "business",
        "tags": ["website toko online", "website lambat", "optimasi website", "performa website", "loading website"],
        "read_time": 8,
        "seo_title": "Website Toko Online Lemot? 7 Kerugian Nyata yang Menguras Omzet",
        "seo_description": "Data lengkap dampak website lambat terhadap omzet toko online: bounce rate, konversi iklan, ranking Google, dan kepercayaan pembeli. Plus solusi konkretnya.",
        "faq_items": [
            {
                "question": "Berapa detik waktu loading website yang masih aman untuk toko online?",
                "answer": "Standar ideal: First Contentful Paint (FCP) di bawah 1,8 detik dan Largest Contentful Paint (LCP) di bawah 2,5 detik. Anda bisa cek kecepatan website Anda gratis di pagespeed.web.dev."
            },
            {
                "question": "Apakah hosting murah mempengaruhi kecepatan website?",
                "answer": "Sangat signifikan. Hosting dengan server shared yang overloaded adalah penyebab umum website lambat. Selain gambar yang tidak dikompres, kualitas hosting adalah faktor terbesar yang mempengaruhi waktu loading."
            },
            {
                "question": "Apakah website yang dibuat dengan template bisa cepat?",
                "answer": "Ya, asalkan template-nya dibangun dengan praktik coding yang benar: gambar dikompres otomatis, CSS dan JS dimuat secara efisien, dan hosting menggunakan infrastruktur yang tepat. Template dari Calius Digital dioptimasi untuk skor PageSpeed tinggi."
            },
            {
                "question": "Apakah memperbaiki kecepatan website meningkatkan ranking Google?",
                "answer": "Ya. Sejak 2021, Google menggunakan Core Web Vitals sebagai faktor ranking. Website yang lebih cepat mendapat keuntungan di hasil pencarian organik. Ini berarti lebih banyak traffic gratis tanpa biaya iklan tambahan."
            }
        ]
    }
]

# ---------------------------------------------------------------------------
# Execution
# ---------------------------------------------------------------------------

def run():
    print(f"\nTarget: {BASE_URL}")
    print(f"Posts to insert: {len(POSTS)}\n")

    success_count = 0
    for post in POSTS:
        url = f"{BASE_URL}/api/admin/blog"
        try:
            resp = requests.post(url, json=post, headers=HEADERS, timeout=30)
            if resp.status_code == 200:
                print(f"  [OK] {post['slug']}")
                success_count += 1
            else:
                try:
                    detail = resp.json().get("detail", resp.text[:200])
                except Exception:
                    detail = resp.text[:200]
                print(f"  [FAIL {resp.status_code}] {post['slug']} — {detail}")
        except requests.exceptions.RequestException as exc:
            print(f"  [ERROR] {post['slug']} — {exc}")

    print(f"\nDone: {success_count}/{len(POSTS)} posts inserted successfully.")
    if success_count == len(POSTS):
        print("Semua artikel berhasil dimasukkan. Lakukan URL Inspection di Google Search Console untuk setiap URL.")

if __name__ == "__main__":
    run()
