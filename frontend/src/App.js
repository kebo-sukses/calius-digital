import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";

// Public Pages
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import TemplatesPage from "@/pages/TemplatesPage";
import PortfolioPage from "@/pages/PortfolioPage";
import PricingPage from "@/pages/PricingPage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTemplates from "@/pages/admin/AdminTemplates";
import AdminPortfolio from "@/pages/admin/AdminPortfolio";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminPricing from "@/pages/admin/AdminPricing";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminServices from "@/pages/admin/AdminServices";

// Load Midtrans Snap script
const loadMidtransScript = () => {
  const existingScript = document.getElementById('midtrans-snap');
  if (existingScript) return;

  const script = document.createElement('script');
  script.id = 'midtrans-snap';
  script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
  script.setAttribute('data-client-key', process.env.REACT_APP_MIDTRANS_CLIENT_KEY || '');
  document.head.appendChild(script);
};

function App() {
  useEffect(() => {
    loadMidtransScript();
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <SiteSettingsProvider>
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/services/:slug" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/templates" element={<Layout><TemplatesPage /></Layout>} />
            <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
            <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
            <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="templates" element={<AdminTemplates />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
            <Toaster />
          </BrowserRouter>
        </SiteSettingsProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;