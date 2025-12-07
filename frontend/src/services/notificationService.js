import api from './api';

/**
 * Notification Service
 * Handles all notification-related API calls
 */

// Get all notifications with optional filters
export const getNotifications = async (params = {}) => {
    try {
        const response = await api.get('/notifications', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error.response?.data || error;
    }
};

// Get unread notification count
export const getUnreadCount = async () => {
    try {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        throw error.response?.data || error;
    }
};

// Mark a notification as read
export const markAsRead = async (id) => {
    try {
        const response = await api.put(`/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error.response?.data || error;
    }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
    try {
        const response = await api.put('/notifications/mark-all-read');
        return response.data;
    } catch (error) {
        console.error('Error marking all as read:', error);
        throw error.response?.data || error;
    }
};

// Delete a notification
export const deleteNotification = async (id) => {
    try {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error.response?.data || error;
    }
};

// Clear all read notifications
export const clearAllRead = async () => {
    try {
        const response = await api.delete('/notifications/clear-all');
        return response.data;
    } catch (error) {
        console.error('Error clearing notifications:', error);
        throw error.response?.data || error;
    }
};

export default {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead
};
