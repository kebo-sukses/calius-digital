import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Download, ExternalLink, ShoppingCart } from 'lucide-react';
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const categories = [
  { id: 'all', label_id: 'Semua', label_en: 'All' },
  { id: 'business', label_id: 'Bisnis', label_en: 'Business' },
  { id: 'ecommerce', label_id: 'E-Commerce', label_en: 'E-Commerce' },
  { id: 'portfolio', label_id: 'Portfolio', label_en: 'Portfolio' },
  { id: 'landing-page', label_id: 'Landing Page', label_en: 'Landing Page' },
  { id: 'restaurant', label_id: 'Restoran', label_en: 'Restaurant' },
];

const TemplatesPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const data = await apiService.getTemplates(activeCategory);
        setTemplates(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [activeCategory]);

  const handleBuyNow = (template) => {
    setSelectedTemplate(template);
    setCheckoutOpen(true);
  };

  const handleCheckout = async () => {
    if (!checkoutForm.name || !checkoutForm.email) {
      toast({
        title: language === 'id' ? 'Error' : 'Error',
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
      } else {
        // Fallback to redirect URL
        if (response.redirect_url) {
          window.open(response.redirect_url, '_blank');
        }
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

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('templates.title')}</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">{t('templates.subtitle')}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                data-testid={`filter-${cat.id}`}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#FF4500] text-white'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {language === 'id' ? cat.label_id : cat.label_en}
              </button>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`template-card-${template.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-[#FF4500]/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
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
                      {template.demo_url && (
                        <a
                          href={template.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
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
                        {template.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400" fill="currentColor" />
                        <span className="text-sm text-neutral-400">{template.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
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

                    {/* Price & Actions */}
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
                      <Button
                        onClick={() => handleBuyNow(template)}
                        data-testid={`buy-${template.slug}`}
                        className="flex-1 bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-lg"
                      >
                        {t('templates.buyNow')}
                      </Button>
                      <Button
                        onClick={() => handleWhatsAppOrder(template)}
                        variant="outline"
                        className="px-4 border-white/20 text-white hover:bg-white/10 rounded-lg"
                      >
                        WA
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
                data-testid="checkout-submit"
                className="w-full bg-[#FF4500] hover:bg-[#FF5722] text-white h-12 font-semibold"
              >
                {processing ? (language === 'id' ? 'Memproses...' : 'Processing...') : (language === 'id' ? 'Bayar Sekarang' : 'Pay Now')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesPage;
