import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import PregnancyAiWidget from './PregnancyAiWidget';
import { motion, AnimatePresence } from 'framer-motion';

const PregnancyTracker = () => {
    const [activeTab, setActiveTab] = useState('Overview');

    // Main Chat State
    const [showMainChat, setShowMainChat] = useState(false);
    const [mainChatMessages, setMainChatMessages] = useState([
        { id: 1, text: "Hi! Ask me anything about your pregnancy. 🤰", sender: 'ai' }
    ]);
    const [mainChatInput, setMainChatInput] = useState('');
    const [mainChatLoading, setMainChatLoading] = useState(false);
    const mainChatEndRef = useRef(null);

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

    // Auto-scroll main chat
    useEffect(() => {
        if (showMainChat) {
            mainChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [mainChatMessages, showMainChat]);

    // Timer Functions
    const toggleTimer = () => {
        if (isTimerRunning) {
            const newItem = {
                id: Date.now(),
                duration: timerDuration,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setContractions([newItem, ...contractions]);
            setIsTimerRunning(false);
            setTimerDuration(0);
        } else {
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

            const response = await geminiService.getPregnancyChatResponse(userMsg, history);
            setMainChatMessages(prev => [...prev, { id: Date.now() + 1, text: response.text, sender: 'ai' }]);
        } catch (error) {
            setMainChatMessages(prev => [...prev, { id: Date.now() + 1, text: "Connection error. Please try again.", sender: 'ai' }]);
        } finally {
            setMainChatLoading(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="font-sans text-gray-800 pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            {/* Header */}
            <motion.header variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition font-medium">Dashboard</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full">Pregnancy</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Pregnancy Companion</h1>
                    <p className="text-gray-500 mt-2 font-medium">Week-by-week guidance for you and your baby.</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    {['Overview', 'Checklist', 'Timer', 'Nutrition'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md transform scale-105'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Weekly Hero Card - Luxury Redesign */}
                    <motion.div
                        variants={itemVariants}
                        className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 rounded-full blur-3xl mix-blend-overlay"></div>
                        <div className="absolute top-1/2 right-0 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl mix-blend-overlay"></div>

                        <div className="relative z-10 p-10">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/20 mb-4 text-white uppercase tracking-wider">
                                        2nd Trimester
                                    </span>
                                    <h2 className="text-6xl font-black text-white mb-2 drop-shadow-sm">Week 20</h2>
                                    <p className="text-indigo-100 text-xl font-medium">Halfway there! 20 weeks to go.</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center border border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-5xl mb-2 drop-shadow-md">🍌</span>
                                    <p className="text-xs text-indigo-100 uppercase font-bold tracking-widest mb-1">Baby Size</p>
                                    <p className="font-exrabold text-white text-lg">Banana</p>
                                </div>
                            </div>

                            <div className="bg-black/20 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
                                <div className="flex justify-between text-[10px] font-bold text-white/70 mb-2 px-2">
                                    <span>Week 0</span>
                                    <span>Week 40</span>
                                </div>
                                <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '50%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 to-purple-300 rounded-full shadow-[0_0_10px_rgba(232,121,249,0.5)]"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Ask AI Section (Visible only when chat is open) */}
                    <AnimatePresence>
                        {showMainChat && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden"
                            >
                                <div className="p-6 bg-gradient-to-r from-teal-50 to-white flex justify-between items-center border-b border-gray-100">
                                    <h3 className="font-bold text-teal-800 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-xl shadow-sm">🤖</div>
                                        Pregnancy AI Assistant
                                    </h3>
                                    <button onClick={() => setShowMainChat(false)} className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition">✕</button>
                                </div>
                                <div className="p-6">
                                    <div className="h-72 overflow-y-auto mb-4 bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-4 scroll-smooth">
                                        {mainChatMessages.map(msg => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={msg.id}
                                                className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-teal-500 text-white ml-auto rounded-tr-none' : 'bg-white text-gray-700 mr-auto rounded-tl-none border border-gray-100'}`}
                                            >
                                                {msg.text}
                                            </motion.div>
                                        ))}
                                        {mainChatLoading && (
                                            <div className="flex gap-2 p-2 ml-2">
                                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        )}
                                        <div ref={mainChatEndRef} />
                                    </div>
                                    <form onSubmit={handleMainChatSubmit} className="flex gap-3">
                                        <input
                                            type="text"
                                            className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition shadow-sm"
                                            placeholder="Type your question..."
                                            value={mainChatInput}
                                            onChange={(e) => setMainChatInput(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="bg-teal-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition transform hover:-translate-y-0.5"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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

                    {/* Ask AI Contextual (Sidebar Trigger) */}
                    <div className="bg-teal-50 rounded-3xl p-6 border border-teal-100 transition-all duration-300">
                        <h3 className="font-bold text-teal-800 mb-4 flex items-center gap-2">
                            <span className="bg-teal-100 p-1.5 rounded-lg">🤖</span> Ask AI Companion
                        </h3>
                        <p className="text-sm text-teal-700 mb-4">
                            "Is it safe to eat spicy food in week 20?"
                        </p>

                        <button
                            onClick={() => setShowMainChat(!showMainChat)}
                            className={`block w-full py-3 rounded-xl font-bold text-center transition shadow-lg ${showMainChat ? 'bg-gray-800 text-white hover:bg-black' : 'bg-teal-500 text-white hover:bg-teal-600 shadow-teal-200'}`}
                        >
                            {showMainChat ? 'Close Chat' : 'Ask Now'}
                        </button>
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
        </motion.div>
    );
};

export default PregnancyTracker;
