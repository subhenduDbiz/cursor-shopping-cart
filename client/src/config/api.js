const API_VERSION = 'v1';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FILE_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// API Endpoints
const API_ENDPOINTS = {
    // Auth endpoints
    auth: {
        register: `${BASE_URL}/${API_VERSION}/auth/register`,
        login: `${BASE_URL}/${API_VERSION}/auth/login`,
        me: `${BASE_URL}/${API_VERSION}/auth/me`,
        updateProfile: `${BASE_URL}/${API_VERSION}/auth/profile`,
        changePassword: `${BASE_URL}/${API_VERSION}/auth/password`
    },
    // Product endpoints
    products: {
        getAll: `${BASE_URL}/${API_VERSION}/products`,
        getById: (id) => `${BASE_URL}/${API_VERSION}/products/${id}`,
        create: `${BASE_URL}/${API_VERSION}/products`,
        update: (id) => `${BASE_URL}/${API_VERSION}/products/${id}`,
        delete: (id) => `${BASE_URL}/${API_VERSION}/products/${id}`
    },
    // Cart endpoints
    cart: {
        get: `${BASE_URL}/${API_VERSION}/cart`,
        addItem: `${BASE_URL}/${API_VERSION}/cart`,
        updateItem: (id) => `${BASE_URL}/${API_VERSION}/cart/${id}`,
        removeItem: (id) => `${BASE_URL}/${API_VERSION}/cart/${id}`,
        clear: `${BASE_URL}/${API_VERSION}/cart/clear`
    },
    // Order endpoints
    orders: {
        getAll: `${BASE_URL}/${API_VERSION}/orders`,
        getById: (id) => `${BASE_URL}/${API_VERSION}/orders/${id}`,
        create: `${BASE_URL}/${API_VERSION}/orders`,
        update: (id) => `${BASE_URL}/${API_VERSION}/orders/${id}`
    },
    // Deal endpoints
    deals: {
        getAll: `${BASE_URL}/${API_VERSION}/deals`,
        getById: (id) => `${BASE_URL}/${API_VERSION}/deals/${id}`,
        create: `${BASE_URL}/${API_VERSION}/deals`,
        update: (id) => `${BASE_URL}/${API_VERSION}/deals/${id}`,
        delete: (id) => `${BASE_URL}/${API_VERSION}/deals/${id}`
    }
};

export { API_ENDPOINTS, FILE_BASE_URL }; 