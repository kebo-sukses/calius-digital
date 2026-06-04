"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, Headphones, RotateCcw, Award } from "lucide-react";

interface ValueProp {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const values: ValueProp[] = [
  {
    icon: <Award className="text-gold" size={28} />,
    title: "100% Produk Original",
    desc: "Semua produk kami telah melalui verifikasi keaslian. Uang kembali jika tidak sesuai.",
  },
  {
    icon: <Truck className="text-gold" size={28} />,
    title: "Gratis Ongkir Se-Indonesia",
    desc: "Nikmati gratis ongkos kirim ke seluruh Indonesia untuk pembelian minimal Rp 150.000.",
  },
  {
    icon: <CreditCard className="text-gold" size={28} />,
    title: "Bisa COD & 20+ Metode Bayar",
    desc: "Bayar di tempat (COD), transfer bank, e-wallet, dan kartu kredit tersedia.",
  },
  {
    icon: <RotateCcw className="text-gold" size={28} />,
    title: "Retur & Tukar Ukuran Mudah",
    desc: "Tidak cocok ukurannya? Tukar gratis dalam 7 hari tanpa syarat berbelit.",
  },
  {
    icon: <Headphones className="text-gold" size={28} />,
    title: "CS Siap Membantu 24/7",
    desc: "Tim layanan pelanggan kami siap merespons pertanyaan Anda kapan saja.",
  },
  {
    icon: <ShieldCheck className="text-gold" size={28} />,
    title: "Transaksi 100% Aman",
    desc: "Sistem enkripsi SSL terbaru melindungi setiap transaksi dan data pribadi Anda.",
  },
];

export default function ValueProposition() {
  return (
    <section className="py-20 md:py-28 bg-zinc-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold text-xs font-semibold tracking-widest uppercase block mb-3">
            Mengapa Pilih Kami
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Belanja Lebih Nyaman,
            <br className="hidden sm:block" /> Lebih Terpercaya
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Kami hadir untuk memberikan pengalaman belanja fashion online terbaik di Indonesia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-2xl p-6 md:p-8 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                {val.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">{val.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
