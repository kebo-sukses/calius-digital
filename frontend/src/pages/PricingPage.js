import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const PricingPage = () => {
  const { t, language } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await apiService.getPricing();
        setPackages(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('pricing.title')}</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-neutral-800 h-[500px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`pricing-${pkg.id}`}
                  className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                    pkg.is_popular
                      ? 'bg-gradient-to-b from-[#FF4500]/20 to-neutral-900 border-[#FF4500]/50 scale-105'
                      : 'bg-neutral-900/50 border-white/10 hover:border-[#FF4500]/30'
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.is_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-[#FF4500] text-white">
                        {t('pricing.popular')}
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {language === 'id' ? pkg.name_id : pkg.name_en}
                    </h3>
                    <p className="text-neutral-400 text-sm">
                      {language === 'id' ? pkg.description_id : pkg.description_en}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-white mb-2">{formatPrice(pkg.price)}</div>
                    <span className="text-sm text-neutral-500">
                      {language === 'id' ? pkg.price_note_id : pkg.price_note_en}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check size={18} className="text-[#FF4500] flex-shrink-0" />
                        ) : (
                          <X size={18} className="text-neutral-600 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-neutral-300' : 'text-neutral-600'}>
                          {language === 'id' ? feature.text_id : feature.text_en}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to="/contact">
                    <Button
                      data-testid={`pricing-cta-${pkg.id}`}
                      className={`w-full h-12 rounded-xl font-semibold ${
                        pkg.is_popular
                          ? 'bg-[#FF4500] hover:bg-[#FF5722] text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {t('pricing.getStarted')}
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ / Note */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'id' ? 'Ada Pertanyaan?' : 'Have Questions?'}
          </h2>
          <p className="text-neutral-400 mb-8">
            {language === 'id'
              ? 'Harga di atas adalah estimasi. Harga final tergantung pada kompleksitas dan fitur yang dibutuhkan. Hubungi kami untuk konsultasi gratis.'
              : 'Prices above are estimates. Final price depends on complexity and required features. Contact us for free consultation.'}
          </p>
          <Link to="/contact">
            <Button className="bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-full px-8">
              {language === 'id' ? 'Konsultasi Gratis' : 'Free Consultation'}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
