import api from './api';

const healthService = {
    // ============ AI CHAT ============

    // Start new chat session
    startNewChat: async (title) => {
        try {
            const response = await api.post('/health/chat/new', { title });
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
            const response = await api.post('/health/chat', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all chats
    getAllChats: async () => {
        try {
            const response = await api.get('/health/chats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get chat history
    getChatHistory: async (chatId) => {
        try {
            const response = await api.get(`/health/chat/${chatId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete chat
    deleteChat: async (chatId) => {
        try {
            const response = await api.delete(`/health/chat/${chatId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ HEALTH FEATURES ============

    // Get daily tip
    getDailyTip: async () => {
        try {
            const response = await api.get('/health/tip');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Check symptoms
    checkSymptoms: async (symptoms, duration, severity) => {
        try {
            const response = await api.post('/health/symptoms', {
                symptoms,
                duration,
                severity
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default healthService;
