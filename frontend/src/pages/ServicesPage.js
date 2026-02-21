import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, ShoppingCart, Rocket, Code2, Check, ArrowRight, X,
  Layout, FileText, Image, Utensils, Briefcase, Globe, Smartphone,
  Database, Server, Layers, PenTool, Camera, Monitor, Zap, ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';

const iconMap = {
  Building2: Building2,
  ShoppingCart: ShoppingCart,
  Rocket: Rocket,
  Code2: Code2,
  Code: Code2,
  Layout: Layout,
  FileText: FileText,
  Image: Image,
  Utensils: Utensils,
  Briefcase: Briefcase,
  Globe: Globe,
  Smartphone: Smartphone,
  Database: Database,
  Server: Server,
  Layers: Layers,
  PenTool: PenTool,
  Camera: Camera,
  Monitor: Monitor,
  Zap: Zap,
};

// Template category labels for display
const templateCategoryLabels = {
  'business': { id: 'Template Bisnis', en: 'Business Templates' },
  'ecommerce': { id: 'Template E-Commerce', en: 'E-Commerce Templates' },
  'portfolio': { id: 'Template Portfolio', en: 'Portfolio Templates' },
  'landing-page': { id: 'Template Landing Page', en: 'Landing Page Templates' },
  'restaurant': { id: 'Template Restoran', en: 'Restaurant Templates' },
  'blog': { id: 'Template Blog', en: 'Blog Templates' },
  'creative': { id: 'Template Kreatif', en: 'Creative Templates' },
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const ServicesPage = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiService.getServices();
        setServices(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('services.title')}</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-neutral-800 h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Building2;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    data-testid={`service-${service.slug}`}
                    className="p-8 rounded-2xl bg-neutral-900/50 border border-white/10 hover:border-[#FF4500]/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-white" size={32} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {language === 'id' ? service.name_id : service.name_en}
                        </h3>
                        <p className="text-neutral-400 mb-6">
                          {language === 'id' ? service.description_id : service.description_en}
                        </p>

                        {/* Features */}
                        <ul className="space-y-2 mb-6">
                          {service.included_features && service.included_features.length > 0 ? (
                            // Use new included_features format
                            service.included_features.map((feature, i) => (
                              <li key={i} className={`flex items-center gap-2 ${feature.included ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                {feature.included ? (
                                  <Check size={16} className="text-[#FF4500]" />
                                ) : (
                                  <X size={16} className="text-neutral-600" />
                                )}
                                <span className={!feature.included ? 'line-through' : ''}>
                                  {language === 'id' ? feature.text_id : feature.text_en}
                                </span>
                              </li>
                            ))
                          ) : (
                            // Fallback to old features format
                            service.features?.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-neutral-300">
                                <Check size={16} className="text-[#FF4500]" />
                                <span>{feature}</span>
                              </li>
                            ))
                          )}
                        </ul>

                        {/* Price & CTA */}
                        <div className="pt-6 border-t border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-sm text-neutral-500">{t('services.startFrom')}</span>
                              <div className="text-2xl font-bold text-[#FF4500]">{formatPrice(service.price_start)}</div>
                            </div>
                            <Link to="/contact">
                              <Button className="bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-full">
                                {language === 'id' ? 'Konsultasi' : 'Consult'}
                                <ArrowRight className="ml-2" size={16} />
                              </Button>
                            </Link>
                          </div>
                          
                          {/* Template Link Button */}
                          {service.template_category && (
                            <Link to={`/templates?category=${service.template_category}`} className="block">
                              <Button 
                                variant="outline" 
                                className="w-full border-[#FF4500]/50 text-[#FF4500] hover:bg-[#FF4500]/10 rounded-full"
                              >
                                <ExternalLink className="mr-2" size={16} />
                                {language === 'id' 
                                  ? `Lihat ${templateCategoryLabels[service.template_category]?.id || 'Template'}`
                                  : `View ${templateCategoryLabels[service.template_category]?.en || 'Templates'}`
                                }
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {language === 'id' ? 'Butuh Solusi Custom?' : 'Need a Custom Solution?'}
          </h2>
          <p className="text-lg text-neutral-400 mb-10">
            {language === 'id'
              ? 'Hubungi kami untuk mendiskusikan kebutuhan website spesifik bisnis Anda.'
              : 'Contact us to discuss your specific website needs for your business.'}
          </p>
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-full px-10 h-14 text-base font-semibold"
            >
              {t('contact.whatsapp')}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
