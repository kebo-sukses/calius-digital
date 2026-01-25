import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Building2, ShoppingCart, Rocket, Code2, ChevronRight, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';

const iconMap = {
  Building2: Building2,
  ShoppingCart: ShoppingCart,
  Rocket: Rocket,
  Code2: Code2,
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const HomePage = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, templatesData, testimonialsData, portfolioData] = await Promise.all([
          apiService.getServices(),
          apiService.getTemplates(),
          apiService.getTestimonials(),
          apiService.getPortfolio(),
        ]);
        setServices((servicesData || []).slice(0, 4));
        setTemplates((templatesData || []).filter(t => t.is_featured).slice(0, 3));
        setTestimonials((testimonialsData || []).slice(0, 3));
        setPortfolio((portfolioData || []).filter(p => p.is_featured).slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#050505]">
      {/* Hero Section */}
      <section data-testid="hero-section" className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF4500]/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#FF4500]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#FF4500]/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
              <span className="text-sm text-neutral-300">{t('hero.badge')}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              {t('hero.title')}{' '}
              <span className="text-gradient">{t('hero.titleHighlight')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button
                  data-testid="hero-cta-primary"
                  size="lg"
                  className="bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-full px-8 h-14 text-base font-semibold group"
                >
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button
                  data-testid="hero-cta-secondary"
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-14 text-base font-semibold border-white/20 text-white hover:bg-white/10"
                >
                  {t('hero.ctaSecondary')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-neutral-500">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">40+</div>
                <div className="text-neutral-500">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">3+</div>
                <div className="text-neutral-500">Years Experience</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section data-testid="services-section" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('services.title')}</h2>
            <p className="text-lg text-neutral-400">{t('services.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Building2;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    data-testid={`service-card-${service.slug}`}
                    className="block h-full p-8 rounded-2xl bg-neutral-900/50 border border-white/10 hover:border-[#FF4500]/50 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center mb-6">
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {language === 'id' ? service.name_id : service.name_en}
                    </h3>
                    <p className="text-neutral-400 mb-4 line-clamp-2">
                      {language === 'id' ? service.description_id : service.description_en}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">
                        {t('services.startFrom')} <span className="text-[#FF4500] font-semibold">{formatPrice(service.price_start)}</span>
                      </span>
                      <ChevronRight className="text-neutral-500 group-hover:text-[#FF4500] group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" className="rounded-full px-8 border-white/20 text-white hover:bg-white/10">
                {t('services.viewDetails')}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section data-testid="templates-section" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('templates.title')}</h2>
            <p className="text-lg text-neutral-400">{t('templates.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`template-card-${template.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-[#FF4500]/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
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
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm text-neutral-400">{template.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                    {language === 'id' ? template.description_id : template.description_en}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {template.sale_price ? (
                        <>
                          <span className="text-lg font-bold text-[#FF4500]">{formatPrice(template.sale_price)}</span>
                          <span className="text-sm text-neutral-500 line-through">{formatPrice(template.price)}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-[#FF4500]">{formatPrice(template.price)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-neutral-500">
                      <Download size={14} />
                      <span className="text-xs">{template.downloads}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/templates">
              <Button className="bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-full px-8">
                {language === 'id' ? 'Lihat Semua Template' : 'View All Templates'}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section data-testid="portfolio-section" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('portfolio.title')}</h2>
            <p className="text-lg text-neutral-400">{t('portfolio.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`portfolio-item-${item.id}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-xs text-[#FF4500] font-semibold uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-xl font-bold text-white mt-2">{item.title}</h3>
                    <p className="text-neutral-400 mt-1">{item.client}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/portfolio">
              <Button variant="outline" className="rounded-full px-8 border-white/20 text-white hover:bg-white/10">
                {t('portfolio.viewProject')}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section data-testid="testimonials-section" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('testimonials.title')}</h2>
            <p className="text-lg text-neutral-400">{t('testimonials.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`testimonial-${testimonial.id}`}
                className="p-8 rounded-2xl bg-neutral-900/50 border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-neutral-300 mb-6 leading-relaxed">
                  "{language === 'id' ? testimonial.content_id : testimonial.content_en}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-neutral-500">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-testid="cta-section" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-lg text-neutral-400 mb-10">{t('cta.subtitle')}</p>
          <Link to="/contact">
            <Button
              data-testid="cta-button"
              size="lg"
              className="bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-full px-10 h-14 text-base font-semibold glow"
            >
              {t('cta.button')}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

