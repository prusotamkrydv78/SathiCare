import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PregnancyTracker = () => {
    const [activeTab, setActiveTab] = useState('This Week');

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-text-dark pb-20 relative">

            {/* Header / Top Bar */}
            <header className="p-6 flex justify-between items-center bg-white shadow-sm sticky top-0 z-50">
                <Link to="/dashboard" className="text-gray-500 hover:text-primary-pink transition">
                    <span className="text-2xl">←</span>
                </Link>
                <h1 className="text-xl font-bold text-gray-800">Pregnancy Tracker</h1>
                <div className="w-8"></div> {/* Spacer */}
            </header>

            <div className="p-6 max-w-md mx-auto space-y-6">

                {/* Hero Card */}
                <div className="bg-gradient-to-br from-[#FFB3D0] to-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Week 20</h2>
                                <p className="text-sm text-gray-600">of 40 weeks</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-pink shadow-sm">
                                2nd Trimester
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/50 h-3 rounded-full mb-6 overflow-hidden">
                            <div className="bg-primary-pink h-full rounded-full" style={{ width: '50%' }}></div>
                        </div>

                        {/* Baby Size */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4">
                            <div className="text-4xl">🍌</div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Baby Size</p>
                                <p className="text-sm font-medium text-gray-800">Your baby is the size of a <span className="font-bold text-primary-pink">Banana</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Illustration Placeholder (Abstract Shape) */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-200 rounded-full opacity-30 blur-2xl"></div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
                    {['This Week', 'Appointments', 'Nutrition', 'Timer'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-primary-pink' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-pink rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4 animate-fade-in">
                    {activeTab === 'This Week' && (
                        <>
                            {/* Baby's Development */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-lg">👶</div>
                                    <h3 className="font-bold text-gray-800">Baby's Development</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600 ml-2">
                                    <li className="flex items-start">
                                        <span className="text-primary-pink mr-2">•</span>
                                        Baby is swallowing amniotic fluid.
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-primary-pink mr-2">•</span>
                                        Hair is starting to grow on the scalp.
                                    </li>
                                </ul>
                            </div>

                            {/* Your Body */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">🤰</div>
                                    <h3 className="font-bold text-gray-800">Your Body</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    You might be feeling more energetic now! It's a great time to start planning the nursery. Watch out for mild backaches as your belly grows.
                                </p>
                            </div>

                            {/* What to Eat */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">🥗</div>
                                    <h3 className="font-bold text-gray-800">Nutrition Tips</h3>
                                </div>
                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                    <div className="min-w-[100px] bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-2xl mb-1">🥑</div>
                                        <p className="text-xs font-medium text-gray-700">Avocados</p>
                                    </div>
                                    <div className="min-w-[100px] bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-2xl mb-1">🥜</div>
                                        <p className="text-xs font-medium text-gray-700">Nuts</p>
                                    </div>
                                    <div className="min-w-[100px] bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-2xl mb-1">🥛</div>
                                        <p className="text-xs font-medium text-gray-700">Yogurt</p>
                                    </div>
                                </div>
                            </div>

                            {/* Exercise Tips */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">🧘‍♀️</div>
                                    <h3 className="font-bold text-gray-800">Safe Exercises</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Prenatal yoga helps with flexibility and breathing.</p>
                                <button className="text-xs font-bold text-primary-pink hover:underline">View 15-min Routine →</button>
                            </div>
                        </>
                    )}

                    {activeTab !== 'This Week' && (
                        <div className="text-center py-10 text-gray-400">
                            <p>Content for {activeTab} coming soon!</p>
                        </div>
                    )}
                </div>

                {/* Ask AI Button */}
                <button className="w-full h-14 bg-[#4ECDC4] text-white font-bold rounded-xl shadow-md hover:bg-teal-500 transition flex items-center justify-center space-x-2">
                    <span className="text-xl">✨</span>
                    <span>Ask AI about pregnancy</span>
                </button>

            </div>

            {/* Floating Emergency Button */}
            <button className="fixed top-24 right-4 w-12 h-12 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-red-600 transition z-40 animate-pulse">
                🆘
            </button>

        </div>
    );
};

export default PregnancyTracker;
