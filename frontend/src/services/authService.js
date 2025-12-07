import api from './api';

// Auth service matching backend/tests/auth.http endpoints
const authService = {
    // POST /api/auth/signup
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    // POST /api/auth/login
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // POST /api/auth/logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // GET /api/auth/me
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // POST /api/auth/refresh-token
    refreshToken: async () => {
        const response = await api.post('/auth/refresh-token');
        return response.data;
    }
};

export default authService;
