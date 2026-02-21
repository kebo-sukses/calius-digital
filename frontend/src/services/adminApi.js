import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Stats
  getStats: () => api.get('/admin/stats').then(res => res.data),

  // Users
  getUsers: () => api.get('/admin/users').then(res => res.data),
  createUser: (data) => api.post('/auth/register', data).then(res => res.data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data).then(res => res.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(res => res.data),

  // Services
  getServices: () => api.get('/services').then(res => res.data),
  createService: (data) => api.post('/admin/services', data).then(res => res.data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data).then(res => res.data),
  deleteService: (id) => api.delete(`/admin/services/${id}`).then(res => res.data),

  // Templates
  getTemplates: () => api.get('/templates').then(res => res.data),
  createTemplate: (data) => api.post('/admin/templates', data).then(res => res.data),
  updateTemplate: (id, data) => api.put(`/admin/templates/${id}`, data).then(res => res.data),
  deleteTemplate: (id) => api.delete(`/admin/templates/${id}`).then(res => res.data),

  // Portfolio
  getPortfolio: () => api.get('/portfolio').then(res => res.data),
  createPortfolio: (data) => api.post('/admin/portfolio', data).then(res => res.data),
  updatePortfolio: (id, data) => api.put(`/admin/portfolio/${id}`, data).then(res => res.data),
  deletePortfolio: (id) => api.delete(`/admin/portfolio/${id}`).then(res => res.data),

  // Blog
  getBlog: () => api.get('/blog').then(res => res.data),
  createBlog: (data) => api.post('/admin/blog', data).then(res => res.data),
  updateBlog: (id, data) => api.put(`/admin/blog/${id}`, data).then(res => res.data),
  deleteBlog: (id) => api.delete(`/admin/blog/${id}`).then(res => res.data),

  // Testimonials
  getTestimonials: () => api.get('/testimonials').then(res => res.data),
  createTestimonial: (data) => api.post('/admin/testimonials', data).then(res => res.data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data).then(res => res.data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`).then(res => res.data),

  // Pricing
  getPricing: () => api.get('/pricing').then(res => res.data),
  createPricing: (data) => api.post('/admin/pricing', data).then(res => res.data),
  updatePricing: (id, data) => api.put(`/admin/pricing/${id}`, data).then(res => res.data),
  deletePricing: (id) => api.delete(`/admin/pricing/${id}`).then(res => res.data),

  // Contacts
  getContacts: () => api.get('/admin/contacts').then(res => res.data),
  markContactRead: (id) => api.put(`/admin/contacts/${id}/read`).then(res => res.data),
  deleteContact: (id) => api.delete(`/admin/contacts/${id}`).then(res => res.data),

  // Orders
  getOrders: () => api.get('/admin/orders').then(res => res.data),
  getOrder: (id) => api.get(`/admin/orders/${id}`).then(res => res.data),

  // Export
  exportData: (type) => api.get(`/admin/export/${type}`).then(res => res.data),

  // Cloudinary
  getCloudinarySignature: (folder = 'calius') => 
    api.get(`/cloudinary/signature?folder=${folder}`).then(res => res.data),
};

export const uploadToCloudinary = async (file, folder = 'calius') => {
  const sig = await adminApi.getCloudinarySignature(folder);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.api_key);
  formData.append('timestamp', sig.timestamp);
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
    { method: 'POST', body: formData }
  );

  return response.json();
};

export default adminApi;

