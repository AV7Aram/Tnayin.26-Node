import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

// Cart API
export const cartAPI = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addToCart: (userId, productId, quantity = 1) =>
    api.post(`/cart/${userId}/add`, { productId, quantity }),
  updateCart: (userId, items) => api.put(`/cart/${userId}`, { items }),
  clearCart: (userId) => api.delete(`/cart/${userId}`),
};

// Users API
export const usersAPI = {
  get: (id) => api.get(`/users/${id}`),
  uploadAvatar: (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(`/users/${id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).catch((error) => {
        if (error.response?.data?.error === 'File size exceeds the 10MB limit') {
            throw new Error('Файл слишком большой. Максимальный размер 10MB.');
        }
        throw error;
    });
  },
  deleteAvatar: (id) => api.delete(`/users/${id}/avatar`)
};

api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.email && user.password) {
          const auth = btoa(`${user.email}:${user.password}`);
          config.headers.Authorization = `Basic ${auth}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;