"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

const footerLinks = {
  Belanja: [
    { label: "Wanita", href: "#" },
    { label: "Pria", href: "#" },
    { label: "Hijab & Modest", href: "#" },
    { label: "Aksesoris", href: "#" },
    { label: "Flash Sale", href: "#" },
    { label: "Produk Baru", href: "#" },
  ],
  Bantuan: [
    { label: "Cara Pemesanan", href: "#" },
    { label: "Status Pesanan", href: "#" },
    { label: "Retur & Penukaran", href: "#" },
    { label: "Pengiriman", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Hubungi Kami", href: "#" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "#" },
    { label: "Blog Fashion", href: "#" },
    { label: "Karir", href: "#" },
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
  ],
};

const paymentMethods = [
  { name: "BCA", bg: "bg-blue-600" },
  { name: "Mandiri", bg: "bg-yellow-500" },
  { name: "BNI", bg: "bg-orange-500" },
  { name: "GoPay", bg: "bg-green-500" },
  { name: "OVO", bg: "bg-purple-600" },
  { name: "DANA", bg: "bg-blue-400" },
  { name: "QRIS", bg: "bg-zinc-700" },
  { name: "COD", bg: "bg-zinc-600" },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-serif text-2xl font-bold mb-1">
                Dapatkan Penawaran Eksklusif
              </h3>
              <p className="text-zinc-400 text-sm">
                Daftar newsletter dan dapat diskon 10% untuk pembelian pertama.
              </p>
            </div>
            <div className="flex gap-3 max-w-md w-full">
              <input
                type="email"
                placeholder="Masukkan email Anda..."
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-zinc-500 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button className="bg-gold hover:bg-gold-dark text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors whitespace-nowrap">
                Daftar Gratis
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <a href="#" className="block mb-4">
              <span className="font-serif text-2xl font-bold tracking-widest uppercase">
                Luxe Mode
              </span>
              <p className="text-[10px] tracking-[0.3em] text-gold uppercase font-sans font-medium mt-0.5">
                Fashion Marketplace
              </p>
            </a>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs">
              Fashion marketplace terpercaya di Indonesia. Koleksi premium, harga terjangkau,
              pengiriman cepat ke seluruh nusantara.
            </p>
            <div className="space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-gold shrink-0" />
                <span>Jl. Fashion Street No. 88, Jakarta Selatan 12180</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-gold shrink-0" />
                <span>+62 812-3456-7890 (WhatsApp 24/7)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-gold shrink-0" />
                <span>cs@luxemode.id</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: <Instagram size={16} />, label: "Instagram" },
                { icon: <Facebook size={16} />, label: "Facebook" },
                { icon: <Youtube size={16} />, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-zinc-400 hover:text-gold text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-xs text-center md:text-left">
              © 2026 LUXE MODE Fashion Marketplace. Hak cipta dilindungi undang-undang.
            </p>
            {/* Payment methods */}
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {paymentMethods.map((method) => (
                <span
                  key={method.name}
                  className={`${method.bg} text-white text-[9px] font-bold px-2 py-1 rounded`}
                >
                  {method.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
