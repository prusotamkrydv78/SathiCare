import api from './api';

const periodService = {
    // Log a new period or update existing log for a date
    logPeriod: async (periodData) => {
        try {
            const response = await api.post('/period/log', periodData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get period history
    getHistory: async () => {
        try {
            const response = await api.get('/period/history');
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

    // Get statistics
    getStats: async () => {
        try {
            const response = await api.get('/period/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // AI Predictions
    getPredictions: async () => {
        try {
            const response = await api.get('/period/ai/predict');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // AI Insights
    getInsights: async () => {
        try {
            const response = await api.get('/period/ai/insights');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default periodService;
