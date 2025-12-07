import api from './api';

const pregnancyService = {
    // ============ PREGNANCY MANAGEMENT ============

    // Start pregnancy tracking
    startPregnancy: async (data) => {
        try {
            const payload = {};
            if (data.lmpDate) payload.lmpDate = data.lmpDate;
            if (data.currentWeek) payload.currentWeek = data.currentWeek;

            const response = await api.post('/pregnancy/start', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get current pregnancy
    getCurrentPregnancy: async () => {
        try {
            const response = await api.get('/pregnancy/current');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update pregnancy
    updatePregnancy: async (data) => {
        try {
            const response = await api.put('/pregnancy/update', { lmpDate: data.lmpDate });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // End pregnancy
    endPregnancy: async (data) => {
        try {
            const response = await api.post('/pregnancy/end', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ HEALTH LOGGING ============

    // Add daily health log
    addHealthLog: async (logData) => {
        try {
            const response = await api.post('/pregnancy/log', logData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get health logs
    getHealthLogs: async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await api.get(`/pregnancy/logs${queryString ? `?${queryString}` : ''}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ APPOINTMENTS ============

    // Add appointment
    addAppointment: async (appointmentData) => {
        try {
            const response = await api.post('/pregnancy/appointment', appointmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get appointments
    getAppointments: async () => {
        try {
            const response = await api.get('/pregnancy/appointments');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update appointment
    updateAppointment: async (id, appointmentData) => {
        try {
            const response = await api.put(`/pregnancy/appointment/${id}`, appointmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete appointment
    deleteAppointment: async (id) => {
        try {
            const response = await api.delete(`/pregnancy/appointment/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ AI INSIGHTS ============

    // Get weekly tips (AI-generated)
    getWeeklyTips: async (force = false) => {
        try {
            const response = await api.get(`/pregnancy/ai/insights${force ? '?force=true' : ''}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ CONTRACTION TIMER ============

    // Start contraction
    startContraction: async () => {
        try {
            const response = await api.post('/pregnancy/contraction/start');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Stop contraction
    stopContraction: async (contractionId) => {
        try {
            const response = await api.post('/pregnancy/contraction/stop', { contractionId });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get contraction stats
    getContractionStats: async () => {
        try {
            const response = await api.get('/pregnancy/contraction/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ CHAT ============

    // Start new chat
    startNewChat: async (title) => {
        try {
            const response = await api.post('/pregnancy/chat/new', { title });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Send chat message
    sendChatMessage: async (message, chatId = null) => {
        try {
            const payload = { message };
            // Only include chatId if it's not null
            if (chatId) {
                payload.chatId = chatId;
            }
            const response = await api.post('/pregnancy/chat', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all chats
    getAllChats: async () => {
        try {
            const response = await api.get('/pregnancy/chats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get chat history
    getChatHistory: async (chatId) => {
        try {
            const response = await api.get(`/pregnancy/chat/${chatId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete chat
    deleteChat: async (chatId) => {
        try {
            const response = await api.delete(`/pregnancy/chat/${chatId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default pregnancyService;
