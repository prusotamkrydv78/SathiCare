import api from './api';

// Auth service matching backend/tests/auth.http endpoints
// Mock User for Fallback
const MOCK_USER = {
    id: 'mock-user-123',
    name: 'Sathi User',
    email: 'user@sathi.com',
    role: 'user',
    profile: {
        age: 28,
        location: 'Kathmandu',
        language: 'nepali'
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const authService = {
    // POST /api/auth/signup
    signup: async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw error;
            }
            console.warn("Backend not found. Using Mock Signup.");
            await delay(800);
            return { data: { user: { ...MOCK_USER, ...userData } } };
        }
    },

    // POST /api/auth/login
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            if (error.response) {
                // Re-throw server errors
                throw error;
            }
            console.warn("Backend not found. Using Mock Login.");
            await delay(800);
            return { data: { user: MOCK_USER, token: 'mock-jwt-token' } };
        }
    },

    // POST /api/auth/logout
    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            return { success: true };
        }
    },

    // GET /api/auth/me
    getMe: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            // Check if we have a mock token stored (simulated persistence)
            // For now, just return null to force login, or mock user if auto-login desired
            return { data: { user: null } };
        }
    },

    // POST /api/auth/refresh-token
    refreshToken: async () => {
        try {
            const response = await api.post('/auth/refresh-token');
            return response.data;
        } catch (error) {
            return { success: false };
        }
    }
};

export default authService;
