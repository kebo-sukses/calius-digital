import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const SiteSettingsContext = createContext(null);

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    logo_url: '',
    favicon_url: '',
    site_name: 'Calius',
    tagline: '',
    description: '',
    og_image_url: '',
    primary_color: '#FF4500',
    whatsapp_number: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiService.getSettings();
        if (response) {
          setSettings(prev => ({ ...prev, ...response }));
          
          // Update favicon dynamically
          if (response.favicon_url) {
            updateFavicon(response.favicon_url);
          }
          
          // Update document title
          if (response.site_name) {
            document.title = response.site_name;
          }
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateFavicon = (url) => {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(el => el.remove());

    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = url;
    document.head.appendChild(link);

    // Also add apple-touch-icon
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = url;
    document.head.appendChild(appleLink);
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export default SiteSettingsContext;
