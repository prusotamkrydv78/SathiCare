import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PeriodCalendar = ({ history, currentCycle, insights }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);

    useEffect(() => {
        generateCalendar();
    }, [currentDate, history, currentCycle, insights]);

    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create calendar array
        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, status: null });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const status = getDayStatus(date);
            days.push({ day, date, status });
        }

        setCalendarDays(days);
    };

    const getDayStatus = (date) => {
        const dateStr = date.toISOString().split('T')[0];

        // Check if it's a logged period day
        if (history && history.length > 0) {
            for (const cycle of history) {
                const start = new Date(cycle.startDate);
                const end = cycle.endDate ? new Date(cycle.endDate) : start;

                if (date >= start && date <= end) {
                    return 'period';
                }
            }
        }

        // Check if it's a predicted period day
        if (insights?.prediction?.nextPeriodDate) {
            const predictedStart = new Date(insights.prediction.nextPeriodDate);
            const predictedEnd = new Date(predictedStart);
            predictedEnd.setDate(predictedEnd.getDate() + 5); // Assume 5-day period

            if (date >= predictedStart && date <= predictedEnd) {
                return 'predicted';
            }
        }

        // Check if it's in fertile window
        if (insights?.prediction?.fertileWindowStart && insights?.prediction?.fertileWindowEnd) {
            const fertileStart = new Date(insights.prediction.fertileWindowStart);
            const fertileEnd = new Date(insights.prediction.fertileWindowEnd);

            if (date >= fertileStart && date <= fertileEnd) {
                return 'fertile';
            }
        }

        // Check if it's ovulation day
        if (insights?.prediction?.ovulationDate) {
            const ovulation = new Date(insights.prediction.ovulationDate);
            if (date.toDateString() === ovulation.toDateString()) {
                return 'ovulation';
            }
        }

        // Check if it's today
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return 'today';
        }

        return 'normal';
    };

    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDayClassName = (status) => {
        const baseClass = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all';

        switch (status) {
            case 'period':
                return `${baseClass} bg-pink-500 text-white shadow-md`;
            case 'predicted':
                return `${baseClass} bg-pink-200 text-pink-700 border-2 border-pink-400 border-dashed`;
            case 'fertile':
                return `${baseClass} bg-green-100 text-green-700`;
            case 'ovulation':
                return `${baseClass} bg-purple-500 text-white shadow-md`;
            case 'today':
                return `${baseClass} bg-blue-100 text-blue-700 ring-2 ring-blue-400`;
            default:
                return `${baseClass} text-gray-600 hover:bg-gray-100`;
        }
    };

    return (
        <motion.div
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                    <motion.button
                        onClick={() => changeMonth(-1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 flex items-center justify-center transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        onClick={() => changeMonth(1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 flex items-center justify-center transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-2 mb-3">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((dayObj, index) => (
                    <motion.div
                        key={index}
                        className="flex justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                    >
                        {dayObj.day ? (
                            <div className={getDayClassName(dayObj.status)}>
                                {dayObj.day}
                            </div>
                        ) : (
                            <div className="w-10 h-10"></div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                        <span className="text-gray-600">Period</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-pink-200 border-2 border-pink-400 border-dashed"></div>
                        <span className="text-gray-600">Predicted</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200"></div>
                        <span className="text-gray-600">Fertile</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        <span className="text-gray-600">Ovulation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-100 ring-2 ring-blue-400"></div>
                        <span className="text-gray-600">Today</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PeriodCalendar;
