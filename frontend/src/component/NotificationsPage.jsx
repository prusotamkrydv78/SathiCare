import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Calendar,
    Heart,
    Baby,
    AlertCircle,
    Shield,
    Settings,
    CheckCircle,
    Trash2,
    ChevronLeft,
    Loader,
    Check,
    X,
    Filter
} from 'lucide-react';
import * as notificationService from '../services/notificationService';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Category filters
    const categories = [
        { id: 'all', label: 'All', icon: Bell },
        { id: 'appointment', label: 'Appointments', icon: Calendar },
        { id: 'period', label: 'Period', icon: Heart },
        { id: 'pregnancy', label: 'Pregnancy', icon: Baby },
        { id: 'health', label: 'Health', icon: Heart },
        { id: 'emergency', label: 'Emergency', icon: AlertCircle },
        { id: 'system', label: 'System', icon: Settings }
    ];

    // Load notifications on mount
    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, [activeCategory, showUnreadOnly]);

    const loadNotifications = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {
                page: 1,
                limit: 50
            };

            if (activeCategory !== 'all') {
                params.category = activeCategory;
            }

            if (showUnreadOnly) {
                params.unreadOnly = true;
            }

            const response = await notificationService.getNotifications(params);

            if (response.success) {
                setNotifications(response.data.notifications);
            }
        } catch (err) {
            console.error('Error loading notifications:', err);
            setError('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const response = await notificationService.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.data.count);
            }
        } catch (err) {
            console.error('Error loading unread count:', err);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const response = await notificationService.markAsRead(id);
            if (response.success) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif =>
                        notif._id === id ? { ...notif, isRead: true, readAt: new Date() } : notif
                    )
                );
                loadUnreadCount();
                // Notify other components (like Layout) to update their count
                window.dispatchEvent(new Event('notificationUpdate'));
            }
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await notificationService.markAllAsRead();
            if (response.success) {
                setSuccess('All notifications marked as read');
                loadNotifications();
                loadUnreadCount();
                window.dispatchEvent(new Event('notificationUpdate'));
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error('Error marking all as read:', err);
            setError('Failed to mark all as read');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await notificationService.deleteNotification(id);
            if (response.success) {
                setNotifications(prev => prev.filter(notif => notif._id !== id));
                setSuccess('Notification deleted');
                loadUnreadCount();
                window.dispatchEvent(new Event('notificationUpdate'));
                setTimeout(() => setSuccess(null), 2000);
            }
        } catch (err) {
            console.error('Error deleting notification:', err);
            setError('Failed to delete notification');
        }
    };

    const handleClearAll = async () => {
        try {
            const response = await notificationService.clearAllRead();
            if (response.success) {
                setSuccess('All read notifications cleared');
                loadNotifications();
                window.dispatchEvent(new Event('notificationUpdate'));
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error('Error clearing notifications:', err);
            setError('Failed to clear notifications');
        }
    };

    const handleNotificationClick = (notification) => {
        // Mark as read if unread
        if (!notification.isRead) {
            handleMarkAsRead(notification._id);
        }

        // Navigate to action URL if exists
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    const getCategoryIcon = (category) => {
        const categoryData = categories.find(cat => cat.id === category);
        return categoryData ? categoryData.icon : Bell;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-600 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'medium': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'low': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diff = now - notifDate;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return notifDate.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-medium text-sm flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={handleClearAll}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear read
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-6xl mx-auto px-6 pt-4"
                    >
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <p className="text-green-800 font-medium text-sm">{success}</p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-6xl mx-auto px-6 pt-4"
                    >
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-red-800 font-medium text-sm">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map(category => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeCategory === category.id
                                    ? 'bg-pink-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {category.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${showUnreadOnly
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Unread only
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-w-6xl mx-auto px-6 pb-8">
                {isLoading ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                        <Loader className="w-8 h-8 animate-spin text-pink-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications</h3>
                        <p className="text-gray-500">
                            {showUnreadOnly ? 'You have no unread notifications' : 'You\'re all caught up!'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification, index) => {
                                const Icon = getCategoryIcon(notification.category);
                                return (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`p-5 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notification.isRead ? 'bg-pink-50/30' : ''
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getPriorityColor(notification.priority)
                                                } border`}>
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-1">
                                                    <h3 className={`text-sm ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                                                        }`}>
                                                        {notification.title}
                                                        {!notification.isRead && (
                                                            <span className="ml-2 w-2 h-2 bg-pink-500 rounded-full inline-block"></span>
                                                        )}
                                                    </h3>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {getTimeAgo(notification.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${notification.category === 'emergency' ? 'bg-red-100 text-red-600' :
                                                        notification.category === 'appointment' ? 'bg-blue-100 text-blue-600' :
                                                            notification.category === 'pregnancy' ? 'bg-purple-100 text-purple-600' :
                                                                notification.category === 'period' ? 'bg-pink-100 text-pink-600' :
                                                                    'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {notification.category}
                                                    </span>
                                                    {notification.priority === 'urgent' && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                                            Urgent
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(notification._id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(notification._id);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Link */}
            <div className="max-w-6xl mx-auto px-6 pb-8 text-center">
                <Link
                    to="/profile-manage"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors"
                >
                    <Settings className="w-4 h-4" />
                    Manage Notification Preferences
                </Link>
            </div>
        </div>
    );
};

export default NotificationsPage;
