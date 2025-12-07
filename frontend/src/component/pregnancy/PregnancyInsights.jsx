import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

const PregnancyInsights = ({ weeklyTips, pregnancyData, loading, onRefresh }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500">Loading AI insights...</p>
                </div>
            </div>
        );
    }

    if (!pregnancyData) {
        return (
            <motion.div
                className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Insights Available</h3>
                <p className="text-gray-500">Start tracking to get personalized AI insights</p>
            </motion.div>
        );
    }

    const tips = weeklyTips?.tips || {};

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                        AI-Powered Insights
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Week {pregnancyData.currentWeek} • Trimester {pregnancyData.trimester}
                    </p>
                </div>
                <motion.button
                    onClick={onRefresh}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-purple-100 text-purple-600 rounded-xl font-semibold hover:bg-purple-200 transition flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </motion.button>
            </div>

            {/* Baby Development */}
            {tips.babyDevelopment && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-sm border border-blue-100"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                            👶
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-blue-900 mb-3">Baby's Development</h3>
                            <p className="text-blue-800 leading-relaxed">{tips.babyDevelopment}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Mom's Changes */}
            {tips.momChanges && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-6 shadow-sm border border-pink-100"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                            🤰
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-pink-900 mb-3">Your Body Changes</h3>
                            <p className="text-pink-800 leading-relaxed">{tips.momChanges}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Grid Layout for Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nutrition */}
                {tips.nutrition && tips.nutrition.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                                🥗
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Nutrition Tips</h3>
                        </div>
                        <ul className="space-y-2">
                            {tips.nutrition.map((tip, index) => (
                                <li key={index} className="flex gap-3 text-sm text-gray-700">
                                    <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Exercise */}
                {tips.exercise && tips.exercise.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
                                🏃‍♀️
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Exercise Tips</h3>
                        </div>
                        <ul className="space-y-2">
                            {tips.exercise.map((tip, index) => (
                                <li key={index} className="flex gap-3 text-sm text-gray-700">
                                    <span className="text-purple-500 font-bold flex-shrink-0">✓</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Symptoms */}
                {tips.symptoms && tips.symptoms.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">
                                💊
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Common Symptoms</h3>
                        </div>
                        <ul className="space-y-2">
                            {tips.symptoms.map((symptom, index) => (
                                <li key={index} className="flex gap-3 text-sm text-gray-700">
                                    <span className="text-yellow-500 font-bold flex-shrink-0">•</span>
                                    <span>{symptom}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>

            {/* Warnings */}
            {tips.warnings && tips.warnings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 shadow-sm border-2 border-red-200"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                            ⚠️
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-red-900 mb-3">Important Warnings</h3>
                            <ul className="space-y-2">
                                {tips.warnings.map((warning, index) => (
                                    <li key={index} className="flex gap-3 text-sm text-red-800">
                                        <span className="text-red-500 font-bold flex-shrink-0">!</span>
                                        <span className="font-medium">{warning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {!tips.babyDevelopment && !tips.momChanges && (!tips.nutrition || tips.nutrition.length === 0) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center"
                >
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Generating Insights...</h3>
                    <p className="text-gray-500 mb-4">Our AI is preparing personalized insights for you</p>
                    <button
                        onClick={onRefresh}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                        Generate Insights
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default PregnancyInsights;
