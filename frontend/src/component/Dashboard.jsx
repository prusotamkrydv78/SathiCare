import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { motion } from 'framer-motion';
import {
    Calendar,
    Activity,
    MessageSquare,
    BookOpen,
    MapPin,
    ChevronRight,
    Heart,
    Zap,
    Stethoscope,
    Bell,
    TrendingUp,
    Baby,
    Droplet,
    Clock,
    AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDate] = useState(new Date());

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboardService.getDashboardData();
                if (response.success) {
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date));
    };

    const formatDay = (date) => {
        return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(date));
    };

    const formatTime = (time) => {
        return time || '10:00 AM';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const { periodInsights, pregnancyInsights, upcomingAppointments, recentNotifications, healthSummary } = dashboardData || {};

    return (
        <motion.div
            className="space-y-6 pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">
                        Namaste, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-pink to-purple-600">{user?.name?.split(' ')[0] || 'Sare'}</span>
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm font-medium">Here's your wellness overview for today</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <span className="block font-bold text-gray-800 text-base">{formatDate(currentDate)}</span>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{formatDay(currentDate)}</span>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-pink to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-base">
                        {currentDate.getDate()}
                    </div>
                </div>
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Period/Pregnancy Hero Card */}
                    {periodInsights && !pregnancyInsights && (
                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-3xl shadow-xl border border-gray-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600"></div>
                            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/30 rounded-full blur-3xl"></div>

                            <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center text-white">
                                <div className="text-center md:text-left mb-6 md:mb-0 max-w-md">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider mb-3 border border-white/20">
                                        <Droplet size={14} />
                                        {periodInsights.currentPhase.toUpperCase()}
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Day {periodInsights.currentDay} of Cycle</h2>
                                    <p className="text-pink-50 text-sm mb-6 font-medium leading-relaxed opacity-90">
                                        {periodInsights.phaseDescription}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                            Avg: {periodInsights.avgCycleLength} days
                                        </div>
                                        {periodInsights.isRegular && (
                                            <div className="px-3 py-1 bg-green-500/30 rounded-full text-xs font-semibold">
                                                Regular Cycle
                                            </div>
                                        )}
                                    </div>
                                    <Link to="/track" className="px-5 py-2.5 bg-white text-primary-pink font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-all inline-flex items-center gap-2 text-sm">
                                        <span>Log Today</span>
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>

                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center relative">
                                        <div className="absolute inset-0 border-4 border-white rounded-full border-t-transparent animate-spin" style={{ animationDuration: '8s' }}></div>
                                        <div className="text-center">
                                            <span className="text-4xl font-bold block">{periodInsights.daysUntilNextPeriod || '?'}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Days Left</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Pregnancy Hero Card */}
                    {pregnancyInsights && (
                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-3xl shadow-xl border border-gray-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600"></div>
                            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center text-white">
                                <div className="text-center md:text-left mb-6 md:mb-0 max-w-md">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider mb-3 border border-white/20">
                                        <Baby size={14} />
                                        TRIMESTER {pregnancyInsights.trimester}
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Week {pregnancyInsights.currentWeek}</h2>
                                    <p className="text-pink-50 text-sm mb-6 font-medium leading-relaxed opacity-90">
                                        Your baby is growing beautifully! {pregnancyInsights.daysUntilDue} days until your due date.
                                    </p>
                                    <Link to="/pregnancy-tracker" className="px-5 py-2.5 bg-white text-primary-pink font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-all inline-flex items-center gap-2 text-sm">
                                        <span>View Details</span>
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>

                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center">
                                        <div className="text-center">
                                            <span className="text-4xl font-bold block">{pregnancyInsights.currentWeek}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Weeks</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Health Score */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-2xl p-5 shadow-lg border border-gray-50 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="text-2xl font-bold text-gray-800">
                                    {healthSummary?.hasPeriodData && healthSummary?.hasPregnancyData ? '95' : healthSummary?.hasPeriodData ? '75' : '50'}%
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm mb-1">Health Score</h3>
                            <p className="text-xs text-gray-500">Data completeness</p>
                        </motion.div>

                        {/* Appointments */}
                        <Link to="/consultations">
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-2xl p-5 shadow-lg border border-gray-50 hover:shadow-xl transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-800">{upcomingAppointments?.length || 0}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-sm mb-1">Upcoming</h3>
                                <p className="text-xs text-gray-500">Appointments</p>
                            </motion.div>
                        </Link>

                        {/* Notifications */}
                        <Link to="/notifications">
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-2xl p-5 shadow-lg border border-gray-50 hover:shadow-xl transition-all cursor-pointer group relative"
                            >
                                {recentNotifications?.length > 0 && (
                                    <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                )}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Bell size={20} />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-800">{recentNotifications?.length || 0}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-sm mb-1">New Alerts</h3>
                                <p className="text-xs text-gray-500">Unread messages</p>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Emergency SOS Card */}
                    <Link to="/emergency">
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-red-100 cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-4 right-4 animate-pulse">
                                <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.6)]"></div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white text-red-500 rounded-xl flex items-center justify-center shadow-sm border border-red-100 group-hover:scale-110 transition-transform">
                                    <Heart size={28} fill="currentColor" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1">Emergency SOS</h3>
                                    <p className="text-gray-600 text-xs font-medium">Instant help, location sharing & emergency contacts</p>
                                </div>
                                <ChevronRight className="text-gray-400 group-hover:text-red-500 transition-colors" size={24} />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">Call 102</span>
                                <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded-full">Share Location</span>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Alert Contacts</span>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-50">
                        <h3 className="font-bold text-gray-800 text-base mb-4 px-1">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { to: "/find-facility", icon: MapPin, label: "Find Care", color: "text-blue-600 bg-blue-50" },
                                { to: "/ai-chat", icon: MessageSquare, label: "Ask AI", color: "text-purple-600 bg-purple-50" },
                                { to: "/track", icon: Activity, label: "Log Period", color: "text-pink-600 bg-pink-50" },
                                { to: "/library", icon: BookOpen, label: "Library", color: "text-orange-600 bg-orange-50" }
                            ].map((action, idx) => (
                                <Link key={idx} to={action.to} className="group">
                                    <div className="p-3 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-md transition-all flex flex-col items-center gap-2 text-center">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${action.color}`}>
                                            <action.icon size={18} />
                                        </div>
                                        <span className="font-semibold text-gray-700 text-xs group-hover:text-gray-900">{action.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Upcoming Appointments */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-base">Upcoming</h3>
                            <Link to="/consultations" className="text-xs text-primary-pink font-bold hover:text-pink-700 transition flex items-center gap-1">
                                View All <ChevronRight size={12} />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {upcomingAppointments && upcomingAppointments.length > 0 ? (
                                upcomingAppointments.slice(0, 3).map((appointment, i) => (
                                    <Link to="/consultations" key={i} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 hover:shadow-sm transition cursor-pointer group">
                                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center shadow-sm text-gray-700 flex-shrink-0">
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{formatDate(appointment.scheduledDate).split(' ')[0]}</span>
                                            <span className="text-base font-extrabold leading-none">{formatDate(appointment.scheduledDate).split(' ')[1]}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-primary-pink transition-colors">
                                                {appointment.doctorId?.name || 'Dr. Sharma'}
                                            </h4>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <Stethoscope size={10} />
                                                <span className="truncate">{appointment.doctorId?.specialization || 'Gynecologist'}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100 flex-shrink-0">
                                            {formatTime(appointment.scheduledTime)}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Calendar size={20} className="text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium mb-2">No upcoming appointments</p>
                                    <Link to="/consultations" className="text-xs text-primary-pink font-bold hover:text-pink-700">
                                        Book a consultation
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Notifications */}
                    {recentNotifications && recentNotifications.length > 0 && (
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800 text-base">Recent Alerts</h3>
                                <Link to="/notifications" className="text-xs text-primary-pink font-bold hover:text-pink-700 transition flex items-center gap-1">
                                    See All <ChevronRight size={12} />
                                </Link>
                            </div>
                            <div className="space-y-2">
                                {recentNotifications.slice(0, 3).map((notification, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 transition cursor-pointer">
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-primary-pink rounded-full mt-1.5 flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-800 line-clamp-2">{notification.title}</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(notification.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
