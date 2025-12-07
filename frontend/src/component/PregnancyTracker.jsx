import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService'; // Import Service
import PregnancyAiWidget from './PregnancyAiWidget'; // Import New Widget

const PregnancyTracker = () => {
    const [activeTab, setActiveTab] = useState('Overview');

    // Contraction Timer State
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerStart, setTimerStart] = useState(null);
    const [timerDuration, setTimerDuration] = useState(0);
    const [contractions, setContractions] = useState([]);

    // AI Insights State
    const [weeklyInsight, setWeeklyInsight] = useState(null);
    const [loadingInsight, setLoadingInsight] = useState(true);

    // Hospital Bag State
    const [bagItems, setBagItems] = useState([
        { id: 1, label: 'Medical Records', checked: false, category: 'Mom' },
        { id: 2, label: 'Comfortable Clothes', checked: false, category: 'Mom' },
        { id: 3, label: 'Toiletries', checked: false, category: 'Mom' },
        { id: 4, label: 'Baby Onesies', checked: false, category: 'Baby' },
        { id: 5, label: 'Diapers & Wipes', checked: false, category: 'Baby' },
        { id: 6, label: 'Blanket', checked: false, category: 'Baby' },
        { id: 7, label: 'Snacks & Water', checked: false, category: 'Partner' },
        { id: 8, label: 'Phone Charger', checked: false, category: 'Partner' },
    ]);

    // Fetch AI Insight on Mount
    useEffect(() => {
        const fetchInsight = async () => {
            // Mocking a fetch for "Week 20" context
            const response = await geminiService.getChatResponse("What should I expect in week 20 of pregnancy? Give me a short summary for baby and mom.");
            setWeeklyInsight(response.text);
            setLoadingInsight(false);
        };
        fetchInsight();
    }, []);

    // Timer Interval
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimerDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // Timer Functions
    const toggleTimer = () => {
        if (isTimerRunning) {
            // Stop
            const newItem = {
                id: Date.now(),
                duration: timerDuration,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setContractions([newItem, ...contractions]);
            setIsTimerRunning(false);
            setTimerDuration(0);
        } else {
            // Start
            setTimerStart(Date.now());
            setIsTimerRunning(true);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Checklist Function
    const toggleItem = (id) => {
        setBagItems(items => items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    return (
        <div className="font-sans text-gray-800 pb-12">

            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition">Dashboard</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-600 font-medium">Pregnancy</span>
                    </div>
                    <h1 className="text-2xl font-bold">Pregnancy Companion</h1>
                    <p className="text-gray-500 text-sm">Week-by-week guidance and tools.</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                    {['Overview', 'Checklist', 'Timer', 'Nutrition'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${activeTab === tab ? 'bg-primary-pink text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {/* AI Widget Integrated in Header */}
                <PregnancyAiWidget />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Weekly Hero Card */}
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/20 mb-4">2nd Trimester</span>
                                <h2 className="text-4xl font-black mb-1">Week 20</h2>
                                <p className="opacity-90">20 Weeks to go</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/20">
                                <span className="text-4xl">🍌</span>
                                <div>
                                    <p className="text-xs uppercase opacity-75 font-bold tracking-wider">Baby Size</p>
                                    <p className="font-bold">Banana</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between text-xs font-bold opacity-75 mb-2">
                                <span>Week 0</span>
                                <span>Week 40</span>
                            </div>
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full rounded-full" style={{ width: '50%' }}></div>
                            </div>
                        </div>

                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
                    </div>

                    {/* Tab Content Area */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">

                        {activeTab === 'Overview' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="text-2xl">👶</span> Weekly Insights (AI)
                                    </h3>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        {loadingInsight ? (
                                            <div className="flex gap-2 items-center text-gray-400">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                                <span className="text-sm ml-2">Asking Saathi about Week 20...</span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                {weeklyInsight}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-pink-50 rounded-2xl p-6">
                                        <h4 className="font-bold text-gray-800 mb-2">Mom's Body</h4>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex gap-2"><span>🤰</span> Visible baby bump</li>
                                            <li className="flex gap-2"><span>💅</span> Stronger nails & hair</li>
                                            <li className="flex gap-2"><span>🦵</span> Mild leg cramps</li>
                                        </ul>
                                    </div>
                                    <div className="bg-green-50 rounded-2xl p-6">
                                        <h4 className="font-bold text-gray-800 mb-2">To-Do List</h4>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex gap-2"><span>💊</span> Take prenatal vitamins</li>
                                            <li className="flex gap-2"><span>💧</span> Drink 8+ glasses of water</li>
                                            <li className="flex gap-2"><span>🩺</span> Schedule anatomy scan</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Checklist' && (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Hospital Bag Checklist</h3>
                                    <span className="text-sm text-gray-500">{bagItems.filter(i => i.checked).length}/{bagItems.length} Ready</span>
                                </div>

                                <div className="space-y-6">
                                    {['Mom', 'Baby', 'Partner'].map(category => (
                                        <div key={category}>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {bagItems.filter(i => i.category === category).map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => toggleItem(item.id)}
                                                        className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${item.checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                                    >
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                                                            {item.checked && '✓'}
                                                        </div>
                                                        <span className={item.checked ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}>{item.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Timer' && (
                            <div className="text-center animate-fade-in">
                                <h3 className="text-xl font-bold text-gray-800 mb-8">Contraction Timer</h3>

                                <div className="mb-12 relative inline-block">
                                    <div className={`w-64 h-64 rounded-full border-8 flex items-center justify-center relative z-10 bg-white transition-all ${isTimerRunning ? 'border-primary-pink shadow-[0_0_50px_rgba(255,107,157,0.3)]' : 'border-gray-100'}`}>
                                        <div>
                                            <p className="text-gray-400 font-medium mb-2">Duration</p>
                                            <p className="text-6xl font-black tabular-nums text-gray-800">{formatTime(timerDuration)}</p>
                                        </div>
                                    </div>
                                    {isTimerRunning && <div className="absolute inset-0 rounded-full border-8 border-primary-pink animate-ping opacity-20"></div>}
                                </div>

                                <button
                                    onClick={toggleTimer}
                                    className={`px-12 py-4 rounded-full font-bold text-xl shadow-lg transition transform hover:-translate-y-1 ${isTimerRunning ? 'bg-gray-800 text-white hover:bg-black' : 'bg-primary-pink text-white hover:bg-pink-600'}`}
                                >
                                    {isTimerRunning ? 'Stop Timer' : 'Start Contraction'}
                                </button>

                                {contractions.length > 0 && (
                                    <div className="mt-12 text-left bg-gray-50 rounded-2xl p-6">
                                        <h4 className="font-bold text-gray-700 mb-4">Recent History</h4>
                                        <div className="space-y-3">
                                            {contractions.map(c => (
                                                <div key={c.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                                    <span className="font-mono text-gray-500">{c.time}</span>
                                                    <span className="font-bold text-gray-800">{formatTime(c.duration)} duration</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Nutrition' && (
                            <div className="text-center py-10">
                                <span className="text-6xl mb-4 block">🍎</span>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Nutrition Guide</h3>
                                <p className="text-gray-500">Tailored meal plans and tips coming soon!</p>
                            </div>
                        )}

                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="space-y-6">

                    {/* Ask AI Contextual */}
                    <div className="bg-teal-50 rounded-3xl p-6 border border-teal-100">
                        <h3 className="font-bold text-teal-800 mb-4 flex items-center gap-2">
                            <span className="bg-teal-100 p-1.5 rounded-lg">🤖</span> Ask AI Companion
                        </h3>
                        <p className="text-sm text-teal-700 mb-4">
                            "Is it safe to eat spicy food in week 20?"
                        </p>
                        <Link to="/ai-chat" className="block w-full py-3 bg-teal-500 text-white rounded-xl font-bold text-center hover:bg-teal-600 transition shadow-lg shadow-teal-200">
                            Ask Now
                        </Link>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Appointments</h3>
                            <Link to="/appointments" className="text-xs font-bold text-primary-pink">View All</Link>
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold text-gray-500">
                                    <span>DEC</span>
                                    <span className="text-sm text-gray-800">15</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Ultrasound</p>
                                    <p className="text-xs text-gray-500">City Hospital</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PregnancyTracker;
