import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

const Dashboard = () => {
    const [dailyTip, setDailyTip] = useState("Loading your daily wellness tip...");

    useEffect(() => {
        const fetchTip = async () => {
            const tip = await geminiService.getDailyHealthTip('general');
            setDailyTip(tip);
        };
        fetchTip();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Namaste, <span className="text-primary-pink">Sita</span></h1>
                    <p className="text-gray-500 mt-1">Here is your daily health overview.</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500 text-right hidden sm:block">
                        <span className="block font-bold text-gray-800">Dec 07, 2025</span>
                        Sunday
                    </p>
                    <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                        S
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Width 2) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Hero Card - Cycle Status */}
                    <div className="bg-gradient-to-r from-[#FFB3D0] to-[#FF6B9D] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
                        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                            <h2 className="text-2xl font-bold mb-2">Cycle Day 14</h2>
                            <p className="opacity-90 mb-6 text-lg">Ovulation Phase • High Chance of Pregnancy</p>
                            <Link to="/track" className="px-6 py-2 bg-white text-primary-pink font-bold rounded-full shadow-lg hover:bg-pink-50 transition transform hover:-translate-y-1 inline-block">
                                Log Symptoms
                            </Link>
                        </div>

                        <div className="relative z-10">
                            <div className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                                <div className="text-center">
                                    <span className="text-4xl font-bold block">14</span>
                                    <span className="text-xs uppercase tracking-wide">Days Left</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
                    </div>

                    {/* Secondary Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Today's Tip */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-start gap-4">
                                <div className="bg-yellow-100 p-3 rounded-2xl text-2xl">💡</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg mb-2">Today's Insight</h3>
                                    <p className="text-gray-600 leading-relaxed">{dailyTip}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Access - Emergency */}
                        <Link to="/emergency" className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="bg-red-50 p-3 rounded-2xl text-2xl group-hover:scale-110 transition-transform">🆘</div>
                                <h3 className="font-bold text-gray-800 text-lg">Emergency SOS</h3>
                            </div>
                            <p className="text-gray-500 text-sm">Quick access to ambulance and help.</p>
                        </Link>
                    </div>

                </div>

                {/* Right Column (Width 1) */}
                <div className="space-y-8">

                    {/* Quick Actions */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-6 text-lg">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/find-facility" className="p-4 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:text-primary-pink transition text-center group">
                                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🏥</span>
                                <span className="font-medium text-sm">Find Clinic</span>
                            </Link>
                            <Link to="/ai-chat" className="p-4 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:text-primary-pink transition text-center group">
                                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🤖</span>
                                <span className="font-medium text-sm">Ask AI</span>
                            </Link>
                            <Link to="/appointments" className="p-4 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:text-primary-pink transition text-center group">
                                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📅</span>
                                <span className="font-medium text-sm">Appointments</span>
                            </Link>
                            <Link to="/library" className="p-4 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:text-primary-pink transition text-center group">
                                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📚</span>
                                <span className="font-medium text-sm">Library</span>
                            </Link>
                        </div>
                    </div>

                    {/* Upcoming */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 text-lg">Upcoming</h3>
                            <Link to="/appointments" className="text-sm text-primary-pink font-bold hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center font-bold">
                                    <span className="text-xs uppercase">Dec</span>
                                    <span className="text-xl">12</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Dr. Sharma Consultation</h4>
                                    <p className="text-xs text-gray-500">Gynecologist • 10:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
