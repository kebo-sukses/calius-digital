import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Download, ExternalLink, ShoppingCart, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

/**
 * Category metadata configuration
 * Centralized definition for all template categories — easy to extend
 */
const FREE_TEMPLATES = [
  {
    id: 'portfolio-template-free',
    slug: 'portfolio-template-free',
    name: 'Portfolio Template',
    name_id: 'Template Portfolio',
    category: 'free',
    description: 'Modern portfolio template with Next.js 14 and TypeScript. Ready to use in 10 minutes, just edit one config file!',
    description_id: 'Template portfolio modern dengan Next.js 14 dan TypeScript. Siap pakai dalam 10 menit, tinggal edit satu file konfigurasi!',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=450&fit=crop&fm=webp&auto=format&q=60',
    price: 0,
    is_featured: true,
    is_new: true,
    is_free: true,
    demo_url: 'https://portfolio-template-free-plum.vercel.app/',
    download_url: 'https://github.com/kebo-sukses/portfolio-template-free/archive/refs/heads/main.zip',
    github_url: 'https://github.com/kebo-sukses/portfolio-template-free',
    features: [
      'Next.js 14 + TypeScript + Tailwind CSS',
      '6 section siap pakai',
      'Single config file untuk kustomisasi',
      'Fully responsive & SEO optimized',
      'Integrasi WhatsApp',
      'Dokumentasi lengkap',
    ],
  },
  {
    id: 'company-profil-free-page',
    slug: 'company-profil-free-page',
    name: 'Company Profile Template',
    name_id: 'Template Company Profile',
    category: 'free',
    description: 'Professional company profile landing page with 9 sections, SEO-optimized, JSON-LD schema, breadcrumb. Edit one config file to customize everything.',
    description_id: 'Landing page company profile profesional dengan 9 section, SEO lengkap, JSON-LD schema, breadcrumb. Edit satu file konfigurasi untuk kustomisasi penuh.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop&fm=webp&auto=format&q=60',
    price: 0,
    is_featured: true,
    is_new: true,
    is_free: true,
    demo_url: 'https://company-profil-free-page.vercel.app/',
    download_url: 'https://github.com/kebo-sukses/company-profil-free-page/archive/refs/heads/main.zip',
    github_url: 'https://github.com/kebo-sukses/company-profil-free-page',
    features: [
      'Next.js 14 + TypeScript + Tailwind CSS',
      '9 section: Hero, Layanan, Portfolio, Tim, FAQ, CTA',
      'SEO lengkap: JSON-LD, sitemap, robots.txt',
      'Breadcrumb schema sesuai standar Google',
      'Single config file untuk kustomisasi',
      'Animasi Framer Motion + dark theme',
    ],
  },
];

const CATEGORY_META = {
  free: {
    slug: 'free',
    label_id: 'Gratis',
    label_en: 'Free',
    description_id: 'Template website gratis 100% — download, modifikasi, dan gunakan sesuka hati.',
    description_en: '100% free website templates — download, customize, and use freely.',
    icon: '🎁',
  },
  business: {
    slug: 'business',
    label_id: 'Bisnis',
    label_en: 'Business',
    description_id: 'Template profesional untuk perusahaan, startup, dan agensi.',
    description_en: 'Professional templates for companies, startups, and agencies.',
    icon: '💼',
  },
  ecommerce: {
    slug: 'ecommerce',
    label_id: 'E-Commerce',
    label_en: 'E-Commerce',
    description_id: 'Template toko online dengan fitur keranjang belanja dan pembayaran.',
    description_en: 'Online store templates with shopping cart and payment features.',
    icon: '🛒',
  },
  portfolio: {
    slug: 'portfolio',
    label_id: 'Portfolio',
    label_en: 'Portfolio',
    description_id: 'Template showcase untuk desainer, fotografer, dan kreator.',
    description_en: 'Showcase templates for designers, photographers, and creators.',
    icon: '🎨',
  },
  'landing-page': {
    slug: 'landing-page',
    label_id: 'Landing Page',
    label_en: 'Landing Page',
    description_id: 'Template landing page untuk konversi tinggi dan kampanye marketing.',
    description_en: 'High-converting landing page templates for marketing campaigns.',
    icon: '🚀',
  },
  restaurant: {
    slug: 'restaurant',
    label_id: 'Restoran',
    label_en: 'Restaurant',
    description_id: 'Template untuk restoran, kafe, dan bisnis kuliner.',
    description_en: 'Templates for restaurants, cafes, and culinary businesses.',
    icon: '🍽️',
  },
  property: {
    slug: 'property',
    label_id: 'Properti',
    label_en: 'Property',
    description_id: 'Template landing page untuk agen properti, developer, dan real estate.',
    description_en: 'Landing page templates for real estate agents and property developers.',
    icon: '🏠',
  },
  travel: {
    slug: 'travel',
    label_id: 'Travel & Wisata',
    label_en: 'Travel & Tourism',
    description_id: 'Template untuk agen travel, tour operator, dan bisnis pariwisata.',
    description_en: 'Templates for travel agencies, tour operators, and tourism businesses.',
    icon: '✈️',
  },
};

// Optimize image URLs for Cloudinary, thum.io, and Unsplash
const optimizeImageUrl = (url) => {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', '/upload/w_600,h_400,c_fill,f_auto,q_auto/');
  }
  if (url.includes('thum.io')) {
    return url.replace('/width/1200', '/width/600').replace('/crop/800', '/crop/400').replace('/crop/630', '/crop/400');
  }
  if (url.includes('unsplash.com')) {
    return url.split('?')[0] + '?w=600&fm=webp&auto=format&q=70';
  }
  return url;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const TemplateCategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '' });
  const [processing, setProcessing] = useState(false);

  // Get category metadata or redirect if invalid
  const categoryMeta = useMemo(() => CATEGORY_META[category], [category]);

  useEffect(() => {
    if (!categoryMeta) {
      navigate('/templates', { replace: true });
      return;
    }

    // Free category: use static list, no API call needed
    if (category === 'free') {
      setTemplates(FREE_TEMPLATES);
      setLoading(false);
      return;
    }

    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const data = await apiService.getTemplates(category);
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [category, categoryMeta, navigate]);

  const handleBuyNow = (template) => {
    // Load Midtrans Snap on demand (702 KiB — only when needed)
    if (!document.getElementById('midtrans-snap')) {
      const script = document.createElement('script');
      script.id = 'midtrans-snap';
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', process.env.REACT_APP_MIDTRANS_CLIENT_KEY || '');
      document.head.appendChild(script);
    }
    setSelectedTemplate(template);
    setCheckoutOpen(true);
  };

  const handleCheckout = async () => {
    if (!checkoutForm.name || !checkoutForm.email) {
      toast({
        title: 'Error',
        description: language === 'id' ? 'Nama dan email wajib diisi' : 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      const orderId = `TPL-${Date.now()}`;
      const amount = selectedTemplate.sale_price || selectedTemplate.price;

      const response = await apiService.createPaymentToken({
        order_id: orderId,
        gross_amount: amount,
        customer_email: checkoutForm.email,
        customer_name: checkoutForm.name,
        customer_phone: checkoutForm.phone,
        item_details: [{
          id: selectedTemplate.id,
          price: amount,
          quantity: 1,
          name: selectedTemplate.name,
        }],
      });

      if (response.token && window.snap) {
        window.snap.pay(response.token, {
          onSuccess: () => {
            toast({
              title: language === 'id' ? 'Pembayaran Berhasil!' : 'Payment Successful!',
              description: language === 'id' ? 'Link download akan dikirim ke email Anda' : 'Download link will be sent to your email',
            });
            setCheckoutOpen(false);
          },
          onPending: () => {
            toast({
              title: language === 'id' ? 'Menunggu Pembayaran' : 'Waiting for Payment',
              description: language === 'id' ? 'Silakan selesaikan pembayaran Anda' : 'Please complete your payment',
            });
          },
          onError: () => {
            toast({
              title: 'Error',
              description: language === 'id' ? 'Pembayaran gagal' : 'Payment failed',
              variant: 'destructive',
            });
          },
          onClose: () => {
            setProcessing(false);
          },
        });
      } else if (response.redirect_url) {
        window.open(response.redirect_url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Checkout failed',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleWhatsAppOrder = (template) => {
    const amount = template.sale_price || template.price;
    const message = encodeURIComponent(
      `Halo Calius Digital, saya tertarik membeli template "${template.name}" seharga ${formatPrice(amount)}. Mohon info lebih lanjut.`
    );
    window.open(`https://wa.me/628126067561?text=${message}`, '_blank');
  };

  // If category is invalid, don't render (will redirect)
  if (!categoryMeta) return null;

  const categoryLabel = language === 'id' ? categoryMeta.label_id : categoryMeta.label_en;
  const categoryDescription = language === 'id' ? categoryMeta.description_id : categoryMeta.description_en;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
            <Link to="/" className="hover:text-white transition-colors">
              {t('nav.home')}
            </Link>
            <ChevronRight size={14} />
            <Link to="/templates" className="hover:text-white transition-colors">
              {t('nav.templates')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#FF4500]">{categoryLabel}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/templates"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
              aria-label="Back to templates"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{categoryMeta.icon}</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {language === 'id' ? 'Template' : ''} {categoryLabel} {language === 'en' ? 'Templates' : ''}
                </h1>
              </div>
              <p className="text-lg text-neutral-400 mt-2 ml-12">{categoryDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Pills */}
      <section className="py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.values(CATEGORY_META).map((cat) => (
              <Link
                key={cat.slug}
                to={`/templates/${cat.slug}`}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  category === cat.slug
                    ? 'bg-[#FF4500] text-white'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.icon} {language === 'id' ? cat.label_id : cat.label_en}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-neutral-800 h-96" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl mb-6 block">{categoryMeta.icon}</span>
              <h3 className="text-xl font-semibold text-white mb-2">
                {language === 'id' ? 'Belum ada template' : 'No templates yet'}
              </h3>
              <p className="text-neutral-400 mb-6">
                {language === 'id'
                  ? `Template ${categoryLabel} sedang dalam pengembangan. Nantikan segera!`
                  : `${categoryLabel} templates are under development. Coming soon!`}
              </p>
              <Link to="/templates">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ArrowLeft size={16} className="mr-2" />
                  {language === 'id' ? 'Kembali ke Template' : 'Back to Templates'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => template.is_free ? (
                // ── Free Template Card ──
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-neutral-900 to-blue-900/30 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={template.image}
                      alt={language === 'id' ? template.name_id : template.name}
                      width="400" height="224"
                      loading="lazy" decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        {language === 'id' ? 'GRATIS 100%' : 'FREE 100%'}
                      </span>
                      {template.is_new && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/90 text-white">NEW</span>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-purple-900/80 via-black/60 to-blue-900/80 backdrop-blur-sm">
                      <a href={template.demo_url} target="_blank" rel="noopener noreferrer"
                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
                        title={language === 'id' ? 'Lihat Demo' : 'View Demo'}>
                        <ExternalLink size={20} />
                      </a>
                      <a href={template.download_url} download
                        className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all shadow-lg"
                        title="Download">
                        <Download size={20} />
                      </a>
                    </div>
                  </div>
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                        {language === 'id' ? 'Template Gratis' : 'Free Template'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">MIT License</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {language === 'id' ? template.name_id : template.name}
                    </h3>
                    <p className="text-sm text-neutral-300 line-clamp-2 mb-4">
                      {language === 'id' ? template.description_id : template.description}
                    </p>
                    <div className="space-y-2 mb-5">
                      {template.features?.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs text-neutral-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <a href={template.demo_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all shadow-lg shadow-purple-500/25">
                        <ExternalLink size={16} />
                        {language === 'id' ? 'Lihat Demo' : 'View Demo'}
                      </a>
                      <div className="grid grid-cols-2 gap-2">
                        <a href={template.download_url} download
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all border border-white/10">
                          <Download size={14} />
                          Download
                        </a>
                        <a href={template.github_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all border border-white/10">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // ── Regular Template Card ──
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-[#FF4500]/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={optimizeImageUrl(template.image)}
                      alt={template.name}
                      width="400"
                      height="224"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {template.is_featured && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#FF4500] text-white">
                          {t('templates.featured')}
                        </span>
                      )}
                      {template.is_bestseller && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500 text-white">
                          {t('templates.bestseller')}
                        </span>
                      )}
                      {template.is_new && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                          {t('templates.new')}
                        </span>
                      )}
                      {template.sale_price && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                          {t('templates.sale')}
                        </span>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                      <Link
                        to={`/templates/${category}/${template.slug}`}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        <ExternalLink size={20} />
                      </Link>
                      <button
                        onClick={() => handleBuyNow(template)}
                        className="p-3 rounded-full bg-[#FF4500] hover:bg-[#FF5722] text-white transition-colors"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        {categoryLabel}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400" fill="currentColor" />
                        <span className="text-sm text-neutral-400">{template.rating}</span>
                      </div>
                    </div>

                    <Link to={`/templates/${category}/${template.slug}`}>
                      <h3 className="text-lg font-bold text-white mb-2 hover:text-[#FF4500] transition-colors">
                        {template.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                      {language === 'id' ? template.description_id : template.description_en}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.technologies?.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-1 text-xs bg-white/5 text-neutral-400 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Price & Downloads */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        {template.sale_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-[#FF4500]">{formatPrice(template.sale_price)}</span>
                            <span className="text-sm text-neutral-500 line-through">{formatPrice(template.price)}</span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-[#FF4500]">{formatPrice(template.price)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-neutral-500">
                        <Download size={14} />
                        <span className="text-xs">{template.downloads}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <Link to={`/templates/${category}/${template.slug}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg"
                        >
                          {t('templates.viewDemo')}
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleBuyNow(template)}
                        className="flex-1 bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-lg"
                      >
                        {t('templates.buyNow')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout - {selectedTemplate?.name}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {language === 'id' ? 'Lengkapi data untuk melanjutkan pembayaran' : 'Complete your details to proceed with payment'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name" className="text-neutral-300">{t('contact.name')}</Label>
              <Input
                id="name"
                value={checkoutForm.name}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                className="bg-neutral-800 border-white/10 text-white mt-1"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-neutral-300">{t('contact.email')}</Label>
              <Input
                id="email"
                type="email"
                value={checkoutForm.email}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                className="bg-neutral-800 border-white/10 text-white mt-1"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-neutral-300">{t('contact.phone')}</Label>
              <Input
                id="phone"
                value={checkoutForm.phone}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                className="bg-neutral-800 border-white/10 text-white mt-1"
                placeholder="+62xxx"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-400">Total</span>
                <span className="text-2xl font-bold text-[#FF4500]">
                  {formatPrice(selectedTemplate?.sale_price || selectedTemplate?.price || 0)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-[#FF4500] hover:bg-[#FF5722] text-white h-12 font-semibold"
              >
                {processing
                  ? (language === 'id' ? 'Memproses...' : 'Processing...')
                  : (language === 'id' ? 'Bayar Sekarang' : 'Pay Now')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateCategoryPage;
