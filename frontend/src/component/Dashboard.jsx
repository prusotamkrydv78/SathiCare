import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [dailyTip, setDailyTip] = useState("Curating your daily wellness insight...");

    useEffect(() => {
        const fetchTip = async () => {
            const tip = await geminiService.getDailyHealthTip('general');
            setDailyTip(tip);
        };
        fetchTip();
    }, []);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="space-y-8 pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                        Namaste, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-pink to-purple-600">{user?.name || 'Sare'}</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Your daily wellness overview.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <span className="block font-bold text-gray-800 text-lg">Dec 07</span>
                        <span className="text-gray-500 text-sm">Sunday</span>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-full border-2 border-gray-100 shadow-md flex items-center justify-center text-primary-pink font-bold text-xl">
                        S
                    </div>
                </div>
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Width 2) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Hero Card - Cycle Status - Glassmorphism & Gradient */}
                    <motion.div
                        variants={itemVariants}
                        className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF8FB1] via-[#FF5C93] to-[#7B2CBF] opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>

                        {/* Glass Effect Overlay */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

                        {/* Decorative Blobs */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/30 rounded-full blur-3xl"></div>

                        <div className="relative z-10 p-10 flex flex-col md:flex-row justify-between items-center text-white">
                            <div className="text-center md:text-left mb-8 md:mb-0 max-w-md">
                                <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider mb-4 border border-white/20">
                                    OVULATION PHASE
                                </div>
                                <h2 className="text-4xl font-bold mb-3 leading-tight">Cycle Day 14</h2>
                                <p className="text-pink-50 text-lg mb-8 font-medium">Your fertility is at its peak today. It's a great time to conceive!</p>
                                <Link to="/track" className="px-8 py-3 bg-white text-primary-pink font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 inline-flex items-center gap-2">
                                    <span>Log Symptoms</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </Link>
                            </div>

                            <div className="relative">
                                {/* Simulated Progress Ring */}
                                <svg className="w-40 h-40 transform -rotate-90 text-white/30">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" />
                                    <circle cx="80" cy="80" r="70" stroke="white" strokeWidth="10" fill="transparent" strokeDasharray="440" strokeDashoffset="220" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-bold drop-shadow-md">14</span>
                                    <span className="text-xs font-bold tracking-widest opacity-80 uppercase mt-1">Days Left</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Today's Tip */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 flex flex-col h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-[4rem] -mr-4 -mt-4 z-0"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
                                    💡
                                </div>
                                <h3 className="font-bold text-gray-800 text-xl mb-3">Daily Insight</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{dailyTip}</p>
                            </div>
                        </motion.div>

                        {/* Quick Access - Emergency SOS */}
                        <Link to="/sos" className="block h-full">
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-gradient-to-br from-red-50 to-pink-50 rounded-[2rem] p-8 shadow-lg border border-red-100 h-full relative overflow-hidden group cursor-pointer"
                            >
                                {/* Animated pulse background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Pulsing dot indicator */}
                                <div className="absolute top-4 right-4">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        🆘
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-red-500 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-xl mb-2">Emergency SOS</h3>
                                <p className="text-gray-500 font-medium text-sm">Instant ambulance, first-aid tips & nearby hospitals.</p>

                                {/* Quick action hint */}
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">Call 102</span>
                                    <span className="text-xs font-bold text-pink-500 bg-pink-100 px-2 py-1 rounded-full">Share Location</span>
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                </div>

                {/* Right Column (Width 1) */}
                <div className="space-y-8">

                    {/* Quick Actions - Modern Grid */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
                        <h3 className="font-bold text-gray-800 mb-6 text-xl px-2">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { to: "/find-facility", icon: "🏥", label: "Find Clinic", color: "bg-blue-50 text-blue-600" },
                                { to: "/ai-chat", icon: "✨", label: "Ask AI", color: "bg-purple-50 text-purple-600" },
                                { to: "/appointments", icon: "📅", label: "Schedule", color: "bg-pink-50 text-pink-600" },
                                { to: "/library", icon: "📚", label: "Library", color: "bg-orange-50 text-orange-600" }
                            ].map((action, idx) => (
                                <Link key={idx} to={action.to} className="group">
                                    <div className="p-4 rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 text-center h-full">
                                        <span className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center mb-1 transition-transform duration-300 group-hover:scale-110 ${action.color}`}>
                                            {action.icon}
                                        </span>
                                        <span className="font-bold text-gray-600 text-sm group-hover:text-primary-pink transition-colors">{action.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Upcoming */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 text-xl">Upcoming</h3>
                            <Link to="/appointments" className="text-sm text-primary-pink font-bold hover:text-pink-600 transition">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {[1].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-white rounded-3xl border border-transparent hover:border-gray-100 hover:shadow-md transition cursor-pointer group">
                                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dec</span>
                                        <span className="text-2xl font-black text-gray-800">12</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-primary-pink transition-colors">Dr. Sharma</h4>
                                        <p className="text-sm text-gray-500 font-medium">Gynecologist • 10:00 AM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
