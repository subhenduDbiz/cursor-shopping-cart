import axios from 'axios';
import { API_ENDPOINTS, FILE_BASE_URL } from '../config/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (data) => {
        // If data is FormData, don't set Content-Type header
        if (data instanceof FormData) {
            return api.post(API_ENDPOINTS.auth.register, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
        return api.post(API_ENDPOINTS.auth.register, data);
    },
    login: (data) => api.post(API_ENDPOINTS.auth.login, data),
    getCurrentUser: () => api.get(API_ENDPOINTS.auth.me),
    updateProfile: (data) => {
        if (data instanceof FormData) {
            return api.put(API_ENDPOINTS.auth.updateProfile, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
        return api.put(API_ENDPOINTS.auth.updateProfile, data);
    },
    changePassword: (data) => api.put(API_ENDPOINTS.auth.changePassword, data)
};

// Product API calls
export const productAPI = {
    getAll: (params) => api.get(API_ENDPOINTS.products.getAll, { params }),
    getById: (id) => api.get(API_ENDPOINTS.products.getById(id)),
    create: (data) => api.post(API_ENDPOINTS.products.create, data),
    update: (id, data) => api.put(API_ENDPOINTS.products.update(id), data),
    delete: (id) => api.delete(API_ENDPOINTS.products.delete(id))
};

// Cart API calls
export const cartAPI = {
    get: () => api.get(API_ENDPOINTS.cart.get),
    addItem: (data) => api.post(API_ENDPOINTS.cart.addItem, data),
    updateItem: (id, data) => api.put(API_ENDPOINTS.cart.updateItem(id), data),
    removeItem: (id) => api.delete(API_ENDPOINTS.cart.removeItem(id)),
    clear: () => api.delete(API_ENDPOINTS.cart.clear)
};

// Order API calls
export const orderAPI = {
    getAll: () => api.get(API_ENDPOINTS.orders.getAll),
    getById: (id) => api.get(API_ENDPOINTS.orders.getById(id)),
    create: (data) => api.post(API_ENDPOINTS.orders.create, data),
    update: (id, data) => api.put(API_ENDPOINTS.orders.update(id), data)
};

// Deal API calls
export const dealAPI = {
    getAll: () => api.get(API_ENDPOINTS.deals.getAll),
    getById: (id) => api.get(API_ENDPOINTS.deals.getById(id)),
    create: (data) => api.post(API_ENDPOINTS.deals.create, data),
    update: (id, data) => api.put(API_ENDPOINTS.deals.update(id), data),
    delete: (id) => api.delete(API_ENDPOINTS.deals.delete(id))
};

export default api; 