import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { settings } = useSiteSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/services', label: t('nav.services') },
    { href: '/templates', label: t('nav.templates') },
    { href: '/portfolio', label: t('nav.portfolio') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="logo">
            {settings.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.site_name || 'Calius'} 
                className="h-10 w-auto object-contain"
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-xl font-bold text-white">{settings.site_name || 'Calius'}</span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-testid={`nav-link-${link.href.replace('/', '') || 'home'}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#FF4500] bg-white/10'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              data-testid="language-toggle"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Globe size={16} />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* CTA Button */}
            <Link to="/contact" className="hidden md:block">
              <Button
                data-testid="nav-cta"
                className="bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-full px-6 font-semibold"
              >
                {t('nav.getStarted')}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-toggle"
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-testid={`mobile-nav-${link.href.replace('/', '') || 'home'}`}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'text-[#FF4500] bg-white/10'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/contact" className="block pt-2">
                <Button
                  data-testid="mobile-cta"
                  className="w-full bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-full font-semibold"
                >
                  {t('nav.getStarted')}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
