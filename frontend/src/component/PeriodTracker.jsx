import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import PeriodAiSideBar from './PeriodAiSideBar';
import PeriodAiChat from './PeriodAiChat';

const PeriodTracker = () => {
    // Component Refactored and Fixed
    const [selectedDate, setSelectedDate] = useState(null);
    const [activeTab, setActiveTab] = useState('Calendar');
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    // Main Chat State
    const [showMainChat, setShowMainChat] = useState(false);
    const [mainChatMessages, setMainChatMessages] = useState([
        { id: 1, text: "Hi! Ask me anything about your cycle or symptoms. 🌸", sender: 'ai' }
    ]);
    const [mainChatInput, setMainChatInput] = useState('');
    const [mainChatLoading, setMainChatLoading] = useState(false);
    const mainChatEndRef = useRef(null);

    const [symptoms, setSymptoms] = useState({
        pain: 5,
        mood: '😊',
        flow: 'Medium',
        notes: ''
    });

    // Main Chat Logic
    const handleMainChatSubmit = async (e) => {
        e.preventDefault();
        if (!mainChatInput.trim()) return;

        const userMsg = mainChatInput;
        setMainChatMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
        setMainChatInput('');
        setMainChatLoading(true);

        try {
            const history = mainChatMessages.map(m => ({
                text: m.text,
                sender: m.sender
            }));

            const response = await geminiService.getPeriodChatResponse(userMsg, history);
            setMainChatMessages(prev => [...prev, { id: Date.now() + 1, text: response.text, sender: 'ai' }]);
        } catch (error) {
            setMainChatMessages(prev => [...prev, { id: Date.now() + 1, text: "Connection error. Please try again.", sender: 'ai' }]);
        } finally {
            setMainChatLoading(false);
        }
    };

    // Mock AI Insight Generation based on symptoms
    const getAiInsight = () => {
        if (symptoms.pain > 7) return "Your reported pain level is high. Consider using a heat pad and staying hydrated. If pain persists, please consult a doctor.";
        if (symptoms.mood === '😢' || symptoms.mood === '😰') return "It looks like you're feeling down or anxious. This is common during PMS due to hormonal shifts. Try some light yoga or meditation.";
        if (symptoms.flow === 'Heavy') return "Heavy flow noted. Ensure you are getting enough iron-rich foods like spinach and lentils to prevent fatigue.";
        return "Your cycle appears regular. Keep tracking to help our AI predict your next window more accurately!";
    };

    // Mock Calendar Data
    const days = Array.from({ length: 35 }, (_, i) => {
        const day = i - 2; // Offset
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
        <div className="font-sans text-gray-800">
            {/* Page Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition">Dashboard</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-600 font-medium">Tracker</span>
                    </div>
                    <h1 className="text-2xl font-bold">Period Tracker</h1>
                    <p className="text-gray-500 text-sm">Track your cycle, symptoms, and health.</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    {['Calendar', 'History', 'Insights'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === tab ? 'bg-primary-pink text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Status Card */}
                    <div className="bg-gradient-to-r from-pink-500 to-pink-400 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">Current Cycle</h2>
                            <p className="text-5xl font-black mb-2">Day 14</p>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold border border-white/30 inline-block">
                                Ovulation Phase
                            </span>
                        </div>
                        <div className="mt-8 md:mt-0 relative z-10 text-center md:text-right">
                            <p className="text-sm opacity-90 mb-1">Prediction</p>
                            <p className="text-2xl font-bold">Next Period in 14 Days</p>
                            <p className="text-xs opacity-75 mt-2">Dec 21, 2025</p>
                        </div>

                        {/* Decorative */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    {/* AI Chat Layout Interface - NOW MODULAR */}
                    <PeriodAiChat
                        showMainChat={showMainChat}
                        setShowMainChat={setShowMainChat}
                        messages={mainChatMessages}
                        loading={mainChatLoading}
                        input={mainChatInput}
                        setInput={setMainChatInput}
                        handleSubmit={handleMainChatSubmit}
                        messagesEndRef={mainChatEndRef}
                    />

                    {/* Calendar Section */}
                    {activeTab === 'Calendar' && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800 text-lg">December 2025</h3>
                                <div className="flex space-x-2">
                                    <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-pink-50 text-gray-500 hover:text-primary-pink flex items-center justify-center transition">{'<'}</button>
                                    <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-pink-50 text-gray-500 hover:text-primary-pink flex items-center justify-center transition">{'>'}</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} className="text-xs font-bold text-gray-400 uppercase tracking-wide">{d}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-4">
                                {days.map((d, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <button
                                            disabled={!d.day}
                                            onClick={() => handleDateClick(d.day)}
                                            className={`
                                                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-medium transition relative group
                                                    ${!d.day ? 'invisible' : ''}
                                                    ${d.day === 14 ? 'ring-2 ring-primary-pink ring-offset-2' : ''}
                                                    ${d.status === 'period' ? 'bg-pink-500 text-white shadow-pink-200 shadow-lg' : ''}
                                                    ${d.status === 'fertile' ? 'bg-green-100 text-green-700' : ''}
                                                    ${d.status === 'pms' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : ''}
                                                    ${d.status === 'safe' && d.day ? 'bg-gray-50 text-gray-600 hover:bg-gray-100' : ''}
                                                `}
                                        >
                                            {d.day}
                                            {d.day && <span className="absolute -bottom-6 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap bg-gray-800 text-white px-2 py-1 rounded z-10">Log</span>}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 mt-8 justify-center text-xs text-gray-600">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500"></div>Period</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></div>Fertile</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-50 border border-yellow-200"></div>PMS</div>
                            </div>
                        </div>
                    )}

                    {/* Charts / History Placeholder for other tabs */}
                    {activeTab !== 'Calendar' && (
                        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{activeTab} View</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Detailed {activeTab.toLowerCase()} analytics and history logs will be displayed here.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar (Right) - AI & Inputs */}
                <div className="space-y-6">

                    {/* Ask AI Contextual - NOW MODULAR */}
                    <PeriodAiSideBar
                        showMainChat={showMainChat}
                        setShowMainChat={setShowMainChat}
                    />

                    {/* Consult Doctor - New Feature */}
                    <Link to="/consultations" className="block w-full py-4 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition flex items-center justify-center gap-3">
                        <span className="text-xl">👩‍⚕️</span> Consult a Doctor
                    </Link>

                    {/* Log Button */}
                    <button
                        onClick={() => setIsBottomSheetOpen(true)}
                        className="w-full py-4 bg-primary-pink text-white rounded-2xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition flex items-center justify-center gap-3"
                    >
                        <span className="text-2xl">+</span> Log Today's Symptoms
                    </button>

                    {/* AI Insight Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-6 shadow-sm border border-indigo-100">

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">✨</div>
                            <h3 className="font-bold text-indigo-900">AI Health Insight</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            "{getAiInsight()}"
                        </p>
                        <div className="flex gap-2">
                            <span className="text-[10px] px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full font-bold">#Wellness</span>
                            <span className="text-[10px] px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full font-bold">#Cycle</span>
                        </div>

                    </div>
                </div>

                {/* Logging Modal / Bottom Sheet */}
                {isBottomSheetOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsBottomSheetOpen(false)}>
                        <div className="bg-white w-full max-w-lg rounded-3xl p-8 animate-scale-in shadow-2xl" onClick={e => e.stopPropagation()}>

                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">Log Symptoms</h3>
                                    <p className="text-gray-500 text-sm">For {selectedDate ? `Dec ${selectedDate}, 2025` : 'Today'}</p>
                                </div>
                                <button onClick={() => setIsBottomSheetOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">✕</button>
                            </div>

                            <div className="space-y-6">
                                {/* Pain Level */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Pain Level: <span className="text-primary-pink">{symptoms.pain}/10</span></label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={symptoms.pain}
                                        onChange={(e) => handleSymptomChange('pain', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-pink"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                        <span>No Pain</span>
                                        <span>Moderate</span>
                                        <span>Unbearable</span>
                                    </div>
                                </div>

                                {/* Mood */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Mood</label>
                                    <div className="flex justify-between gap-2">
                                        {['😊', '😢', '😠', '😰', '😴'].map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => handleSymptomChange('mood', emoji)}
                                                className={`flex-1 h-14 rounded-2xl text-2xl transition border-2 ${symptoms.mood === emoji ? 'border-primary-pink bg-pink-50' : 'border-gray-100 hover:border-pink-200'}`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Flow */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Flow Intensity</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Light', 'Medium', 'Heavy'].map(flow => (
                                            <button
                                                key={flow}
                                                onClick={() => handleSymptomChange('flow', flow)}
                                                className={`py-3 rounded-xl text-sm font-bold transition border-2 ${symptoms.flow === flow ? 'border-primary-pink bg-pink-50 text-primary-pink' : 'border-gray-100 text-gray-500 hover:border-pink-200'}`}
                                            >
                                                {flow}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsBottomSheetOpen(false)}
                                className="w-full mt-8 py-4 bg-primary-pink text-white font-bold rounded-2xl hover:bg-pink-600 transition shadow-lg shadow-pink-200"
                            >
                                Save Log
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PeriodTracker;
