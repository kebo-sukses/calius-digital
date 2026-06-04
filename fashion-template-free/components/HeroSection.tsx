"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-zinc-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-900/3" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
              Koleksi Terbaru 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight mb-6"
            >
              Tampil{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-gold">Memukau</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-gold/10 -z-0 rounded" />
              </span>
              <br />
              Setiap Hari
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-zinc-500 text-lg leading-relaxed mb-8 max-w-md"
            >
              Kurasikan gaya Anda dengan koleksi fashion premium pilihan. Dari kasual
              elegan hingga formal mewah — semua ada di satu tempat.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {[
                "Gratis Ongkir",
                "Bisa COD",
                "100% Original",
              ].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm"
                >
                  <ShieldCheck size={12} className="text-gold" />
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#produk"
                className="inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold text-sm px-7 py-4 rounded-full hover:bg-zinc-700 transition-all duration-300 hover:gap-3 shadow-lg shadow-zinc-900/20"
              >
                Jelajahi Koleksi
                <ArrowRight size={16} />
              </a>
              <a
                href="#flash-sale"
                className="inline-flex items-center gap-2 bg-gold text-white font-semibold text-sm px-7 py-4 rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/25"
              >
                Flash Sale ⚡
              </a>
            </motion.div>

            {/* Social proof number */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-6 mt-10 pt-8 border-t border-zinc-200"
            >
              {[
                { number: "50K+", label: "Pelanggan Puas" },
                { number: "4.9★", label: "Rating Toko" },
                { number: "200+", label: "Brand Premium" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl font-bold text-zinc-900">{stat.number}</p>
                  <p className="text-xs text-zinc-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative grid grid-cols-2 gap-4 max-w-lg mx-auto lg:ml-auto lg:mr-0">
              {/* Main large image */}
              <div className="col-span-2 relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
                  alt="Koleksi fashion terbaru LUXE MODE"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                  <p className="font-serif text-sm font-semibold text-zinc-900">Koleksi Musim Ini</p>
                  <p className="text-xs text-gold font-medium">Mulai Rp 189.000</p>
                </div>
              </div>

              {/* Two small images */}
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80"
                  alt="Fashion wanita premium"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="25vw"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80"
                  alt="Fashion pria premium"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="25vw"
                />
                <div className="absolute top-3 right-3 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  NEW
                </div>
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-[200px]"
            >
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg">🚚</span>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">Gratis Ongkir</p>
                <p className="text-[10px] text-zinc-500">Seluruh Indonesia</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
