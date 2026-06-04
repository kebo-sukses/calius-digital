"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Star, Clock } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  stock: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Blouse Premium Chiffon Wanita",
    category: "Wanita",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f4f4e7?w=500&q=80",
    originalPrice: 389000,
    salePrice: 189000,
    discount: 51,
    rating: 4.9,
    reviewCount: 2341,
    badge: "Terlaris",
    stock: 12,
  },
  {
    id: 2,
    name: "Kemeja Formal Slim Fit Pria",
    category: "Pria",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    originalPrice: 459000,
    salePrice: 229000,
    discount: 50,
    rating: 4.8,
    reviewCount: 1876,
    badge: "Flash Sale",
    stock: 7,
  },
  {
    id: 3,
    name: "Hijab Satin Premium Motif",
    category: "Hijab",
    image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80",
    originalPrice: 259000,
    salePrice: 129000,
    discount: 50,
    rating: 4.9,
    reviewCount: 3102,
    badge: "New",
    stock: 25,
  },
  {
    id: 4,
    name: "Tas Tote Leather Premium",
    category: "Aksesoris",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
    originalPrice: 699000,
    salePrice: 349000,
    discount: 50,
    rating: 4.7,
    reviewCount: 987,
    badge: "Limited",
    stock: 5,
  },
  {
    id: 5,
    name: "Dress Midi Floral Wanita",
    category: "Wanita",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80",
    originalPrice: 499000,
    salePrice: 249000,
    discount: 50,
    rating: 4.8,
    reviewCount: 1543,
    stock: 18,
  },
  {
    id: 6,
    name: "Celana Chino Modern Pria",
    category: "Pria",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
    originalPrice: 379000,
    salePrice: 189000,
    discount: 50,
    rating: 4.7,
    reviewCount: 763,
    stock: 14,
  },
  {
    id: 7,
    name: "Outer Cardigan Knit Wanita",
    category: "Wanita",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80",
    originalPrice: 429000,
    salePrice: 215000,
    discount: 50,
    rating: 4.9,
    reviewCount: 2015,
    badge: "Hot",
    stock: 9,
  },
  {
    id: 8,
    name: "Sepatu Sneakers Unisex",
    category: "Aksesoris",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    originalPrice: 589000,
    salePrice: 295000,
    discount: 50,
    rating: 4.8,
    reviewCount: 1234,
    stock: 3,
  },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={star <= Math.round(rating) ? "fill-gold text-gold" : "fill-zinc-200 text-zinc-200"}
        />
      ))}
    </div>
  );
}

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 5, minutes: 42, seconds: 17 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Clock size={14} className="text-red-500" />
      <span className="text-sm font-bold text-red-500">
        Berakhir dalam:{" "}
        <span className="font-mono">
          {String(time.hours).padStart(2, "0")}:{String(time.minutes).padStart(2, "0")}:{String(time.seconds).padStart(2, "0")}
        </span>
      </span>
    </div>
  );
}

export default function FlashSaleSection() {
  return (
    <section id="flash-sale" className="py-20 md:py-28 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-xs font-semibold tracking-widest uppercase block mb-2">
              ⚡ Penawaran Terbatas
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 mb-3">
              Flash Sale
            </h2>
            <CountdownTimer />
          </motion.div>

          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 underline underline-offset-4 decoration-gold transition-colors self-start sm:self-auto"
          >
            Lihat semua produk →
          </motion.a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-zinc-100"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                  {product.badge && (
                    <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Stock warning */}
                {product.stock <= 10 && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                      <p className="text-[10px] font-semibold text-red-500">
                        Sisa {product.stock} item!
                      </p>
                      <div className="mt-1 bg-zinc-200 rounded-full h-1">
                        <div
                          className="bg-red-500 h-1 rounded-full transition-all"
                          style={{ width: `${(product.stock / 25) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to cart hover button */}
                <div className="absolute inset-x-3 bottom-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {product.stock > 10 && (
                    <button className="w-full bg-zinc-900 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gold transition-colors duration-200">
                      <ShoppingCart size={14} />
                      Tambah ke Keranjang
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 md:p-4">
                <p className="text-[10px] text-gold font-semibold tracking-wide uppercase mb-1">
                  {product.category}
                </p>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-2">
                  <StarRating rating={product.rating} />
                  <span className="text-[10px] text-zinc-400">({product.reviewCount.toLocaleString("id-ID")})</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-zinc-900">
                    {formatRupiah(product.salePrice)}
                  </span>
                  <span className="text-xs text-zinc-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
