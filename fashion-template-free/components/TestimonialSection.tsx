"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  city: string;
  rating: number;
  review: string;
  product: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Siti R.",
    city: "Jakarta Selatan",
    rating: 5,
    review:
      "Bajunya persis seperti foto, kualitas kainnya premium banget! Pengiriman juga super cepat, besoknya udah sampai. Pasti bakal belanja lagi di sini!",
    product: "Blouse Premium Chiffon",
    avatar: "SR",
  },
  {
    id: 2,
    name: "Budi H.",
    city: "Surabaya",
    rating: 5,
    review:
      "Kemeja slim fit-nya pas banget di badan, bahan adem dan tidak mudah kusut. Sudah beli 3 warna berbeda. Worth it banget untuk harganya!",
    product: "Kemeja Formal Slim Fit",
    avatar: "BH",
  },
  {
    id: 3,
    name: "Fatimah A.",
    city: "Bandung",
    rating: 5,
    review:
      "Hijab satin motifnya elegan dan bahannya jatuh. Reseller juga welcome. Highly recommended untuk yang cari hijab premium dengan harga terjangkau!",
    product: "Hijab Satin Premium",
    avatar: "FA",
  },
  {
    id: 4,
    name: "Rizky P.",
    city: "Medan",
    rating: 4,
    review:
      "Tas tote leather-nya keren, jahitannya rapi. COD juga bisa, makin yakin buat beli. Satu-satunya saran: semoga bisa tambah pilihan warna lagi.",
    product: "Tas Tote Leather Premium",
    avatar: "RP",
  },
  {
    id: 5,
    name: "Dewi K.",
    city: "Yogyakarta",
    rating: 5,
    review:
      "Flash sale-nya beneran hemat! Beli outer cardigan harga normal hampir 400rb, dapat di 200rb-an. Kualitas tidak mengecewakan, super puas!",
    product: "Outer Cardigan Knit",
    avatar: "DK",
  },
  {
    id: 6,
    name: "Andi M.",
    city: "Makassar",
    rating: 5,
    review:
      "Pelayanan CS-nya responsif, tanya-tanya jam 11 malam pun langsung dijawab. Packaging rapi, ada bubble wrap ekstra. Recommended seller!",
    product: "Celana Chino Modern",
    avatar: "AM",
  },
];

const avatarColors = [
  "bg-rose-100 text-rose-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-purple-100 text-purple-600",
  "bg-sky-100 text-sky-600",
];

export default function TestimonialSection() {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold text-xs font-semibold tracking-widest uppercase block mb-3">
            Kata Mereka
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            50.000+ Pelanggan Puas
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            Jangan percaya kata kami — percaya kata mereka yang sudah berbelanja.
          </p>

          {/* Overall rating */}
          <div className="inline-flex items-center gap-3 mt-6 bg-zinc-50 border border-zinc-200 rounded-full px-5 py-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="font-bold text-zinc-900 text-sm">4.9 / 5.0</span>
            <span className="text-zinc-400 text-xs">dari 12.847 ulasan</span>
          </div>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="break-inside-avoid bg-zinc-50 border border-zinc-100 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300"
            >
              <Quote size={24} className="text-gold/30 mb-4" />
              <p className="text-zinc-600 text-sm leading-relaxed mb-5 italic">&ldquo;{t.review}&rdquo;</p>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColors[i % avatarColors.length]}`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-400">{t.city}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={s <= t.rating ? "fill-gold text-gold" : "fill-zinc-200 text-zinc-200"}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-400 bg-zinc-200 rounded-full px-2 py-0.5">
                  {t.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
