import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Activity, AlertCircle, Sparkles, Heart } from 'lucide-react';

const PeriodInsights = ({ stats, insights, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!stats && !insights) {
        return (
            <motion.div
                className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Insights Yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Log at least 3 cycles to get AI-powered insights and predictions.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <StatCard
                        icon={<Calendar className="w-5 h-5" />}
                        label="Average Cycle"
                        value={`${stats.averageCycleLength} days`}
                        color="pink"
                        delay={0.1}
                    />
                    <StatCard
                        icon={<Activity className="w-5 h-5" />}
                        label="Period Duration"
                        value={`${stats.averagePeriodDuration} days`}
                        color="purple"
                        delay={0.2}
                    />
                    <StatCard
                        icon={<TrendingUp className="w-5 h-5" />}
                        label="Cycles Logged"
                        value={stats.totalCyclesLogged}
                        color="blue"
                        delay={0.3}
                    />
                    <StatCard
                        icon={stats.isIrregular ? <AlertCircle className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                        label="Regularity"
                        value={stats.isIrregular ? 'Irregular' : 'Regular'}
                        color={stats.isIrregular ? 'orange' : 'green'}
                        delay={0.4}
                    />
                </motion.div>
            )}

            {/* Cycle Range */}
            {stats?.cycleLengthRange && (
                <motion.div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-pink-500" />
                        Cycle Length Range
                    </h4>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                                    style={{ width: '100%' }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-600">
                                <span>{stats.cycleLengthRange.min} days</span>
                                <span>{stats.cycleLengthRange.max} days</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* AI Insights */}
            {insights && (
                <>
                    {/* Predictions */}
                    {insights.prediction && (
                        <motion.div
                            className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-pink-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-pink-500" />
                                AI Predictions
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {insights.prediction.nextPeriodDate && (
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                                        <p className="text-xs text-gray-600 mb-1">Next Period</p>
                                        <p className="font-bold text-pink-600">
                                            {new Date(insights.prediction.nextPeriodDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}
                                {insights.prediction.ovulationDate && (
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                                        <p className="text-xs text-gray-600 mb-1">Ovulation</p>
                                        <p className="font-bold text-purple-600">
                                            {new Date(insights.prediction.ovulationDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Patterns */}
                    {insights.patterns?.patterns && insights.patterns.patterns.length > 0 && (
                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h4 className="font-semibold text-gray-800 mb-3">Detected Patterns</h4>
                            <ul className="space-y-2">
                                {insights.patterns.patterns.map((pattern, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-gray-700"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + (index * 0.1) }}
                                    >
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>{pattern}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Recommendations */}
                    {insights.patterns?.recommendations && insights.patterns.recommendations.length > 0 && (
                        <motion.div
                            className="bg-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-500" />
                                AI Recommendations
                            </h4>
                            <ul className="space-y-2">
                                {insights.patterns.recommendations.map((rec, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-gray-700"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.0 + (index * 0.1) }}
                                    >
                                        <span className="text-blue-500 mt-0.5">💡</span>
                                        <span>{rec}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Irregularities */}
                    {insights.patterns?.irregularities && insights.patterns.irregularities.length > 0 && (
                        <motion.div
                            className="bg-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                        >
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                Irregularities Detected
                            </h4>
                            <ul className="space-y-2">
                                {insights.patterns.irregularities.map((irr, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-gray-700"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.2 + (index * 0.1) }}
                                    >
                                        <span className="text-orange-500 mt-0.5">⚠️</span>
                                        <span>{irr}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color, delay }) => {
    const colorClasses = {
        pink: 'bg-pink-50 text-pink-600 border-pink-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100'
    };

    return (
        <motion.div
            className={`${colorClasses[color]} rounded-2xl p-4 shadow-sm border`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    {icon}
                </div>
                <div>
                    <p className="text-xs text-gray-600 mb-0.5">{label}</p>
                    <p className="text-xl font-bold">{value}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default PeriodInsights;
