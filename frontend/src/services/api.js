import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'https://calius-digital-production.up.railway.app';
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

export const apiService = {
  // Services
  getServices: () => api.get('/services').then(res => res.data),
  getService: (slug) => api.get(`/services/${slug}`).then(res => res.data),
  
  // Templates
  getTemplates: (category) => {
    const params = category && category !== 'all' ? { category } : {};
    return api.get('/templates', { params }).then(res => res.data);
  },
  getTemplate: (slug) => api.get(`/templates/${slug}`).then(res => res.data),
  
  // Portfolio
  getPortfolio: (category) => {
    const params = category && category !== 'all' ? { category } : {};
    return api.get('/portfolio', { params }).then(res => res.data);
  },
  
  // Testimonials
  getTestimonials: () => api.get('/testimonials').then(res => res.data),
  
  // Blog
  getBlogPosts: (category, limit = 10) => {
    const params = { limit };
    if (category && category !== 'all') params.category = category;
    return api.get('/blog', { params }).then(res => res.data);
  },
  getBlogPost: (slug) => api.get(`/blog/${slug}`).then(res => res.data),
  
  // Pricing
  getPricing: () => api.get('/pricing').then(res => res.data),
  
  // Contact
  submitContact: (data) => api.post('/contact', data).then(res => res.data),
  
  // Payments
  createPaymentToken: (data) => api.post('/payments/create-token', data).then(res => res.data),
  getPaymentStatus: (orderId) => api.get(`/payments/status/${orderId}`).then(res => res.data),
  getMidtransConfig: () => api.get('/config/midtrans').then(res => res.data)
};

export default apiService;

