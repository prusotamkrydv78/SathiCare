import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-text-dark pb-20">
            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-white shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Namaste, <span className="text-primary-pink">Sita</span></h1>
                    <p className="text-sm text-gray-500">Welcome back to Saathi</p>
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden border-2 border-primary-pink">
                    {/* Placeholder for Profile Picture */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">S</div>
                </div>
            </header>

            <div className="p-6 max-w-md mx-auto space-y-6">
                {/* Hero Card - Health Status */}
                <div className="bg-gradient-to-r from-[#FFB3D0] to-[#FF6B9D] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-lg font-semibold mb-1">Cycle Day 14</h2>
                        <p className="text-sm opacity-90 mb-4">Ovulation Phase</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold">High</p>
                                <p className="text-xs opacity-80">Chance of Pregnancy</p>
                            </div>
                            <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                                <span className="font-bold text-lg">14</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm font-medium">Next Period: In 14 Days</p>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-500 flex items-center justify-center text-xl">📅</div>
                        <span className="text-sm font-medium text-gray-700">Log Period</span>
                    </button>
                    <Link to="/find-facility" className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-primary-pink flex items-center justify-center text-xl">👩‍⚕️</div>
                        <span className="text-sm font-medium text-gray-700">Find Doctor</span>
                    </Link>
                    <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xl">🤖</div>
                        <span className="text-sm font-medium text-gray-700">Ask AI</span>
                    </button>
                    <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xl">🆘</div>
                        <span className="text-sm font-medium text-gray-700">Emergency</span>
                    </button>
                </div>

                {/* Today's AI Tip */}
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-yellow-400 flex items-start space-x-4">
                    <div className="text-2xl">💡</div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Today's Tip</h3>
                        <p className="text-sm text-gray-600">Stay hydrated! Drinking water helps reduce bloating during your cycle.</p>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Upcoming</h3>
                        <a href="#" className="text-xs text-primary-pink font-bold">View All</a>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-gray-500">
                                <span>DEC</span>
                                <span className="text-lg text-gray-800">12</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Dr. Anjali Sharma</h4>
                                <p className="text-xs text-gray-500">Gynecologist • 10:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-gray-500">
                                <span>DEC</span>
                                <span className="text-lg text-gray-800">28</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Vaccination</h4>
                                <p className="text-xs text-gray-500">City Hospital • 2:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 px-6 flex justify-between items-center text-gray-400 z-50">
                <Link to="/dashboard" className="flex flex-col items-center space-y-1 hover:text-primary-pink transition">
                    <span className="text-xl">🏠</span>
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link to="/track" className="flex flex-col items-center space-y-1 hover:text-primary-pink transition">
                    <span className="text-xl">📊</span>
                    <span className="text-[10px] font-medium">Track</span>
                </Link>
                <Link to="/features" className="flex flex-col items-center space-y-1 hover:text-primary-pink transition">
                    <span className="text-xl">🧩</span>
                    <span className="text-[10px] font-medium">Features</span>
                </Link>
                <Link to="/profile-settings" className="flex flex-col items-center space-y-1 hover:text-primary-pink transition">
                    <span className="text-xl">👤</span>
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            </nav>
        </div>
    );
};

export default Dashboard;
