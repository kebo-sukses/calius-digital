import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";

// Public Pages - lazy loaded for code splitting
const HomePage = lazy(() => import("@/pages/HomePage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const TemplatesPage = lazy(() => import("@/pages/TemplatesPage"));
const TemplateCategoryPage = lazy(() => import("@/pages/TemplateCategoryPage"));
const TemplateDetailPage = lazy(() => import("@/pages/TemplateDetailPage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetailPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

// Admin Pages - lazy loaded (never loaded for regular visitors)
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminTemplates = lazy(() => import("@/pages/admin/AdminTemplates"));
const AdminPortfolio = lazy(() => import("@/pages/admin/AdminPortfolio"));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog"));
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials"));
const AdminPricing = lazy(() => import("@/pages/admin/AdminPricing"));
const AdminContacts = lazy(() => import("@/pages/admin/AdminContacts"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminServices = lazy(() => import("@/pages/admin/AdminServices"));

// Minimal loading spinner - avoids layout shift
const PageLoader = () => (
  <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 32, height: 32, border: '2px solid #FF4500', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

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
    <HelmetProvider>
    <AuthProvider>
      <LanguageProvider>
        <SiteSettingsProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/services/:slug" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/templates" element={<Layout><TemplatesPage /></Layout>} />
            <Route path="/templates/:category" element={<Layout><TemplateCategoryPage /></Layout>} />
            <Route path="/templates/:category/:slug" element={<Layout><TemplateDetailPage /></Layout>} />
            <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
            <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
            <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogDetailPage /></Layout>} />
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
            </Suspense>
            <Toaster />
          </BrowserRouter>
        </SiteSettingsProvider>
      </LanguageProvider>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;