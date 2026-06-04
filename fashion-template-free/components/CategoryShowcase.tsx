"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Category {
  name: string;
  tagline: string;
  image: string;
  href: string;
  count: string;
}

const categories: Category[] = [
  {
    name: "Wanita",
    tagline: "Elegan & Modern",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
    href: "#wanita",
    count: "1.200+ produk",
  },
  {
    name: "Pria",
    tagline: "Maskulin & Stylish",
    image: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=600&q=80",
    href: "#pria",
    count: "850+ produk",
  },
  {
    name: "Hijab & Modest",
    tagline: "Anggun & Syar'i",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80",
    href: "#hijab",
    count: "640+ produk",
  },
  {
    name: "Aksesoris",
    tagline: "Sentuhan Sempurna",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    href: "#aksesoris",
    count: "520+ produk",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function CategoryShowcase() {
  return (
    <section id="kategori" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-gold text-xs font-semibold tracking-widest uppercase block mb-3">
            Temukan Gaya Anda
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Belanja per Kategori
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            Dari pakaian kasual hingga formal, kami punya semua yang Anda butuhkan.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((cat) => (
            <motion.a
              key={cat.name}
              href={cat.href}
              variants={itemVariants}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] block"
            >
              <Image
                src={cat.image}
                alt={`Kategori ${cat.name}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/70 text-xs font-medium mb-1 tracking-wide">{cat.tagline}</p>
                <h3 className="font-serif text-xl font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-white/50 text-xs">{cat.count}</p>
                <div className="flex items-center gap-1 mt-3 text-gold text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Lihat Koleksi <ArrowRight size={12} />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
