import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/api';

const categories = [
  { id: 'all', label_id: 'Semua', label_en: 'All' },
  { id: 'company-profile', label_id: 'Company Profile', label_en: 'Company Profile' },
  { id: 'e-commerce', label_id: 'E-Commerce', label_en: 'E-Commerce' },
  { id: 'landing-page', label_id: 'Landing Page', label_en: 'Landing Page' },
  { id: 'restaurant', label_id: 'Restoran', label_en: 'Restaurant' },
];

const PortfolioPage = () => {
  const { t, language } = useLanguage();
  const [portfolio, setPortfolio] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const data = await apiService.getPortfolio(activeCategory);
        setPortfolio(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('portfolio.title')}</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">{t('portfolio.subtitle')}</p>
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

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-neutral-800 h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`portfolio-${item.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    
                    {/* Hover Overlay */}
                    {item.url && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 rounded-full bg-[#FF4500] hover:bg-[#FF5722] text-white transition-colors"
                        >
                          <ExternalLink size={24} />
                        </a>
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-xs text-[#FF4500] font-semibold uppercase tracking-wider">
                        {item.category.replace('-', ' ')}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">{item.title}</h3>
                      <p className="text-neutral-400 mt-1">{item.client}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-neutral-400 text-sm mb-4">
                      {language === 'id' ? item.description_id : item.description_en}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-1 text-xs bg-white/5 text-neutral-400 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
