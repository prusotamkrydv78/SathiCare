import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AiAssistant from './AiAssistant';

const DoctorFilters = () => {
    const [showAiChat, setShowAiChat] = useState(false);

    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Specialty</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-pink">
                            <option>All Specialties</option>
                            <option>Gynecologist</option>
                            <option>Obstetrician</option>
                            <option>Fertility Specialist</option>
                            <option>Nutritionist</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Languages</label>
                        <div className="flex flex-wrap gap-2">
                            {['English', 'Hindi', 'Marathi', 'Gujarati'].map(lang => (
                                <button key={lang} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium hover:bg-pink-50 hover:border-pink-200">
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ask With Ai Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                        <span className="text-2xl">🤖</span> Ask With Ai
                    </h3>
                    <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                        Get instant health advice, symptom triage, and answers to your questions 24/7.
                    </p>
                    <button
                        onClick={() => setShowAiChat(!showAiChat)}
                        className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                    >
                        {showAiChat ? 'Close Chat' : 'Chat Now'}
                    </button>
                </div>

                {/* Decorative Background Circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Inline AI Chat */}
            {showAiChat && (
                <div className="animate-fade-in-down">
                    <AiAssistant className="h-[500px] shadow-md border-t border-gray-100 rounded-3xl" />
                </div>
            )}
        </div>
    );
};

export default DoctorFilters;
