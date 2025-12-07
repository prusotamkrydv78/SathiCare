import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const SymptomChecker = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [duration, setDuration] = useState('');
    const [severity, setSeverity] = useState('Medium');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const commonSymptoms = [
        "Headache", "Fever", "Cramps", "Nausea",
        "Fatigue", "Rash", "Back Pain", "Bleeding",
        "Dizziness", "Vomiting", "Sore Throat", "Cough"
    ];

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handleCheck = async () => {
        if (selectedSymptoms.length === 0) return;

        setLoading(true);
        setResult(null);

        try {
            const analysis = await geminiService.analyzeSymptoms({
                symptoms: selectedSymptoms.map(s => s.toLowerCase()),
                duration,
                severity
            });
            setResult(analysis);
        } catch (error) {
            console.error("Error analyzing symptoms:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedSymptoms([]);
        setDuration('');
        setSeverity('Medium');
        setResult(null);
    };

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
                        <span className="text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full">Symptom Checker</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">AI Diagnostic</h1>
                    <p className="text-gray-500 mt-2 font-medium">Professional AI health assessment at your fingertips.</p>
                </div>
                <div className="hidden md:block">
                    <span className="text-6xl grayscale opacity-20 hover:grayscale-0 transition-all duration-500 hover:scale-110 cursor-default">🩺</span>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Input Section - Left Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Symptom Selection Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-teal-500/5 hover:shadow-2xl hover:shadow-teal-500/10 transition-shadow duration-300 border border-gray-100/50"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-teal-600 font-bold">1</span>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">What are you feeling?</h3>
                                <p className="text-gray-400 text-sm">Select all that apply.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {commonSymptoms.map(symptom => (
                                <button
                                    key={symptom}
                                    onClick={() => toggleSymptom(symptom)}
                                    className={`px-4 py-4 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${selectedSymptoms.includes(symptom)
                                        ? 'bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-200 transform scale-105'
                                        : 'bg-gray-50 text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-md'
                                        }`}
                                >
                                    {symptom}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Details Selection Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-teal-500/5 hover:shadow-2xl hover:shadow-teal-500/10 transition-shadow duration-300 border border-gray-100/50"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-blue-600 font-bold">2</span>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Add Context</h3>
                                <p className="text-gray-400 text-sm">Help the AI understand better.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-extra-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Duration</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-gray-50 border-2 border-transparent hover:border-blue-100 focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none transition appearance-none cursor-pointer text-gray-700"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    >
                                        <option value="">Select how long...</option>
                                        <option value="Just started">Just started</option>
                                        <option value="1-2 days">1-2 days</option>
                                        <option value="3-5 days">3-5 days</option>
                                        <option value="Week or more">Week or more</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-extra-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Severity</label>
                                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 relative">
                                    {/* Sliding Background could be added here for extra polish, simple toggle for now */}
                                    {['Low', 'Medium', 'High'].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setSeverity(level)}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 z-10 ${severity === level
                                                ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-gray-900 transform scale-100'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Button */}
                    <motion.button
                        variants={itemVariants}
                        onClick={handleCheck}
                        disabled={selectedSymptoms.length === 0 || !duration || loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-5 rounded-[2rem] font-bold text-xl shadow-2xl transition-all relative overflow-hidden group ${selectedSymptoms.length > 0 && duration && !loading
                            ? 'bg-[#4ECDC4] text-white cursor-pointer shadow-[#4ECDC4]/30'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                    Running Diagnostics...
                                </>
                            ) : (
                                <>
                                    <span>🔍</span> Analyze Symptoms
                                </>
                            )}
                        </span>
                    </motion.button>

                </div>

                {/* Result Section - Right Column */}
                <div className="lg:col-span-1">
                    <AnimatePresence mode='wait'>
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/10 border border-gray-100 relative overflow-hidden h-full"
                            >
                                {/* Top Gradient Bar */}
                                <div className={`absolute top-0 left-0 w-full h-3 ${result.riskLevel === 'High' ? 'bg-red-500' :
                                    result.riskLevel === 'Medium' ? 'bg-orange-500' :
                                        'bg-green-500'
                                    }`}></div>

                                <div className="mb-8 mt-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${result.riskLevel === 'High' ? 'bg-red-50 text-red-600' :
                                            result.riskLevel === 'Medium' ? 'bg-orange-50 text-orange-600' :
                                                'bg-green-50 text-green-600'
                                            }`}>
                                            Risk: {result.riskLevel}
                                        </span>
                                        <span className="text-3xl">
                                            {result.riskLevel === 'High' ? '🚨' : result.riskLevel === 'Medium' ? '⚠️' : '✅'}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 leading-tight mb-2">Analysis Complete</h3>
                                    <p className="text-lg text-gray-600 font-medium">{result.possibleCondition}</p>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">Recommended Action</p>
                                        <p className="font-bold text-gray-800 text-lg leading-snug">{result.action}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide pl-2">AI Advice</p>
                                        <p className="text-gray-600 leading-relaxed pl-2 border-l-2 border-teal-100 text-sm">{result.advice}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-auto">
                                    {result.riskLevel === 'High' && (
                                        <Link
                                            to="/emergency"
                                            className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-center hover:bg-red-600 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2 animate-pulse"
                                        >
                                            <span>🆘</span> Emergency SOS
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleReset}
                                        className="w-full py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition"
                                    >
                                        New Check
                                    </button>
                                </div>

                                <p className="text-[10px] text-center text-gray-300 mt-6 pt-4 border-t border-gray-50">
                                    {result.disclaimer}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                variants={itemVariants}
                                className="bg-gradient-to-br from-[#ffffff] to-[#f8fafc] rounded-[2.5rem] p-8 border border-gray-100 text-center h-full flex flex-col justify-center items-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner text-teal-200 group-hover:scale-110 transition-transform duration-500">
                                    🩺
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10">AI Diagnostic</h3>
                                <p className="text-sm text-gray-400 max-w-[220px] leading-relaxed relative z-10">
                                    Fill in your symptoms and details on the left, and I'll generate a personalized health assessment.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </motion.div>
    );
};

export default SymptomChecker;
