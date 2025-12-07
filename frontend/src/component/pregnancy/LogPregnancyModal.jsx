import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Activity } from 'lucide-react';
import pregnancyService from '../../services/pregnancyService';
import { useDialog } from '../../context/DialogContext';

const LogPregnancyModal = ({ isOpen, onClose, onSubmit, existingData }) => {
    const { showDialog } = useDialog();
    const [inputMethod, setInputMethod] = useState('lmp'); // 'lmp' or 'week'
    const [formData, setFormData] = useState({
        lmpDate: existingData?.lmpDate ? new Date(existingData.lmpDate).toISOString().split('T')[0] : '',
        currentWeek: '',
        weight: '',
        bloodPressure: { systolic: '', diastolic: '' },
        symptoms: [],
        mood: '',
        babyMovements: '',
        notes: ''
    });

    const symptomOptions = [
        'nausea', 'vomiting', 'fatigue', 'headache', 'back_pain',
        'swelling', 'cramps', 'bleeding', 'discharge', 'contractions',
        'dizziness', 'heartburn', 'constipation', 'mood_swings'
    ];

    const moodOptions = [
        { value: 'happy', emoji: '😊', label: 'Happy' },
        { value: 'anxious', emoji: '😰', label: 'Anxious' },
        { value: 'tired', emoji: '😴', label: 'Tired' },
        { value: 'excited', emoji: '🤩', label: 'Excited' },
        { value: 'worried', emoji: '😟', label: 'Worried' },
        { value: 'normal', emoji: '😐', label: 'Normal' }
    ];

    const toggleSymptom = (symptom) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate based on input method
        if (inputMethod === 'lmp' && !formData.lmpDate) {
            showDialog({
                title: 'Missing Information',
                message: 'Please provide your Last Menstrual Period (LMP) date',
                type: 'warning'
            });
            return;
        }

        if (inputMethod === 'week' && !formData.currentWeek) {
            showDialog({
                title: 'Missing Information',
                message: 'Please provide your current pregnancy week',
                type: 'warning'
            });
            return;
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {existingData ? 'Update Pregnancy' : 'Start Pregnancy Tracking'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {existingData ? 'Update your pregnancy details' : 'Enter your pregnancy details to get started'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Input Method Selection */}
                        {!existingData && (
                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                <label className="block text-sm font-bold text-blue-900 mb-3">
                                    How would you like to start tracking?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setInputMethod('lmp')}
                                        className={`p-4 rounded-xl border-2 transition flex items-center gap-3 ${inputMethod === 'lmp'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 bg-white hover:border-purple-300'
                                            }`}
                                    >
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-sm">I know my LMP date</div>
                                            <div className="text-xs text-gray-500">First day of last period</div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setInputMethod('week')}
                                        className={`p-4 rounded-xl border-2 transition flex items-center gap-3 ${inputMethod === 'week'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 bg-white hover:border-purple-300'
                                            }`}
                                    >
                                        <Activity className="w-5 h-5 text-purple-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-sm">I'm already pregnant</div>
                                            <div className="text-xs text-gray-500">Enter current week</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* LMP Date Input */}
                        {inputMethod === 'lmp' && (
                            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                                <label className="flex items-center gap-2 text-sm font-bold text-purple-900 mb-3">
                                    <Calendar className="w-4 h-4" />
                                    Last Menstrual Period (LMP) Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.lmpDate}
                                    onChange={(e) => setFormData({ ...formData, lmpDate: e.target.value })}
                                    required={inputMethod === 'lmp'}
                                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                />
                                <p className="text-xs text-purple-600 mt-2">
                                    💡 The first day of your last period. We'll calculate your due date automatically.
                                </p>
                            </div>
                        )}

                        {/* Current Week Input */}
                        {inputMethod === 'week' && (
                            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                                <label className="flex items-center gap-2 text-sm font-bold text-purple-900 mb-3">
                                    <Activity className="w-4 h-4" />
                                    Current Pregnancy Week *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="42"
                                    value={formData.currentWeek}
                                    onChange={(e) => setFormData({ ...formData, currentWeek: e.target.value })}
                                    required={inputMethod === 'week'}
                                    placeholder="e.g., 12"
                                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                />
                                <p className="text-xs text-purple-600 mt-2">
                                    💡 Enter your current pregnancy week (1-42). We'll calculate your LMP and due date.
                                </p>
                            </div>
                        )}

                        {/* Health Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Weight */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Activity className="w-4 h-4" />
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    placeholder="65.5"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                />
                            </div>

                            {/* Baby Movements */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    Baby Movements (count)
                                </label>
                                <input
                                    type="number"
                                    value={formData.babyMovements}
                                    onChange={(e) => setFormData({ ...formData, babyMovements: e.target.value })}
                                    placeholder="10"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                />
                            </div>
                        </div>

                        {/* Blood Pressure */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                Blood Pressure (mmHg)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="number"
                                    value={formData.bloodPressure.systolic}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        bloodPressure: { ...formData.bloodPressure, systolic: e.target.value }
                                    })}
                                    placeholder="Systolic (120)"
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                />
                                <input
                                    type="number"
                                    value={formData.bloodPressure.diastolic}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        bloodPressure: { ...formData.bloodPressure, diastolic: e.target.value }
                                    })}
                                    placeholder="Diastolic (80)"
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                />
                            </div>
                        </div>

                        {/* Mood */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                How are you feeling?
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {moodOptions.map(mood => (
                                    <button
                                        key={mood.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mood: mood.value })}
                                        className={`px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${formData.mood === mood.value
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className="text-xl">{mood.emoji}</span>
                                        <span>{mood.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Symptoms */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-3 block">
                                Symptoms (Select all that apply)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {symptomOptions.map(symptom => (
                                    <button
                                        key={symptom}
                                        type="button"
                                        onClick={() => toggleSymptom(symptom)}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${formData.symptoms.includes(symptom)
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {symptom.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">
                                Additional Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional notes about how you're feeling..."
                                rows="3"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                            >
                                {existingData ? 'Update Pregnancy' : 'Start Tracking'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LogPregnancyModal;
