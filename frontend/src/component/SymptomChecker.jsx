import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

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

    return (
        <div className="font-sans text-gray-800 pb-12">

            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition">Dashboard</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-600 font-medium">Symptom Checker</span>
                </div>
                <h1 className="text-2xl font-bold">AI Symptom Checker</h1>
                <p className="text-gray-500 text-sm">Select your symptoms to get an instant AI assessment.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Input Section */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Symptom Selection */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">1. What are you feeling?</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {commonSymptoms.map(symptom => (
                                <button
                                    key={symptom}
                                    onClick={() => toggleSymptom(symptom)}
                                    className={`px-4 py-3 rounded-xl text-sm font-bold transition border ${selectedSymptoms.includes(symptom)
                                            ? 'bg-primary-pink text-white border-primary-pink shadow-md'
                                            : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                                        }`}
                                >
                                    {symptom}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details Selection */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">2. Add Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Duration</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-pink"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    <option value="">Select Duration</option>
                                    <option value="Just started">Just started</option>
                                    <option value="1-2 days">1-2 days</option>
                                    <option value="3-5 days">3-5 days</option>
                                    <option value="Week or more">Week or more</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Severity</label>
                                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                                    {['Low', 'Medium', 'High'].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setSeverity(level)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${severity === level ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleCheck}
                        disabled={selectedSymptoms.length === 0 || !duration || loading}
                        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition transform active:scale-95 ${selectedSymptoms.length > 0 && duration && !loading
                                ? 'bg-[#4ECDC4] text-white hover:bg-[#3dbdb4] hover:shadow-[#4ECDC4]/30'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                    </button>

                </div>

                {/* Result Section */}
                <div className="lg:col-span-1">
                    {result ? (
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-teal-100 animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#4ECDC4]"></div>

                            <div className="mb-6">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${result.riskLevel === 'High' ? 'bg-red-100 text-red-600' :
                                        result.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-600' :
                                            'bg-green-100 text-green-600'
                                    }`}>
                                    Risk Level: {result.riskLevel}
                                </span>
                                <h3 className="text-xl font-bold text-gray-800">{result.possibleCondition}</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Recommended Action</p>
                                    <p className="font-bold text-gray-800">{result.action}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Advice</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{result.advice}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleReset} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">
                                    Check Again
                                </button>
                                {result.riskLevel === 'High' && (
                                    <Link to="/emergency" className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-center hover:bg-red-600 transition shadow-lg shadow-red-200">
                                        SOS
                                    </Link>
                                )}
                            </div>

                            <p className="text-[10px] text-center text-gray-400 mt-4 border-t border-gray-100 pt-3">
                                {result.disclaimer}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 text-center h-full flex flex-col justify-center items-center opacity-70">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4 grayscale">
                                🩺
                            </div>
                            <h3 className="font-bold text-gray-400 mb-2">Ready to Help</h3>
                            <p className="text-xs text-gray-400 max-w-[200px]">
                                Select your symptoms and duration to receive an AI-powered assessment.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SymptomChecker;
