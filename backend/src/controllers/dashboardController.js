import PeriodCycle from '../models/periodCycleModel.js';
import Pregnancy from '../models/pregnancyModel.js';
import Appointment from '../models/appointmentModel.js';
import Notification from '../models/notificationModel.js';
import { predictNextPeriod } from '../services/periodAIService.js';

// @desc    Get comprehensive dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all data in parallel for better performance
        const [
            periodCycles,
            currentPregnancy,
            upcomingAppointments,
            recentNotifications,
            periodStats
        ] = await Promise.all([
            // Get last 3 period cycles
            PeriodCycle.find({ userId })
                .sort({ startDate: -1 })
                .limit(3)
                .lean(),

            // Get current pregnancy if exists
            Pregnancy.findOne({ userId, isActive: true })
                .lean(),

            // Get upcoming appointments
            Appointment.find({
                userId,
                status: { $in: ['pending', 'accepted'] },
                scheduledDate: { $gte: new Date() }
            })
                .sort({ scheduledDate: 1 })
                .limit(3)
                .populate('doctorId', 'name specialization')
                .lean(),

            // Get recent unread notifications
            Notification.find({ userId, read: false })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Get period statistics
            PeriodCycle.find({ userId })
                .sort({ startDate: -1 })
                .limit(12)
                .lean()
        ]);

        // Calculate period insights
        let periodInsights = null;
        if (periodCycles.length > 0) {
            const latestCycle = periodCycles[0];
            const today = new Date();
            const daysSinceStart = Math.floor((today - new Date(latestCycle.startDate)) / (1000 * 60 * 60 * 24));

            // Calculate cycle statistics
            const cycleLengths = periodStats.filter(c => c.cycleLength).map(c => c.cycleLength);
            const avgCycleLength = cycleLengths.length > 0
                ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
                : 28;

            // Determine current phase
            let currentPhase = 'Menstrual';
            let phaseDescription = 'Your period is here.';

            if (daysSinceStart > 0 && daysSinceStart <= 7) {
                currentPhase = 'Menstrual';
                phaseDescription = 'Your period is here. Rest and hydrate.';
            } else if (daysSinceStart > 7 && daysSinceStart <= 13) {
                currentPhase = 'Follicular';
                phaseDescription = 'Energy levels rising. Great time for new activities!';
            } else if (daysSinceStart > 13 && daysSinceStart <= 17) {
                currentPhase = 'Ovulation';
                phaseDescription = 'Peak fertility window. You may feel most energetic!';
            } else {
                currentPhase = 'Luteal';
                phaseDescription = 'Winding down. Focus on self-care.';
            }

            // Get AI prediction if available
            let nextPeriodPrediction = null;
            if (latestCycle.predictions?.nextPeriodDate) {
                nextPeriodPrediction = latestCycle.predictions.nextPeriodDate;
            } else if (periodStats.length >= 2) {
                // Generate quick prediction
                const prediction = await predictNextPeriod(periodStats, req.user);
                if (prediction.success) {
                    nextPeriodPrediction = prediction.data.nextPeriodDate;
                }
            }

            periodInsights = {
                currentDay: daysSinceStart + 1,
                currentPhase,
                phaseDescription,
                avgCycleLength,
                nextPeriodDate: nextPeriodPrediction,
                daysUntilNextPeriod: nextPeriodPrediction
                    ? Math.ceil((new Date(nextPeriodPrediction) - today) / (1000 * 60 * 60 * 24))
                    : null,
                lastPeriodDate: latestCycle.startDate,
                totalCyclesLogged: periodStats.length,
                isRegular: cycleLengths.length > 3 &&
                    (Math.max(...cycleLengths) - Math.min(...cycleLengths)) <= 7
            };
        }

        // Calculate pregnancy insights
        let pregnancyInsights = null;
        if (currentPregnancy) {
            const today = new Date();
            const lmpDate = new Date(currentPregnancy.lmpDate);
            const daysSinceLMP = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
            const currentWeek = Math.floor(daysSinceLMP / 7);
            const currentDay = daysSinceLMP % 7;
            const dueDate = new Date(lmpDate);
            dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            pregnancyInsights = {
                currentWeek,
                currentDay,
                dueDate,
                daysUntilDue,
                trimester: currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3,
                totalWeeks: 40
            };
        }

        // Health summary
        const healthSummary = {
            hasPeriodData: periodCycles.length > 0,
            hasPregnancyData: !!currentPregnancy,
            upcomingAppointmentsCount: upcomingAppointments.length,
            unreadNotificationsCount: recentNotifications.length
        };

        res.status(200).json({
            success: true,
            data: {
                user: {
                    name: req.user.name,
                    email: req.user.email,
                    age: req.user.age
                },
                periodInsights,
                pregnancyInsights,
                upcomingAppointments,
                recentNotifications,
                healthSummary
            }
        });

    } catch (error) {
        console.error('Dashboard Data Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
};

export default {
    getDashboardData
};
