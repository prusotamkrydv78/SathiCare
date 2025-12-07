import api from './api';

const periodService = {
    // ============ CRUD Operations ============

    // Log a new period
    logPeriod: async (periodData) => {
        try {
            const response = await api.post('/period/log', periodData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get period history with pagination
    getHistory: async (page = 1, limit = 6) => {
        try {
            const response = await api.get(`/period/history?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get current cycle status
    getCurrentCycle: async () => {
        try {
            const response = await api.get('/period/current');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get cycle statistics
    getStats: async () => {
        try {
            const response = await api.get('/period/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update a period cycle
    updatePeriod: async (id, periodData) => {
        try {
            const response = await api.put(`/period/${id}`, periodData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete a period cycle
    deletePeriod: async (id) => {
        try {
            const response = await api.delete(`/period/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ AI-Powered Operations ============

    // Get AI prediction for next period
    getPredictions: async () => {
        try {
            const response = await api.get('/period/ai/predict');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get AI cycle pattern analysis
    getAIAnalysis: async () => {
        try {
            const response = await api.get('/period/ai/analyze');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get AI symptom relief tips
    getAISymptomTips: async (symptoms) => {
        try {
            const response = await api.post('/period/ai/symptom-tips', { symptoms });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get comprehensive AI insights (with optional force regeneration)
    getInsights: async (force = false) => {
        try {
            const response = await api.get(`/period/ai/insights${force ? '?force=true' : ''}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Send chat message to AI
    sendChatMessage: async (message, history = []) => {
        try {
            const response = await api.post('/period/ai/chat', { message, history });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default periodService;
