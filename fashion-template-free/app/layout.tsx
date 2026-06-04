import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUXE MODE — Fashion Marketplace Indonesia",
  description:
    "Temukan koleksi fashion premium terkurasi. Gratis ongkir seluruh Indonesia, bisa COD, garansi 100% original.",
  keywords: [
    "fashion online",
    "baju wanita",
    "baju pria",
    "hijab premium",
    "belanja fashion indonesia",
  ],
  openGraph: {
    title: "LUXE MODE — Fashion Marketplace Indonesia",
    description: "Koleksi fashion premium terkurasi. Gratis ongkir & COD.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
