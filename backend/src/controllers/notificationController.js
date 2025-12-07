import NotificationService from '../services/notificationService.js';

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page, limit, unreadOnly, category } = req.query;

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            unreadOnly: unreadOnly === 'true',
            category: category || null
        };

        const result = await NotificationService.getUserNotifications(userId, options);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get notifications',
            error: error.message
        });
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await NotificationService.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get unread count',
            error: error.message
        });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await NotificationService.markAsRead(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: { notification }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read',
            error: error.message
        });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await NotificationService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            data: { modifiedCount: result.modifiedCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark all as read',
            error: error.message
        });
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await NotificationService.deleteNotification(id, userId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
            error: error.message
        });
    }
};

// @desc    Clear all read notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
export const clearAllRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await NotificationService.clearAllRead(userId);

        res.status(200).json({
            success: true,
            message: 'All read notifications cleared',
            data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to clear notifications',
            error: error.message
        });
    }
};
