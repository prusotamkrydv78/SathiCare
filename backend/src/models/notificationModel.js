import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true,
            enum: [
                // Appointment notifications
                'appointment_booked',
                'appointment_confirmed',
                'appointment_rejected',
                'appointment_cancelled',
                'appointment_completed',
                'appointment_reminder_24h',
                'appointment_reminder_1h',

                // Period tracker notifications
                'period_logged',
                'period_prediction',
                'period_reminder_3d',
                'period_reminder_today',
                'ovulation_window',

                // Pregnancy notifications
                'pregnancy_started',
                'pregnancy_updated',
                'pregnancy_weekly_update',
                'prenatal_checkup_reminder',
                'pregnancy_milestone',

                // Health notifications
                'health_tip',
                'symptom_analysis',
                'medication_reminder',

                // Emergency notifications
                'sos_sent',
                'sos_responded',

                // System notifications
                'welcome',
                'profile_updated',
                'password_changed',
                'security_alert'
            ]
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        category: {
            type: String,
            required: true,
            enum: ['appointment', 'period', 'pregnancy', 'health', 'emergency', 'system'],
            index: true
        },
        actionUrl: {
            type: String,
            default: null
        },
        readAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Compound indexes for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, category: 1, createdAt: -1 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function () {
    const now = new Date();
    const diff = now - this.createdAt;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return this.createdAt.toLocaleDateString();
});

// Method to mark as read
notificationSchema.methods.markAsRead = async function () {
    this.isRead = true;
    this.readAt = new Date();
    return await this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
    const notification = new this(data);
    return await notification.save();
};

// Static method to get user notifications with pagination
notificationSchema.statics.getUserNotifications = async function (userId, options = {}) {
    const {
        page = 1,
        limit = 20,
        unreadOnly = false,
        category = null
    } = options;

    const query = { userId };

    if (unreadOnly) {
        query.isRead = false;
    }

    if (category) {
        query.category = category;
    }

    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
        this.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query)
    ]);

    return {
        notifications,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
    return await this.countDocuments({ userId, isRead: false });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function (userId) {
    return await this.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
