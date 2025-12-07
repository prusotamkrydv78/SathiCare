import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmergencyAccess = () => {
    const [isPulsing, setIsPulsing] = useState(true);

    const quickDials = [
        { id: 1, title: 'Ambulance', number: '102', icon: '🚑' },
        { id: 2, title: 'Women\'s Helpline', number: '1145', icon: '📞' },
        { id: 3, title: 'Police', number: '100', icon: '👮' },
        { id: 4, title: 'Husband', number: '+977 9800000000', icon: '❤️' },
    ];

    return (
        <div className="min-h-screen bg-red-50 font-sans pb-24">

            {/* Header Banner */}
            <div className="bg-red-500 p-4 sticky top-0 z-20 shadow-md">
                <div className="flex items-center justify-between">
                    <Link to="/dashboard" className="text-white/80 hover:text-white font-bold text-lg">← Back</Link>
                    <h1 className="text-white font-black text-xl tracking-wider">EMERGENCY HELP</h1>
                    <div className="w-8"></div> {/* Spacer for centering */}
                </div>
            </div>

            <div className="p-4 max-w-md mx-auto">

                {/* SOS Button Area */}
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="relative">
                        {/* Pulsing Rings */}
                        <div className={`absolute inset-0 bg-red-400 rounded-full opacity-30 ${isPulsing ? 'animate-ping' : ''}`}></div>
                        <div className={`absolute inset-[-10px] bg-red-400 rounded-full opacity-20 ${isPulsing ? 'animate-pulse' : ''}`}></div>

                        <button
                            className="relative z-10 w-48 h-48 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-8 border-red-200 shadow-2xl flex flex-col items-center justify-center active:scale-95 transition transform"
                            onClick={() => window.location.href = 'tel:102'}
                        >
                            <span className="text-5xl font-black text-white drop-shadow-md">SOS</span>
                            <span className="text-xs text-white/90 font-medium mt-1">Tap for Help</span>
                        </button>
                    </div>
                    <p className="text-red-500 font-bold mt-8 text-center animate-pulse">
                        Tap SOS to call Ambulance (102) immediately
                    </p>
                </div>

                {/* Quick Dials */}
                <h2 className="font-bold text-gray-800 mb-4 px-2 border-l-4 border-red-500 pl-2">Quick Dial</h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {quickDials.map(dial => (
                        <a
                            key={dial.id}
                            href={`tel:${dial.number}`}
                            className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex flex-col items-center justify-center hover:shadow-md hover:border-red-200 transition group"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition">{dial.icon}</span>
                            <span className="font-bold text-gray-800 text-sm">{dial.title}</span>
                            <span className="text-red-500 font-bold text-xs mt-1 bg-red-50 px-2 py-0.5 rounded-full">{dial.number}</span>
                        </a>
                    ))}
                </div>

                {/* Important Info Cards */}
                <h2 className="font-bold text-gray-800 mb-4 px-2 border-l-4 border-red-500 pl-2">When to Call?</h2>
                <div className="space-y-3 mb-8">
                    <div className="bg-[#FED7D7] p-4 rounded-xl border border-red-200">
                        <div className="flex items-start gap-3">
                            <span className="text-red-600 text-xl">⚠️</span>
                            <div>
                                <h3 className="font-bold text-red-800 text-sm mb-1">Severe Symptoms</h3>
                                <ul className="text-xs text-red-900 list-disc ml-4 space-y-1">
                                    <li>Heavy bleeding or severe abdominal pain</li>
                                    <li>Difficulty breathing or chest pain</li>
                                    <li>Sudden severe headache or vision changes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Share Location */}
                <button className="w-full bg-white border-2 border-red-500 text-red-500 font-bold py-3.5 rounded-xl shadow-sm hover:bg-red-50 transition flex items-center justify-center gap-2">
                    📍 Share My Current Location
                </button>

            </div>
        </div>
    );
};

export default EmergencyAccess;
