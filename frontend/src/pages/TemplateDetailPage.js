import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Download,
  ShoppingCart,
  ChevronRight,
  ArrowLeft,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  MessageCircle,
  LayoutDashboard,
} from 'lucide-react';
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
 * Category label map for breadcrumb display
 */
const CATEGORY_LABELS = {
  business: { id: 'Bisnis', en: 'Business' },
  ecommerce: { id: 'E-Commerce', en: 'E-Commerce' },
  portfolio: { id: 'Portfolio', en: 'Portfolio' },
  'landing-page': { id: 'Landing Page', en: 'Landing Page' },
  restaurant: { id: 'Restoran', en: 'Restaurant' },
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const formatPriceUSD = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

const PREVIEW_MODES = [
  { key: 'desktop', icon: Monitor, width: '100%' },
  { key: 'tablet', icon: Tablet, width: '768px' },
  { key: 'mobile', icon: Smartphone, width: '375px' },
];

const TemplateDetailPage = () => {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '' });
  const [processing, setProcessing] = useState(false);

  const categoryLabel = CATEGORY_LABELS[category]
    ? (language === 'id' ? CATEGORY_LABELS[category].id : CATEGORY_LABELS[category].en)
    : category;

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const data = await apiService.getTemplate(slug);
        if (!data) {
          navigate('/templates', { replace: true });
          return;
        }
        setTemplate(data);
      } catch (error) {
        console.error('Error fetching template:', error);
        navigate('/templates', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug, navigate]);

  const handleBuyNow = () => {
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
      const amount = template.sale_price || template.price;

      const response = await apiService.createPaymentToken({
        order_id: orderId,
        gross_amount: amount,
        customer_email: checkoutForm.email,
        customer_name: checkoutForm.name,
        customer_phone: checkoutForm.phone,
        item_details: [{
          id: template.id,
          price: amount,
          quantity: 1,
          name: template.name,
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

  const handleWhatsAppOrder = () => {
    const amount = template.sale_price || template.price;
    const message = encodeURIComponent(
      `Halo Calius Digital, saya tertarik membeli template "${template.name}" seharga ${formatPrice(amount)}. Mohon info lebih lanjut.`
    );
    window.open(`https://wa.me/628126067561?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-neutral-800 rounded w-1/3" />
            <div className="h-10 bg-neutral-800 rounded w-2/3" />
            <div className="h-[500px] bg-neutral-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!template) return null;

  const activeMode = PREVIEW_MODES.find((m) => m.key === previewMode);
  const discount = template.sale_price
    ? Math.round(((template.price - template.sale_price) / template.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
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
            <Link to={`/templates/${category}`} className="hover:text-white transition-colors">
              {categoryLabel}
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#FF4500] truncate max-w-[200px]">{template.name}</span>
          </nav>

          <Link
            to={`/templates/${category}`}
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            {language === 'id' ? `Kembali ke ${categoryLabel}` : `Back to ${categoryLabel}`}
          </Link>
        </div>
      </section>

      {/* Main Content — Two Column Layout */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column — Preview & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Template Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 overflow-hidden bg-neutral-900"
              >
                {/* Preview Mode Toolbar */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-neutral-900/80">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-300">
                      {language === 'id' ? 'Pratinjau' : 'Preview'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-neutral-800 rounded-lg p-1">
                    {PREVIEW_MODES.map(({ key, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setPreviewMode(key)}
                        className={`p-2 rounded-md transition-all ${
                          previewMode === key
                            ? 'bg-[#FF4500] text-white'
                            : 'text-neutral-500 hover:text-white'
                        }`}
                        aria-label={`${key} preview`}
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Area */}
                <div className="bg-neutral-950 p-4 flex justify-center min-h-[500px]">
                  {template.demo_url ? (
                    <div
                      className="transition-all duration-300 h-[500px] bg-white rounded-lg overflow-hidden"
                      style={{ width: activeMode.width, maxWidth: '100%' }}
                    >
                      <iframe
                        src={template.demo_url}
                        title={`${template.name} preview`}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  ) : (
                    <div
                      className="transition-all duration-300 h-[500px] rounded-lg overflow-hidden"
                      style={{ width: activeMode.width, maxWidth: '100%' }}
                    >
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/10 p-8 bg-neutral-900"
              >
                <h2 className="text-xl font-bold text-white mb-4">
                  {language === 'id' ? 'Deskripsi' : 'Description'}
                </h2>
                <p className="text-neutral-400 leading-relaxed whitespace-pre-line">
                  {language === 'id'
                    ? (template.long_description_id || template.description_id)
                    : (template.long_description_en || template.description_en)}
                </p>
              </motion.div>

              {/* Features */}
              {template.features && template.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-white/10 p-8 bg-neutral-900"
                >
                  <h2 className="text-xl font-bold text-white mb-4">
                    {language === 'id' ? 'Fitur Utama' : 'Key Features'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded-full bg-[#FF4500]/10">
                          <Check size={14} className="text-[#FF4500]" />
                        </div>
                        <span className="text-neutral-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column — Sidebar */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-28 rounded-2xl border border-white/10 bg-neutral-900 overflow-hidden"
              >
                {/* Template Image Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover"
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
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Title & Rating */}
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{template.name}</h1>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400" fill="currentColor" />
                        <span className="text-white font-medium">{template.rating}</span>
                      </div>
                      <span className="text-neutral-500">|</span>
                      <div className="flex items-center gap-1 text-neutral-400">
                        <Download size={14} />
                        <span className="text-sm">{template.downloads} downloads</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="py-4 border-y border-white/10">
                    {template.sale_price ? (
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-[#FF4500]">
                            {formatPrice(template.sale_price)}
                          </span>
                          <span className="px-2 py-1 text-xs font-bold rounded bg-red-500/10 text-red-400">
                            -{discount}%
                          </span>
                        </div>
                        <span className="text-sm text-neutral-500 line-through">
                          {formatPrice(template.price)}
                        </span>
                        {template.sale_price_usd && (
                          <div className="mt-1 text-sm text-neutral-400">
                            {formatPriceUSD(template.sale_price_usd)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold text-[#FF4500]">
                          {formatPrice(template.price)}
                        </span>
                        {template.price_usd && (
                          <div className="mt-1 text-sm text-neutral-400">
                            {formatPriceUSD(template.price_usd)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tech Stack */}
                  {template.technologies && template.technologies.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                        {language === 'id' ? 'Teknologi' : 'Technologies'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {template.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs bg-white/5 text-neutral-300 rounded-full border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={handleBuyNow}
                      className="w-full bg-[#FF4500] hover:bg-[#FF5722] text-white h-12 font-semibold rounded-xl"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      {t('templates.buyNow')}
                    </Button>
                    <Button
                      onClick={handleWhatsAppOrder}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 h-12 font-semibold rounded-xl"
                    >
                      <MessageCircle size={18} className="mr-2" />
                      {language === 'id' ? 'Pesan via WhatsApp' : 'Order via WhatsApp'}
                    </Button>
                    {template.demo_url && (
                      <a
                        href={template.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="ghost"
                          className="w-full text-neutral-400 hover:text-white hover:bg-white/5 h-10"
                        >
                          <Eye size={16} className="mr-2" />
                          {language === 'id' ? 'Buka Demo Full' : 'Open Full Demo'}
                        </Button>
                      </a>
                    )}
                    {template.admin_url && (
                      <a
                        href={template.admin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="ghost"
                          className="w-full text-neutral-400 hover:text-white hover:bg-white/5 h-10"
                        >
                          <LayoutDashboard size={16} className="mr-2" />
                          {language === 'id' ? 'Lihat Admin Panel' : 'View Admin Panel'}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout - {template.name}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {language === 'id' ? 'Lengkapi data untuk melanjutkan pembayaran' : 'Complete your details to proceed with payment'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="detail-name" className="text-neutral-300">{t('contact.name')}</Label>
              <Input
                id="detail-name"
                value={checkoutForm.name}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                className="bg-neutral-800 border-white/10 text-white mt-1"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="detail-email" className="text-neutral-300">{t('contact.email')}</Label>
              <Input
                id="detail-email"
                type="email"
                value={checkoutForm.email}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                className="bg-neutral-800 border-white/10 text-white mt-1"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="detail-phone" className="text-neutral-300">{t('contact.phone')}</Label>
              <Input
                id="detail-phone"
                value={checkoutForm.phone}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                className="bg-neutral-800 border-white/10 text-white mt-1"
                placeholder="+62xxx"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-400">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#FF4500]">
                    {formatPrice(template.sale_price || template.price)}
                  </span>
                  {(template.sale_price_usd || template.price_usd) && (
                    <div className="text-sm text-neutral-400">
                      {formatPriceUSD(template.sale_price_usd || template.price_usd)}
                    </div>
                  )}
                </div>
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

export default TemplateDetailPage;
