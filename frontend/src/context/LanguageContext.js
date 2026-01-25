import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  id: {
    nav: {
      home: 'Beranda',
      services: 'Layanan',
      templates: 'Template',
      portfolio: 'Portfolio',
      pricing: 'Harga',
      blog: 'Blog',
      contact: 'Kontak',
      getStarted: 'Mulai Sekarang'
    },
    hero: {
      badge: 'Web Agency Profesional',
      title: 'Wujudkan Website',
      titleHighlight: 'Impian Bisnis Anda',
      subtitle: 'Kami membantu bisnis Anda tampil profesional di dunia digital dengan website berkualitas tinggi dan template premium.',
      cta: 'Konsultasi Gratis',
      ctaSecondary: 'Lihat Portfolio'
    },
    services: {
      title: 'Layanan Kami',
      subtitle: 'Solusi website lengkap untuk semua kebutuhan bisnis Anda',
      startFrom: 'Mulai dari',
      viewDetails: 'Lihat Detail'
    },
    templates: {
      title: 'Template Premium',
      subtitle: 'Template website berkualitas tinggi siap pakai',
      filter: {
        all: 'Semua',
        business: 'Bisnis',
        ecommerce: 'E-Commerce',
        portfolio: 'Portfolio',
        landingPage: 'Landing Page',
        restaurant: 'Restoran'
      },
      buyNow: 'Beli Sekarang',
      viewDemo: 'Lihat Demo',
      downloads: 'Download',
      featured: 'Unggulan',
      bestseller: 'Terlaris',
      new: 'Baru',
      sale: 'Diskon'
    },
    portfolio: {
      title: 'Portfolio',
      subtitle: 'Proyek-proyek terbaik yang telah kami kerjakan',
      viewProject: 'Lihat Proyek'
    },
    testimonials: {
      title: 'Testimoni Klien',
      subtitle: 'Apa kata mereka tentang layanan kami'
    },
    pricing: {
      title: 'Paket Harga',
      subtitle: 'Pilih paket yang sesuai dengan kebutuhan bisnis Anda',
      popular: 'Paling Populer',
      getStarted: 'Mulai Sekarang'
    },
    blog: {
      title: 'Blog & Artikel',
      subtitle: 'Tips dan insight seputar web development',
      readMore: 'Baca Selengkapnya',
      minRead: 'menit baca'
    },
    contact: {
      title: 'Hubungi Kami',
      subtitle: 'Siap membantu mewujudkan website impian Anda',
      name: 'Nama Lengkap',
      email: 'Email',
      phone: 'Nomor Telepon',
      service: 'Pilih Layanan',
      message: 'Pesan',
      send: 'Kirim Pesan',
      sending: 'Mengirim...',
      success: 'Pesan berhasil dikirim!',
      whatsapp: 'Chat via WhatsApp'
    },
    footer: {
      description: 'Web agency profesional yang membantu bisnis Anda berkembang dengan website berkualitas tinggi.',
      services: 'Layanan',
      company: 'Perusahaan',
      legal: 'Legal',
      about: 'Tentang Kami',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat & Ketentuan',
      copyright: '© 2024 Calius Digital. Hak Cipta Dilindungi.'
    },
    cta: {
      title: 'Siap Memulai Proyek Anda?',
      subtitle: 'Konsultasikan kebutuhan website Anda dengan tim kami secara gratis.',
      button: 'Hubungi Kami Sekarang'
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      templates: 'Templates',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      blog: 'Blog',
      contact: 'Contact',
      getStarted: 'Get Started'
    },
    hero: {
      badge: 'Professional Web Agency',
      title: 'Build Your Dream',
      titleHighlight: 'Business Website',
      subtitle: 'We help your business look professional in the digital world with high-quality websites and premium templates.',
      cta: 'Free Consultation',
      ctaSecondary: 'View Portfolio'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Complete website solutions for all your business needs',
      startFrom: 'Starting from',
      viewDetails: 'View Details'
    },
    templates: {
      title: 'Premium Templates',
      subtitle: 'High-quality ready-to-use website templates',
      filter: {
        all: 'All',
        business: 'Business',
        ecommerce: 'E-Commerce',
        portfolio: 'Portfolio',
        landingPage: 'Landing Page',
        restaurant: 'Restaurant'
      },
      buyNow: 'Buy Now',
      viewDemo: 'View Demo',
      downloads: 'Downloads',
      featured: 'Featured',
      bestseller: 'Bestseller',
      new: 'New',
      sale: 'Sale'
    },
    portfolio: {
      title: 'Portfolio',
      subtitle: 'Our best projects that we have worked on',
      viewProject: 'View Project'
    },
    testimonials: {
      title: 'Client Testimonials',
      subtitle: 'What they say about our services'
    },
    pricing: {
      title: 'Pricing Plans',
      subtitle: 'Choose the plan that fits your business needs',
      popular: 'Most Popular',
      getStarted: 'Get Started'
    },
    blog: {
      title: 'Blog & Articles',
      subtitle: 'Tips and insights about web development',
      readMore: 'Read More',
      minRead: 'min read'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Ready to help you build your dream website',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      service: 'Select Service',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      whatsapp: 'Chat via WhatsApp'
    },
    footer: {
      description: 'Professional web agency helping your business grow with high-quality websites.',
      services: 'Services',
      company: 'Company',
      legal: 'Legal',
      about: 'About Us',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      copyright: '© 2024 Calius Digital. All Rights Reserved.'
    },
    cta: {
      title: 'Ready to Start Your Project?',
      subtitle: 'Consult your website needs with our team for free.',
      button: 'Contact Us Now'
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'id';
    }
    return 'id';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
