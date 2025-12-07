import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon } from 'lucide-react';

const LogPeriodModal = ({ isOpen, onClose, formData, onChange, onSymptomChange, onSubmit }) => {
    if (!isOpen) return null;

    const painLocations = ['abdomen', 'lower_back', 'legs', 'head', 'breasts'];
    const moods = ['happy', 'sad', 'irritable', 'anxious', 'tired'];
    const physicalSymptoms = ['bloating', 'cramps', 'headache', 'nausea', 'fatigue', 'acne'];

    const toggleArrayItem = (array, item) => {
        return array.includes(item)
            ? array.filter(i => i !== item)
            : [...array, item];
    };

    // Quick date presets
    const setQuickDate = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        onChange('startDate', date.toISOString().split('T')[0]);
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Log Period</h3>
                            <p className="text-gray-500 text-sm">Log current or previous periods</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Quick Date Selection */}
                    

                        {/* Date Selection */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => onChange('startDate', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    First day of your period
                                </p>
                            </div>
                        </div>

                        {/* Predicted Duration Info */}
                        <motion.div
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                        Automatic Duration Prediction
                                    </h4>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        We'll automatically predict your period end date based on your previous cycles' average duration.
                                        This helps provide more accurate AI insights and predictions.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Pain Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Pain Level: <span className="text-pink-600 text-lg">{formData.symptoms.pain.level}/10</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={formData.symptoms.pain.level}
                                onChange={(e) => onSymptomChange('pain', { ...formData.symptoms.pain, level: parseInt(e.target.value) })}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>No Pain</span>
                                <span>Moderate</span>
                                <span>Severe</span>
                            </div>
                        </div>

                        {/* Pain Location */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Pain Location {formData.symptoms.pain.location.length > 0 && (
                                    <span className="text-pink-600">({formData.symptoms.pain.location.length} selected)</span>
                                )}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {painLocations.map(loc => (
                                    <motion.button
                                        key={loc}
                                        type="button"
                                        onClick={() => onSymptomChange('pain', {
                                            ...formData.symptoms.pain,
                                            location: toggleArrayItem(formData.symptoms.pain.location, loc)
                                        })}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition border-2 ${formData.symptoms.pain.location.includes(loc)
                                            ? 'bg-pink-500 text-white border-pink-500'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {loc.replace('_', ' ')}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Mood */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Mood {formData.symptoms.mood.length > 0 && (
                                    <span className="text-purple-600">({formData.symptoms.mood.length} selected)</span>
                                )}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {moods.map(mood => (
                                    <motion.button
                                        key={mood}
                                        type="button"
                                        onClick={() => onSymptomChange('mood', toggleArrayItem(formData.symptoms.mood, mood))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize border-2 ${formData.symptoms.mood.includes(mood)
                                            ? 'bg-purple-500 text-white border-purple-500'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {mood}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Physical Symptoms */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Physical Symptoms {formData.symptoms.physicalSymptoms.length > 0 && (
                                    <span className="text-indigo-600">({formData.symptoms.physicalSymptoms.length} selected)</span>
                                )}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {physicalSymptoms.map(symptom => (
                                    <motion.button
                                        key={symptom}
                                        type="button"
                                        onClick={() => onSymptomChange('physicalSymptoms', toggleArrayItem(formData.symptoms.physicalSymptoms, symptom))}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize border-2 ${formData.symptoms.physicalSymptoms.includes(symptom)
                                            ? 'bg-indigo-500 text-white border-indigo-500'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {symptom}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => onChange('notes', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none transition"
                                rows="3"
                                maxLength="500"
                                placeholder="Any additional notes about your period..."
                            />
                            <p className="mt-1 text-xs text-gray-500 text-right">
                                {formData.notes.length}/500 characters
                            </p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition text-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Save Period Log
                        </motion.button>

                        {/* Help Text */}
                        <p className="text-center text-xs text-gray-500">
                            💡 You can log periods from any date - current or previous months
                        </p>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LogPeriodModal;
