import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PeriodTracker = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [symptoms, setSymptoms] = useState({
        pain: 5,
        mood: '',
        flow: ''
    });

    // Mock Calendar Data
    const days = Array.from({ length: 35 }, (_, i) => {
        const day = i - 2; // Offset to start month correctly
        let status = 'safe';
        if (day >= 1 && day <= 5) status = 'period';
        if (day >= 12 && day <= 16) status = 'fertile';
        if (day >= 25 && day <= 28) status = 'pms';
        return { day: day > 0 && day <= 31 ? day : null, status };
    });

    const handleDateClick = (day) => {
        if (day) {
            setSelectedDate(day);
            setIsBottomSheetOpen(true);
        }
    };

    const handleSymptomChange = (field, value) => {
        setSymptoms(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-text-dark pb-24 relative overflow-hidden">
            {/* Header */}
            <header className="p-6 bg-white shadow-sm flex items-center justify-between">
                <Link to="/dashboard" className="text-gray-500 hover:text-primary-pink">
                    <span className="text-2xl">←</span>
                </Link>
                <h1 className="text-xl font-bold text-gray-800">Period Tracker</h1>
                <div className="w-8"></div> {/* Spacer */}
            </header>

            <div className="p-6 max-w-md mx-auto space-y-6">
                {/* Cycle Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-gray-500 text-sm">Current Cycle</p>
                        <h2 className="text-3xl font-bold text-primary-pink">Day 14</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-sm">Next Period</p>
                        <h2 className="text-xl font-bold text-gray-800">14 Days</h2>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">December 2025</h3>
                        <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-primary-pink">{"<"}</button>
                            <button className="text-gray-400 hover:text-primary-pink">{">"}</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-xs font-bold text-gray-400">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((d, i) => (
                            <div
                                key={i}
                                onClick={() => handleDateClick(d.day)}
                                className={`
                  h-10 w-10 rounded-full flex items-center justify-center text-sm cursor-pointer transition
                  ${!d.day ? 'invisible' : ''}
                  ${d.day === 14 ? 'border-2 border-primary-pink font-bold' : ''}
                  ${d.status === 'period' ? 'bg-pink-100 text-primary-pink' : ''}
                  ${d.status === 'fertile' ? 'bg-green-100 text-green-600' : ''}
                  ${d.status === 'pms' ? 'bg-yellow-100 text-yellow-600' : ''}
                  ${d.status === 'safe' && d.day ? 'bg-gray-50 text-gray-600 hover:bg-gray-100' : ''}
                `}
                            >
                                {d.day}
                            </div>
                        ))}
                    </div>
                    {/* Legend */}
                    <div className="flex justify-center space-x-4 mt-4 text-[10px] text-gray-500">
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-pink-300 mr-1"></span>Period</div>
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-300 mr-1"></span>Fertile</div>
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-300 mr-1"></span>PMS</div>
                    </div>
                </div>

                {/* Cycle Insights */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800">Cycle Insights</h3>

                    {/* Average Cycle Length */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-medium text-gray-500 mb-4">Average Cycle Length</h4>
                        <div className="flex items-end space-x-2 h-24">
                            {[28, 29, 27, 28, 30, 28].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <div
                                        className="w-full bg-pink-200 rounded-t-sm transition-all group-hover:bg-primary-pink relative"
                                        style={{ height: `${(val / 35) * 100}%` }}
                                    >
                                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-primary-pink opacity-0 group-hover:opacity-100 transition">{val}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="bg-gradient-to-r from-teal-50 to-white border border-teal-100 rounded-xl p-5 shadow-sm flex items-start space-x-3">
                        <div className="text-2xl">🤖</div>
                        <div>
                            <h4 className="font-bold text-teal-700 text-sm mb-1">AI Insight</h4>
                            <p className="text-xs text-gray-600">Your cycle is regular! Based on your logs, you might experience mild cramps tomorrow. Consider a warm bath.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsBottomSheetOpen(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-primary-pink text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-pink-600 transition transform hover:scale-105 z-40"
            >
                +
            </button>

            {/* Bottom Sheet Overlay */}
            {isBottomSheetOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center" onClick={() => setIsBottomSheetOpen(false)}>
                    <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Log Symptoms {selectedDate ? `for Dec ${selectedDate}` : ''}</h3>

                        {/* Pain Level */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pain Level: {symptoms.pain}</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={symptoms.pain}
                                onChange={(e) => handleSymptomChange('pain', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-pink"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Mild</span>
                                <span>Severe</span>
                            </div>
                        </div>

                        {/* Mood */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                            <div className="flex justify-between">
                                {['😊', '😢', '😠', '😰'].map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleSymptomChange('mood', emoji)}
                                        className={`text-3xl p-2 rounded-full transition ${symptoms.mood === emoji ? 'bg-pink-100 scale-110' : 'hover:bg-gray-50'}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Flow Intensity */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Flow Intensity</label>
                            <div className="flex space-x-4">
                                {['Light', 'Medium', 'Heavy'].map(flow => (
                                    <button
                                        key={flow}
                                        onClick={() => handleSymptomChange('flow', flow)}
                                        className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${symptoms.flow === flow ? 'border-primary-pink bg-pink-50 text-primary-pink' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        {flow}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsBottomSheetOpen(false)}
                            className="w-full h-12 bg-primary-pink text-white font-bold rounded-lg hover:bg-pink-600 transition shadow-md"
                        >
                            Save Log
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeriodTracker;
