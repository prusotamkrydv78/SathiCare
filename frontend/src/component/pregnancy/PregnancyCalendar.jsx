import React from 'react';
import { motion } from 'framer-motion';

const PregnancyCalendar = ({ pregnancyData, weeklyTips }) => {
    if (!pregnancyData) {
        return (
            <motion.div
                className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-6xl mb-4">🤰</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Pregnancy</h3>
                <p className="text-gray-500">Start tracking to see your pregnancy calendar</p>
            </motion.div>
        );
    }

    const { currentWeek, currentDay, trimester, dueDate, lmpDate } = pregnancyData;

    // Calculate weeks for each trimester
    const trimesters = [
        { name: '1st Trimester', weeks: Array.from({ length: 13 }, (_, i) => i + 1), color: 'bg-blue-500' },
        { name: '2nd Trimester', weeks: Array.from({ length: 14 }, (_, i) => i + 14), color: 'bg-purple-500' },
        { name: '3rd Trimester', weeks: Array.from({ length: 14 }, (_, i) => i + 28), color: 'bg-pink-500' }
    ];

    // Get baby size for current week
    const getBabySize = (week) => {
        const sizes = {
            4: { emoji: '🫘', name: 'Poppy Seed', size: '2mm' },
            8: { emoji: '🫐', name: 'Raspberry', size: '1.6cm' },
            12: { emoji: '🍋', name: 'Lime', size: '5.4cm' },
            16: { emoji: '🥑', name: 'Avocado', size: '11.6cm' },
            20: { emoji: '🍌', name: 'Banana', size: '16.4cm' },
            24: { emoji: '🌽', name: 'Corn', size: '30cm' },
            28: { emoji: '🥥', name: 'Coconut', size: '37.6cm' },
            32: { emoji: '🍍', name: 'Pineapple', size: '42.4cm' },
            36: { emoji: '🎃', name: 'Small Pumpkin', size: '47.4cm' },
            40: { emoji: '🍉', name: 'Watermelon', size: '51.2cm' }
        };

        const weeks = Object.keys(sizes).map(Number).sort((a, b) => a - b);
        const closestWeek = weeks.reduce((prev, curr) =>
            Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
        );

        return sizes[closestWeek] || sizes[4];
    };

    const babySize = getBabySize(currentWeek);

    return (
        <div className="space-y-6">
            {/* Current Week Highlight */}
            <motion.div
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90 mb-2">You are currently in</p>
                        <h2 className="text-4xl font-black mb-2">Week {currentWeek}</h2>
                        <p className="text-lg opacity-90">Day {currentDay} • Trimester {trimester}</p>
                    </div>
                    <div className="text-center bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
                        <p className="text-6xl mb-2">{babySize.emoji}</p>
                        <p className="font-bold text-lg">{babySize.name}</p>
                        <p className="text-sm opacity-90">{babySize.size}</p>
                    </div>
                </div>

                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                    <div className="flex justify-between text-xs mb-2">
                        <span>LMP: {new Date(lmpDate).toLocaleDateString()}</span>
                        <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentDay / 280) * 100}%` }}
                            transition={{ duration: 1.5 }}
                            className="h-full bg-white rounded-full"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Trimester Calendar */}
            <motion.div
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-lg font-bold text-gray-800 mb-6">Pregnancy Timeline</h3>

                <div className="space-y-6">
                    {trimesters.map((tri, triIndex) => (
                        <div key={triIndex}>
                            <h4 className="text-sm font-bold text-gray-600 mb-3">{tri.name}</h4>
                            <div className="grid grid-cols-7 gap-2">
                                {tri.weeks.map(week => {
                                    const isPast = week < currentWeek;
                                    const isCurrent = week === currentWeek;
                                    const isFuture = week > currentWeek;

                                    return (
                                        <motion.div
                                            key={week}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: triIndex * 0.1 + week * 0.01 }}
                                            className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isCurrent
                                                ? `${tri.color} text-white shadow-lg scale-110`
                                                : isPast
                                                    ? 'bg-gray-200 text-gray-600'
                                                    : 'bg-gray-50 text-gray-400 border-2 border-dashed border-gray-200'
                                                }`}
                                        >
                                            {week}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Milestones */}
            <motion.div
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Key Milestones</h3>
                <div className="space-y-3">
                    <MilestoneItem
                        week={12}
                        currentWeek={currentWeek}
                        title="End of 1st Trimester"
                        description="Risk of miscarriage decreases significantly"
                    />
                    <MilestoneItem
                        week={20}
                        currentWeek={currentWeek}
                        title="Halfway There!"
                        description="Anatomy scan and gender reveal"
                    />
                    <MilestoneItem
                        week={28}
                        currentWeek={currentWeek}
                        title="3rd Trimester Begins"
                        description="Baby's survival rate increases dramatically"
                    />
                    <MilestoneItem
                        week={37}
                        currentWeek={currentWeek}
                        title="Full Term"
                        description="Baby is considered full term"
                    />
                    <MilestoneItem
                        week={40}
                        currentWeek={currentWeek}
                        title="Due Date"
                        description="Your estimated due date"
                    />
                </div>
            </motion.div>
        </div>
    );
};

// Milestone Item Component
const MilestoneItem = ({ week, currentWeek, title, description }) => {
    const isPast = week < currentWeek;
    const isCurrent = week === currentWeek;

    return (
        <div className={`flex items-start gap-4 p-4 rounded-2xl transition ${isCurrent
            ? 'bg-purple-50 border-2 border-purple-500'
            : isPast
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50 border border-gray-200'
            }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isCurrent
                ? 'bg-purple-500 text-white'
                : isPast
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                {isPast ? '✓' : week}
            </div>
            <div className="flex-1">
                <h4 className={`font-bold mb-1 ${isCurrent ? 'text-purple-900' : isPast ? 'text-green-900' : 'text-gray-700'
                    }`}>
                    Week {week}: {title}
                </h4>
                <p className={`text-sm ${isCurrent ? 'text-purple-700' : isPast ? 'text-green-700' : 'text-gray-500'
                    }`}>
                    {description}
                </p>
            </div>
        </div>
    );
};

export default PregnancyCalendar;
