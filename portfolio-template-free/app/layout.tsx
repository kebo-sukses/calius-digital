import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { portfolioConfig } from "@/config/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: portfolioConfig.seo.title,
  description: portfolioConfig.seo.description,
  keywords: portfolioConfig.seo.keywords,
  authors: [{ name: portfolioConfig.personal.name }],
  openGraph: {
    title: portfolioConfig.seo.title,
    description: portfolioConfig.seo.description,
    url: portfolioConfig.seo.siteUrl,
    siteName: portfolioConfig.personal.name,
    images: [
      {
        url: portfolioConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: portfolioConfig.seo.title,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: portfolioConfig.seo.title,
    description: portfolioConfig.seo.description,
    images: [portfolioConfig.seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
