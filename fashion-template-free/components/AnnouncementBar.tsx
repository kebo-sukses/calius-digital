"use client";

import { useEffect, useRef } from "react";

const promos = [
  "🚚 Gratis Ongkir Minimal Belanja Rp 150.000 ke Seluruh Indonesia",
  "✨ Garansi 100% Original — Uang Kembali Jika Tidak Sesuai",
  "💳 Bisa COD (Bayar di Tempat) untuk Semua Kota",
  "⭐ Flash Sale Hari Ini — Hemat hingga 60% untuk Koleksi Terpilih",
  "📦 Pengiriman Ekspres 1-2 Hari ke Jabodetabek",
];

export default function AnnouncementBar() {
  const content = [...promos, ...promos];

  return (
    <div className="bg-zinc-900 text-white py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {content.map((text, i) => (
          <span key={i} className="text-xs font-sans font-medium tracking-wide mx-10 shrink-0">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
