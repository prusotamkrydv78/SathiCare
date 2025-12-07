import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trash2, Edit } from 'lucide-react';

const PeriodHistory = ({ cycles, loading, onDelete, onEdit, pagination, onPageChange }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!cycles || cycles.length === 0) {
        return (
            <motion.div
                className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Period History</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Start logging your periods to track your cycle history.
                </p>
            </motion.div>
        );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateDuration = (start, end) => {
        if (!end) return 'Ongoing';
        const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
        return `${days} day${days > 1 ? 's' : ''}`;
    };

    return (
        <div className="space-y-6">
            <motion.div
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Period History</h3>

                <div className="space-y-3">
                    <AnimatePresence>
                        {cycles.map((cycle, index) => (
                            <motion.div
                                key={cycle._id}
                                className="p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition-colors border border-gray-100"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-pink-500" />
                                            <span className="font-semibold text-gray-800">
                                                {formatDate(cycle.startDate)}
                                                {cycle.endDate && ` - ${formatDate(cycle.endDate)}`}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-md font-medium">
                                                {calculateDuration(cycle.startDate, cycle.endDate)}
                                            </span>

                                            {cycle.cycleLength && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-medium">
                                                    {cycle.cycleLength} day cycle
                                                </span>
                                            )}

                                            {cycle.symptoms?.pain?.level > 0 && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md font-medium">
                                                    Pain: {cycle.symptoms.pain.level}/10
                                                </span>
                                            )}
                                        </div>

                                        {cycle.notes && (
                                            <p className="mt-2 text-sm text-gray-600 italic">
                                                "{cycle.notes}"
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <motion.button
                                            onClick={() => onEdit(cycle)}
                                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => onDelete(cycle._id)}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                        </p>
                        <div className="flex gap-2">
                            <motion.button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                                whileHover={{ scale: pagination.page === 1 ? 1 : 1.05 }}
                                whileTap={{ scale: pagination.page === 1 ? 1 : 0.95 }}
                            >
                                Previous
                            </motion.button>
                            <motion.button
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
                                whileHover={{ scale: pagination.page === pagination.pages ? 1 : 1.05 }}
                                whileTap={{ scale: pagination.page === pagination.pages ? 1 : 0.95 }}
                            >
                                Next
                            </motion.button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PeriodHistory;
