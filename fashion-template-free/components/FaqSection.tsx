"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Berapa lama estimasi pengiriman ke seluruh Indonesia?",
    answer:
      "Untuk Jabodetabek: 1-2 hari kerja. Pulau Jawa (luar Jabodetabek): 2-3 hari kerja. Luar Pulau Jawa: 3-7 hari kerja tergantung lokasi. Kami bekerja sama dengan JNE, J&T, SiCepat, dan Anteraja.",
  },
  {
    question: "Apakah bisa COD (Bayar di Tempat)?",
    answer:
      "Ya, layanan COD tersedia untuk seluruh wilayah Indonesia. Anda dapat memilih opsi COD saat checkout dan melakukan pembayaran langsung kepada kurir saat paket tiba.",
  },
  {
    question: "Bagaimana cara menukar ukuran atau meretur produk?",
    answer:
      "Retur atau penukaran ukuran dapat dilakukan dalam 7 hari setelah produk diterima. Produk harus dalam kondisi belum digunakan, tag masih terpasang, dan kemasan asli. Biaya pengiriman retur ditanggung kami jika kesalahan dari pihak kami.",
  },
  {
    question: "Apakah semua produk 100% original?",
    answer:
      "Semua produk di LUXE MODE dijamin 100% original dan telah melewati proses verifikasi kualitas. Jika produk yang Anda terima terbukti tidak original, kami akan memberikan pengembalian dana penuh tanpa syarat.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menerima: Transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA, ShopeePay), QRIS, kartu kredit/debit Visa & Mastercard, paylater (Kredivo, Akulaku), dan COD.",
  },
  {
    question: "Bagaimana cara mendapatkan gratis ongkir?",
    answer:
      "Gratis ongkir otomatis berlaku untuk setiap pembelian minimal Rp 150.000. Tidak perlu kode promo khusus. Berlaku ke seluruh Indonesia dengan berat paket hingga 1 kg.",
  },
  {
    question: "Apakah ada program membership atau loyalitas?",
    answer:
      "Ya! Program LUXE Points memberikan 1 poin setiap Rp 1.000 pembelian. Poin dapat ditukarkan dengan diskon tambahan. Member Gold mendapatkan akses early access flash sale dan gratis ongkir tanpa minimum pembelian.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-28 bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs font-semibold tracking-widest uppercase block mb-3">
            Pertanyaan Umum
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Ada yang Ingin Ditanyakan?
          </h2>
          <p className="text-zinc-500">
            Tidak menemukan jawaban? Hubungi kami via WhatsApp 24/7.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === i
                  ? "bg-white border-gold/30 shadow-md"
                  : "bg-white border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span
                  className={`font-semibold text-sm md:text-base transition-colors ${
                    openIndex === i ? "text-zinc-900" : "text-zinc-700"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    openIndex === i ? "bg-gold text-white" : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {openIndex === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-zinc-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center bg-white border border-zinc-200 rounded-2xl p-8"
        >
          <p className="font-serif text-xl font-bold text-zinc-900 mb-2">
            Masih punya pertanyaan?
          </p>
          <p className="text-zinc-500 text-sm mb-5">
            Tim kami siap membantu Anda 24 jam sehari, 7 hari seminggu.
          </p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20LUXE%20MODE!%20Saya%20ingin%20bertanya..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#22c55e] transition-colors shadow-lg shadow-green-200"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Chat WhatsApp Sekarang
          </a>
        </motion.div>
      </div>
    </section>
  );
}
