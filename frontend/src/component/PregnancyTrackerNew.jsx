import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Sparkles, MessageSquare, Plus } from 'lucide-react';
import pregnancyService from '../services/pregnancyService';
import { useDialog } from '../context/DialogContext';

// Import components
import PregnancyCalendar from './pregnancy/PregnancyCalendar';
import PregnancyInsights from './pregnancy/PregnancyInsights';
import PregnancyAIChat from './pregnancy/PregnancyAIChat';
import LogPregnancyModal from './pregnancy/LogPregnancyModal';

const PregnancyTrackerNew = () => {
    // Tab State
    const [activeTab, setActiveTab] = useState('Calendar');

    // Data State
    const [pregnancyData, setPregnancyData] = useState(null);
    const [weeklyTips, setWeeklyTips] = useState(null);

    // Loading States
    const [loading, setLoading] = useState({
        pregnancy: true,
        tips: false
    });

    // Modal State
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await Promise.all([
            fetchPregnancyData(),
            // Tips will be fetched after pregnancy data is loaded
        ]);
    };

    const fetchPregnancyData = async () => {
        try {
            setLoading(prev => ({ ...prev, pregnancy: true }));
            const response = await pregnancyService.getCurrentPregnancy();

            if (response.success) {
                setPregnancyData(response.data.pregnancy);
                // Fetch weekly tips if pregnancy exists
                if (response.data.pregnancy) {
                    fetchWeeklyTips();
                }
            }
        } catch (error) {
            console.error('Failed to fetch pregnancy data:', error);
            // Don't auto-show modal, user will click button manually
        } finally {
            setLoading(prev => ({ ...prev, pregnancy: false }));
        }
    };

    const fetchWeeklyTips = async (force = false) => {
        try {
            setLoading(prev => ({ ...prev, tips: true }));
            const response = await pregnancyService.getWeeklyTips(force);
            if (response.success) {
                setWeeklyTips(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch weekly tips:', error);
        } finally {
            setLoading(prev => ({ ...prev, tips: false }));
        }
    };

    // Handle log pregnancy (start + health log)
    const { showDialog } = useDialog();

    const handleLogPregnancy = async (formData) => {
        try {
            // If no pregnancy exists, start one first
            if (!pregnancyData) {
                const startResponse = await pregnancyService.startPregnancy({ lmpDate: formData.lmpDate });

                if (startResponse.success) {
                    setPregnancyData(startResponse.data.pregnancy);

                    // Then add health log if any health data was provided
                    if (formData.weight || formData.bloodPressure.systolic || formData.symptoms.length > 0) {
                        await pregnancyService.addHealthLog({
                            weight: formData.weight ? parseFloat(formData.weight) : undefined,
                            bloodPressure: (formData.bloodPressure.systolic && formData.bloodPressure.diastolic)
                                ? formData.bloodPressure
                                : undefined,
                            symptoms: formData.symptoms,
                            mood: formData.mood,
                            babyMovements: formData.babyMovements ? parseInt(formData.babyMovements) : undefined,
                            notes: formData.notes
                        });
                    }

                    setIsLogModalOpen(false);
                    await fetchAllData(); // Refresh all data
                    showDialog({
                        title: 'Success',
                        message: 'Pregnancy tracking started successfully!',
                        type: 'success'
                    });
                }
            } else {
                // Update existing pregnancy
                await pregnancyService.updatePregnancy({ lmpDate: formData.lmpDate });

                // Add health log
                if (formData.weight || formData.bloodPressure.systolic || formData.symptoms.length > 0) {
                    await pregnancyService.addHealthLog({
                        weight: formData.weight ? parseFloat(formData.weight) : undefined,
                        bloodPressure: (formData.bloodPressure.systolic && formData.bloodPressure.diastolic)
                            ? formData.bloodPressure
                            : undefined,
                        symptoms: formData.symptoms,
                        mood: formData.mood,
                        babyMovements: formData.babyMovements ? parseInt(formData.babyMovements) : undefined,
                        notes: formData.notes
                    });
                }

                setIsLogModalOpen(false);
                await fetchAllData(); // Refresh all data
                showDialog({
                    title: 'Success',
                    message: 'Pregnancy updated successfully!',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error('Failed to log pregnancy:', error);
            showDialog({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to save pregnancy data. Please try again.',
                type: 'error'
            });
        }
    };

    // Tabs configuration - matching Period Tracker style
    const tabs = [
        { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
        { id: 'Insights', label: 'Insights', icon: Sparkles },
        { id: 'AI Chat', label: 'AI Chat', icon: MessageSquare }
    ];

    return (
        <div className="font-sans text-gray-800">
            {/* Page Header - Matching Period Tracker */}
            <motion.header
                className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition text-sm">
                            Dashboard
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-600 font-medium text-sm">Pregnancy Tracker</span>
                    </div>
                    <h1 className="text-2xl font-bold">Pregnancy Tracker</h1>
                    <p className="text-gray-500 text-sm">
                        {pregnancyData
                            ? `Week ${pregnancyData.currentWeek} - Your journey to motherhood`
                            : 'Track your pregnancy journey'
                        }
                    </p>
                </div>

                {/* Tab Navigation - Matching Period Tracker */}
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'Calendar' && (
                            <motion.div
                                key="calendar"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PregnancyCalendar
                                    pregnancyData={pregnancyData}
                                    weeklyTips={weeklyTips}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'Insights' && (
                            <motion.div
                                key="insights"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PregnancyInsights
                                    weeklyTips={weeklyTips}
                                    pregnancyData={pregnancyData}
                                    loading={loading.tips}
                                    onRefresh={() => fetchWeeklyTips(true)}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'AI Chat' && (
                            <motion.div
                                key="ai-chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PregnancyAIChat />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar - Matching Period Tracker */}
                <div className="space-y-4">
                    {/* Consult Doctor */}
                    <Link to="/consultations">
                        <motion.div
                            className="w-full py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-xl">👩‍⚕️</span>
                            <span>Consult a Doctor</span>
                        </motion.div>
                    </Link>

                    {/* Log Pregnancy Button */}
                    <motion.button
                        onClick={() => setIsLogModalOpen(true)}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-pink-200 hover:shadow-xl transition flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>{pregnancyData ? 'Log Health Data' : 'Start Tracking'}</span>
                    </motion.button>

                    {/* Quick Stats - Matching Period Tracker */}
                    {pregnancyData && (
                        <motion.div
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm border border-purple-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Quick Stats</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Current Week:</span>
                                    <span className="font-semibold text-purple-600">{pregnancyData.currentWeek}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trimester:</span>
                                    <span className="font-semibold text-pink-600">{pregnancyData.trimester}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Days to Go:</span>
                                    <span className="font-semibold text-indigo-600">
                                        {Math.max(0, 280 - pregnancyData.currentDay)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Due Date:</span>
                                    <span className="font-semibold text-blue-600">
                                        {new Date(pregnancyData.dueDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Emergency Contact - Matching style */}
                    <motion.div
                        className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 shadow-sm border border-red-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
                            <span>🚨</span> Emergency
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                            Call your doctor if you experience severe pain, bleeding, or reduced baby movements.
                        </p>
                        <Link to="/emergency">
                            <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition text-sm">
                                Emergency SOS
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Log Pregnancy Modal */}
            <LogPregnancyModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSubmit={handleLogPregnancy}
                existingData={pregnancyData}
            />
        </div>
    );
};

export default PregnancyTrackerNew;
