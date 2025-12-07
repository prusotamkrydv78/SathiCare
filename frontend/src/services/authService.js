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
            if (response.data.success) {
                localStorage.setItem('sathi_user', JSON.stringify(response.data.data.user));
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw error;
            }
            console.warn("Backend not found. Using Mock Signup.");
            await delay(800);
            const mockResponse = { data: { user: { ...MOCK_USER, ...userData } } };
            localStorage.setItem('sathi_user', JSON.stringify(mockResponse.data.user));
            return mockResponse;
        }
    },

    // POST /api/auth/login
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.success) {
                localStorage.setItem('sathi_user', JSON.stringify(response.data.data.user));
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                // Re-throw server errors
                throw error;
            }
            console.warn("Backend not found. Using Mock Login.");
            await delay(800);
            const mockResponse = { data: { user: MOCK_USER, token: 'mock-jwt-token' } };
            localStorage.setItem('sathi_user', JSON.stringify(mockResponse.data.user));
            return mockResponse;
        }
    },

    // POST /api/auth/logout
    logout: async () => {
        localStorage.removeItem('sathi_user');
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
            if (response.data.success) {
                localStorage.setItem('sathi_user', JSON.stringify(response.data.data.user));
            }
            return response.data;
        } catch (error) {
            // If backend is reachable but token is invalid (401), clear local storage
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('sathi_user');
                return { data: { user: null } };
            }

            // If backend is unreachable (Network Error) or other error, try to restore from local storage
            const storedUser = localStorage.getItem('sathi_user');
            if (storedUser) {
                try {
                    return { data: { user: JSON.parse(storedUser) } };
                } catch (e) {
                    localStorage.removeItem('sathi_user');
                }
            }

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
