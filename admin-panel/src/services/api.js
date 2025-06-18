import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/crm/auth/login', credentials),
    getProfile: () => api.get('/crm/auth/profile'),
    updateProfile: (data) => api.put('/crm/auth/profile', data),
    changePassword: (data) => api.put('/crm/auth/change-password', data)
};

// Customers API
export const customersAPI = {
    getAll: (params) => api.get('/crm/customers', { params }),
    getById: (id) => api.get(`/crm/customers/${id}`),
    create: (data) => api.post('/crm/customers', data),
    update: (id, data) => api.put(`/crm/customers/${id}`, data),
    delete: (id) => api.delete(`/crm/customers/${id}`)
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/crm/products', { params }),
    getById: (id) => api.get(`/crm/products/${id}`),
    create: (data) => api.post('/crm/products', data),
    update: (id, data) => api.put(`/crm/products/${id}`, data),
    delete: (id) => api.delete(`/crm/products/${id}`)
};

// Orders API
export const ordersAPI = {
    getAll: (params) => api.get('/crm/orders', { params }),
    getById: (id) => api.get(`/crm/orders/${id}`),
    create: (data) => api.post('/crm/orders', data),
    update: (id, data) => api.put(`/crm/orders/${id}`, data),
    delete: (id) => api.delete(`/crm/orders/${id}`),
    getStats: (params) => api.get('/crm/orders/stats/overview', { params })
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/crm/dashboard/stats')
};

export default api; 