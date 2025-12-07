import React from 'react';
import { motion } from 'framer-motion';

const CurrentCycleCard = ({ cycleData, loading }) => {
    if (loading) {
        return (
            <div className="bg-gradient-to-r from-pink-500 to-pink-400 rounded-3xl p-8 text-white shadow-xl h-48 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!cycleData) {
        return (
            <motion.div
                className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl p-8 text-white shadow-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className="text-lg font-semibold mb-2">No Period Data</p>
                <p className="text-sm opacity-90">Log your first period to get started!</p>
            </motion.div>
        );
    }

    const { currentDay, isOnPeriod, cycle } = cycleData;
    const nextPeriod = cycle?.predictions?.nextPeriodDate;

    // Calculate phase
    let phase = 'Follicular Phase';
    if (isOnPeriod) {
        phase = 'Menstruation';
    } else if (currentDay >= 12 && currentDay <= 16) {
        phase = 'Ovulation Phase';
    } else if (currentDay >= 17) {
        phase = 'Luteal Phase';
    }

    // Calculate days until next period
    let daysUntilNext = null;
    if (nextPeriod) {
        const today = new Date();
        const nextDate = new Date(nextPeriod);
        daysUntilNext = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    }

    return (
        <motion.div
            className="bg-gradient-to-r from-pink-500 to-pink-400 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="relative z-10 text-center md:text-left">
                <motion.h2
                    className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.2 }}
                >
                    Current Cycle
                </motion.h2>
                <motion.p
                    className="text-5xl font-black mb-2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                >
                    Day {currentDay}
                </motion.p>
                <motion.span
                    className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold border border-white/30 inline-block"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {phase}
                </motion.span>
            </div>

            <motion.div
                className="mt-8 md:mt-0 relative z-10 text-center md:text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
            >
                <p className="text-sm opacity-90 mb-1">Prediction</p>
                {nextPeriod ? (
                    <>
                        <p className="text-2xl font-bold">
                            {daysUntilNext > 0 ? `In ${daysUntilNext} Days` : 'Today'}
                        </p>
                        <p className="text-xs opacity-75 mt-2">
                            {new Date(nextPeriod).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </>
                ) : (
                    <p className="text-lg opacity-75">Log more cycles for prediction</p>
                )}
            </motion.div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </motion.div>
    );
};

export default CurrentCycleCard;
