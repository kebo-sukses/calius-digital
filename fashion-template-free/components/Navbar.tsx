"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Wanita", href: "#wanita", hasDropdown: true },
  { label: "Pria", href: "#pria", hasDropdown: true },
  { label: "Aksesoris", href: "#aksesoris", hasDropdown: false },
  { label: "Hijab", href: "#hijab", hasDropdown: false },
  { label: "Flash Sale", href: "#flash-sale", hasDropdown: false },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [cartCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-zinc-100"
          : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="#" className="flex flex-col leading-none">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-widest text-zinc-900 uppercase">
              Luxe Mode
            </span>
            <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-sans font-medium">
              Fashion Marketplace
            </span>
          </a>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label} className="relative group">
                <a
                  href={link.href}
                  className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown
                      size={14}
                      className="text-zinc-400 group-hover:text-zinc-600 transition-transform group-hover:rotate-180 duration-200"
                    />
                  )}
                </a>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Cari produk"
              className="hidden md:flex text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <Search size={20} />
            </button>

            <button aria-label="Keranjang belanja" className="relative text-zinc-500 hover:text-zinc-900 transition-colors">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              aria-label="Buka menu"
              className="md:hidden text-zinc-700 hover:text-zinc-900 transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 shadow-lg">
          <ul className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 border-b border-zinc-50 transition-colors"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={16} className="text-zinc-400" />}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <button className="w-full bg-zinc-900 text-white text-sm font-medium py-3 rounded-full tracking-wide hover:bg-zinc-700 transition-colors">
                Masuk / Daftar
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
