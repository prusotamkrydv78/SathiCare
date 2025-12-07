import Notification from '../models/notificationModel.js';

/**
 * Notification Service
 * Helper functions to create and manage notifications
 */

class NotificationService {
    /**
     * Create a new notification
     */
    static async createNotification({
        userId,
        type,
        title,
        message,
        data = {},
        priority = 'medium',
        category,
        actionUrl = null
    }) {
        try {
            const notification = await Notification.createNotification({
                userId,
                type,
                title,
                message,
                data,
                priority,
                category,
                actionUrl
            });

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    /**
     * Appointment Notifications
     */
    static async notifyAppointmentBooked(userId, appointmentData) {
        return await this.createNotification({
            userId,
            type: 'appointment_booked',
            title: 'Appointment Booked',
            message: `Your appointment with Dr. ${appointmentData.doctorName} has been booked for ${appointmentData.date}`,
            data: { appointmentId: appointmentData.appointmentId },
            priority: 'medium',
            category: 'appointment',
            actionUrl: `/appointments/${appointmentData.appointmentId}`
        });
    }

    static async notifyAppointmentConfirmed(userId, appointmentData) {
        return await this.createNotification({
            userId,
            type: 'appointment_confirmed',
            title: 'Appointment Confirmed',
            message: `Dr. ${appointmentData.doctorName} has confirmed your appointment on ${appointmentData.date}`,
            data: { appointmentId: appointmentData.appointmentId },
            priority: 'high',
            category: 'appointment',
            actionUrl: `/appointments/${appointmentData.appointmentId}`
        });
    }

    static async notifyAppointmentRejected(userId, appointmentData) {
        return await this.createNotification({
            userId,
            type: 'appointment_rejected',
            title: 'Appointment Declined',
            message: `Your appointment request with Dr. ${appointmentData.doctorName} was declined. Please book another slot.`,
            data: { appointmentId: appointmentData.appointmentId },
            priority: 'high',
            category: 'appointment',
            actionUrl: '/appointments'
        });
    }

    static async notifyAppointmentCancelled(userId, appointmentData) {
        return await this.createNotification({
            userId,
            type: 'appointment_cancelled',
            title: 'Appointment Cancelled',
            message: `Your appointment with Dr. ${appointmentData.doctorName} on ${appointmentData.date} has been cancelled`,
            data: { appointmentId: appointmentData.appointmentId },
            priority: 'medium',
            category: 'appointment'
        });
    }

    static async notifyAppointmentCompleted(userId, appointmentData) {
        return await this.createNotification({
            userId,
            type: 'appointment_completed',
            title: 'Appointment Completed',
            message: `Your appointment with Dr. ${appointmentData.doctorName} is complete. Please rate your experience.`,
            data: { appointmentId: appointmentData.appointmentId },
            priority: 'medium',
            category: 'appointment',
            actionUrl: `/appointments/${appointmentData.appointmentId}/rate`
        });
    }

    /**
     * Period Tracker Notifications
     */
    static async notifyPeriodLogged(userId, periodData) {
        return await this.createNotification({
            userId,
            type: 'period_logged',
            title: 'Period Logged',
            message: `Your period has been logged successfully. Cycle day ${periodData.cycleDay}`,
            data: { periodId: periodData.periodId },
            priority: 'low',
            category: 'period',
            actionUrl: '/track'
        });
    }

    static async notifyPeriodPrediction(userId, predictionData) {
        return await this.createNotification({
            userId,
            type: 'period_prediction',
            title: 'Period Prediction',
            message: `Your next period is predicted to start in ${predictionData.daysUntil} days (${predictionData.predictedDate})`,
            data: predictionData,
            priority: 'low',
            category: 'period',
            actionUrl: '/track'
        });
    }

    static async notifyPeriodReminder(userId, reminderData) {
        return await this.createNotification({
            userId,
            type: 'period_reminder_3d',
            title: 'Period Reminder',
            message: `Your period is expected in ${reminderData.daysUntil} days. Be prepared!`,
            data: reminderData,
            priority: 'medium',
            category: 'period',
            actionUrl: '/track'
        });
    }

    /**
     * Pregnancy Notifications
     */
    static async notifyPregnancyStarted(userId, pregnancyData) {
        return await this.createNotification({
            userId,
            type: 'pregnancy_started',
            title: 'Pregnancy Tracker Started',
            message: `Congratulations! Your pregnancy journey has begun. You are ${pregnancyData.weeksPregnant} weeks pregnant.`,
            data: { pregnancyId: pregnancyData.pregnancyId },
            priority: 'high',
            category: 'pregnancy',
            actionUrl: '/pregnancy-tracker'
        });
    }

    static async notifyPregnancyUpdated(userId, pregnancyData) {
        return await this.createNotification({
            userId,
            type: 'pregnancy_updated',
            title: 'Pregnancy Details Updated',
            message: 'Your pregnancy information has been updated successfully',
            data: { pregnancyId: pregnancyData.pregnancyId },
            priority: 'low',
            category: 'pregnancy',
            actionUrl: '/pregnancy-tracker'
        });
    }

    /**
     * Health Notifications
     */
    static async notifyHealthTip(userId, tipData) {
        return await this.createNotification({
            userId,
            type: 'health_tip',
            title: 'Daily Health Tip',
            message: tipData.tip,
            data: tipData,
            priority: 'low',
            category: 'health',
            actionUrl: '/health-assistant'
        });
    }

    static async notifySymptomAnalysis(userId, analysisData) {
        return await this.createNotification({
            userId,
            type: 'symptom_analysis',
            title: 'Symptom Analysis Complete',
            message: 'Your symptom analysis is ready. Check the results.',
            data: analysisData,
            priority: 'high',
            category: 'health',
            actionUrl: '/health-assistant'
        });
    }

    /**
     * Emergency Notifications
     */
    static async notifySOSSent(userId, sosData) {
        return await this.createNotification({
            userId,
            type: 'sos_sent',
            title: 'SOS Alert Sent',
            message: `Emergency alert sent to ${sosData.contactCount} contacts`,
            data: { sosId: sosData.sosId },
            priority: 'urgent',
            category: 'emergency',
            actionUrl: '/emergency'
        });
    }

    static async notifySOSResponded(userId, responseData) {
        return await this.createNotification({
            userId,
            type: 'sos_responded',
            title: 'Emergency Response',
            message: `${responseData.contactName} has responded to your emergency alert`,
            data: responseData,
            priority: 'urgent',
            category: 'emergency',
            actionUrl: '/emergency'
        });
    }

    /**
     * System Notifications
     */
    static async notifyWelcome(userId, userData) {
        return await this.createNotification({
            userId,
            type: 'welcome',
            title: 'Welcome to SaathiCare! 🎉',
            message: `Hi ${userData.name}! We're excited to have you. Complete your profile to get personalized health insights.`,
            data: userData,
            priority: 'medium',
            category: 'system',
            actionUrl: '/complete-profile'
        });
    }

    static async notifyProfileUpdated(userId) {
        return await this.createNotification({
            userId,
            type: 'profile_updated',
            title: 'Profile Updated',
            message: 'Your profile has been updated successfully',
            priority: 'low',
            category: 'system',
            actionUrl: '/profile-manage'
        });
    }

    static async notifyPasswordChanged(userId) {
        return await this.createNotification({
            userId,
            type: 'password_changed',
            title: 'Password Changed',
            message: 'Your password has been changed successfully. If this wasn\'t you, please contact support immediately.',
            priority: 'high',
            category: 'system'
        });
    }

    /**
     * Bulk operations
     */
    static async getUserNotifications(userId, options) {
        return await Notification.getUserNotifications(userId, options);
    }

    static async getUnreadCount(userId) {
        return await Notification.getUnreadCount(userId);
    }

    static async markAsRead(notificationId) {
        const notification = await Notification.findById(notificationId);
        if (notification) {
            return await notification.markAsRead();
        }
        return null;
    }

    static async markAllAsRead(userId) {
        return await Notification.markAllAsRead(userId);
    }

    static async deleteNotification(notificationId, userId) {
        return await Notification.findOneAndDelete({ _id: notificationId, userId });
    }

    static async clearAllRead(userId) {
        return await Notification.deleteMany({ userId, isRead: true });
    }
}

export default NotificationService;
