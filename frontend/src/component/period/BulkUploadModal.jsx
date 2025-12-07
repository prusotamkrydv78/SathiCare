import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2, Calendar, Check } from 'lucide-react';
import periodService from '../../services/periodService';

const BulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
    const [periods, setPeriods] = useState([
        { id: 1, startDate: '', endDate: '', notes: '' }
    ]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    if (!isOpen) return null;

    const addPeriod = () => {
        setPeriods([...periods, {
            id: Date.now(),
            startDate: '',
            endDate: '',
            notes: ''
        }]);
    };

    const removePeriod = (id) => {
        if (periods.length > 1) {
            setPeriods(periods.filter(p => p.id !== id));
        }
    };

    const updatePeriod = (id, field, value) => {
        setPeriods(periods.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const handleUpload = async () => {
        // Validate all periods
        const validPeriods = periods.filter(p => p.startDate);

        if (validPeriods.length === 0) {
            alert('Please add at least one period with a start date');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            let successCount = 0;
            const total = validPeriods.length;

            for (let i = 0; i < validPeriods.length; i++) {
                const period = validPeriods[i];

                try {
                    await periodService.logPeriod({
                        startDate: period.startDate,
                        endDate: period.endDate || null,
                        symptoms: {
                            pain: { level: 0, location: [] },
                            mood: [],
                            physicalSymptoms: []
                        },
                        notes: period.notes || ''
                    });

                    successCount++;
                    setUploadProgress(Math.round(((i + 1) / total) * 100));
                } catch (err) {
                    console.error('Failed to upload period:', err);
                }
            }

            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
                setPeriods([{ id: 1, startDate: '', endDate: '', notes: '' }]);
                onSuccess();
                alert(`Successfully uploaded ${successCount} of ${total} periods!`);
                onClose();
            }, 500);

        } catch (error) {
            console.error('Bulk upload error:', error);
            setUploading(false);
            alert('Failed to upload periods. Please try again.');
        }
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return null;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        return days > 0 ? days : null;
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
                    className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Upload Previous Periods</h3>
                            <p className="text-gray-500 text-sm">Add multiple past periods at once</p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                        <motion.div
                            className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-blue-700">
                                    Uploading periods...
                                </span>
                                <span className="text-sm font-bold text-blue-700">
                                    {uploadProgress}%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Periods List */}
                    <div className="space-y-4 mb-6">
                        {periods.map((period, index) => {
                            const duration = calculateDuration(period.startDate, period.endDate);

                            return (
                                <motion.div
                                    key={period.id}
                                    className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <span className="font-semibold text-gray-700">Period #{index + 1}</span>
                                        </div>
                                        {periods.length > 1 && (
                                            <motion.button
                                                type="button"
                                                onClick={() => removePeriod(period.id)}
                                                disabled={uploading}
                                                className="p-2 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </motion.button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Start Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={period.startDate}
                                                onChange={(e) => updatePeriod(period.id, 'startDate', e.target.value)}
                                                max={new Date().toISOString().split('T')[0]}
                                                disabled={uploading}
                                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm disabled:opacity-50"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                End Date (Optional)
                                            </label>
                                            <input
                                                type="date"
                                                value={period.endDate}
                                                onChange={(e) => updatePeriod(period.id, 'endDate', e.target.value)}
                                                min={period.startDate}
                                                max={new Date().toISOString().split('T')[0]}
                                                disabled={uploading || !period.startDate}
                                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-sm disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {duration && (
                                        <div className="mb-3 bg-white/60 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs text-blue-700 font-medium">
                                                Duration: {duration} day{duration > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Notes (Optional)
                                        </label>
                                        <textarea
                                            value={period.notes}
                                            onChange={(e) => updatePeriod(period.id, 'notes', e.target.value)}
                                            disabled={uploading}
                                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none transition text-sm disabled:opacity-50"
                                            rows="2"
                                            maxLength="200"
                                            placeholder="Any notes about this period..."
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Add More Button */}
                    <motion.button
                        type="button"
                        onClick={addPeriod}
                        disabled={uploading}
                        className="w-full py-3 mb-4 bg-white border-2 border-dashed border-pink-300 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        whileHover={{ scale: uploading ? 1 : 1.02 }}
                        whileTap={{ scale: uploading ? 1 : 0.98 }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Another Period</span>
                    </motion.button>

                    {/* Upload Button */}
                    <motion.button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading || periods.every(p => !p.startDate)}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: uploading ? 1 : 1.02 }}
                        whileTap={{ scale: uploading ? 1 : 0.98 }}
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                <span>Upload {periods.filter(p => p.startDate).length} Period{periods.filter(p => p.startDate).length !== 1 ? 's' : ''}</span>
                            </>
                        )}
                    </motion.button>

                    {/* Help Text */}
                    <p className="text-center text-xs text-gray-500 mt-4">
                        💡 Add all your previous periods to get better AI predictions
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BulkUploadModal;
