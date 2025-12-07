import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, History, Sparkles, Plus, X, Upload, MessageSquare } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import periodService from '../services/periodService';
import { useDialog } from '../context/DialogContext';
import PeriodAiChat from './PeriodAiChat';
import CurrentCycleCard from './period/CurrentCycleCard';
import PeriodHistory from './period/PeriodHistory';
import PeriodInsights from './period/PeriodInsights';
import LogPeriodModal from './period/LogPeriodModal';
import PeriodCalendar from './period/PeriodCalendar';
import BulkUploadModal from './period/BulkUploadModal';

const PeriodTracker = () => {
    // Tab State
    const [activeTab, setActiveTab] = useState('Calendar');

    // Data State
    const [cycleData, setCycleData] = useState(null);
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [insights, setInsights] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Loading States
    const [loading, setLoading] = useState({
        cycle: true,
        stats: true,
        history: true,
        insights: true
    });
    const [error, setError] = useState(null);

    // Modal State
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // AI Chat State
    const [mainChatMessages, setMainChatMessages] = useState([
        { id: 1, text: "Hi! Ask me anything about your cycle or symptoms. 🌸", sender: 'ai' }
    ]);
    const [mainChatInput, setMainChatInput] = useState('');
    const [mainChatLoading, setMainChatLoading] = useState(false);
    const mainChatEndRef = useRef(null);

    // Log Form State
    const [logForm, setLogForm] = useState({
        startDate: new Date().toISOString().split('T')[0],
        flowIntensity: [],
        symptoms: {
            pain: { level: 0, location: [] },
            mood: [],
            physicalSymptoms: []
        },
        notes: ''
    });

    // Fetch all data on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    // Fetch history when page changes
    useEffect(() => {
        if (currentPage > 1) {
            fetchHistory(currentPage);
        }
    }, [currentPage]);

    const fetchAllData = async () => {
        await Promise.all([
            fetchCurrentCycle(),
            fetchStats(),
            fetchHistory(1),
            fetchInsights()
        ]);
    };

    const fetchCurrentCycle = async () => {
        try {
            setLoading(prev => ({ ...prev, cycle: true }));
            const response = await periodService.getCurrentCycle();
            if (response.success) {
                setCycleData(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch current cycle:', err);
            // Not an error if no data exists yet
            if (err.response?.status !== 404) {
                setError('Failed to load cycle data');
            }
        } finally {
            setLoading(prev => ({ ...prev, cycle: false }));
        }
    };

    const fetchStats = async () => {
        try {
            setLoading(prev => ({ ...prev, stats: true }));
            const response = await periodService.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    };

    const fetchHistory = async (page = 1) => {
        try {
            setLoading(prev => ({ ...prev, history: true }));
            const response = await periodService.getHistory(page, 6);
            if (response.success) {
                setHistory(response.data.cycles);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(prev => ({ ...prev, history: false }));
        }
    };

    const fetchInsights = async () => {
        try {
            setLoading(prev => ({ ...prev, insights: true }));
            const response = await periodService.getInsights();
            if (response.success) {
                setInsights(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch insights:', err);
        } finally {
            setLoading(prev => ({ ...prev, insights: false }));
        }
    };

    // Handle log period
    const { showDialog } = useDialog();

    const handleLogPeriod = async (e) => {
        e.preventDefault();
        try {
            const response = await periodService.logPeriod(logForm);
            if (response.success) {
                setIsLogModalOpen(false);
                resetLogForm();
                fetchAllData(); // Refresh all data
                showDialog({
                    title: 'Success',
                    message: 'Period logged successfully!',
                    type: 'success'
                });
            }
        } catch (err) {
            console.error('Failed to log period:', err);
            showDialog({
                title: 'Error',
                message: err.response?.data?.message || 'Failed to log period. Please try again.',
                type: 'error'
            });
        }
    };

    // Handle delete period
    const handleDeletePeriod = async (id) => {
        showDialog({
            title: 'Delete Period?',
            message: 'Are you sure you want to delete this period entry? This action cannot be undone.',
            type: 'warning',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            showCancel: true,
            onConfirm: async () => {
                try {
                    await periodService.deletePeriod(id);
                    fetchAllData(); // Refresh all data
                    showDialog({
                        title: 'Success',
                        message: 'Period deleted successfully!',
                        type: 'success'
                    });
                } catch (err) {
                    console.error('Failed to delete period:', err);
                    showDialog({
                        title: 'Error',
                        message: 'Failed to delete period. Please try again.',
                        type: 'error'
                    });
                }
            }
        });
    };

    // Handle edit period (placeholder)
    const handleEditPeriod = (cycle) => {
        // TODO: Implement edit functionality
        console.log('Edit cycle:', cycle);
        showDialog({
            title: 'Coming Soon',
            message: 'Edit functionality is currently under development.',
            type: 'info'
        });
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Reset log form
    const resetLogForm = () => {
        setLogForm({
            startDate: new Date().toISOString().split('T')[0],
            flowIntensity: [],
            symptoms: {
                pain: { level: 0, location: [] },
                mood: [],
                physicalSymptoms: []
            },
            notes: ''
        });
    };

    // Handle form changes
    const handleFormChange = (field, value) => {
        setLogForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSymptomChange = (category, value) => {
        setLogForm(prev => ({
            ...prev,
            symptoms: {
                ...prev.symptoms,
                [category]: value
            }
        }));
    };

    // AI Chat handlers
    const handleMainChatSend = async (e) => {
        e.preventDefault();
        if (!mainChatInput.trim()) return;

        const userMsg = mainChatInput;
        setMainChatMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
        setMainChatInput('');
        setMainChatLoading(true);

        try {
            const history = mainChatMessages.map(m => ({
                text: m.text,
                sender: m.sender
            }));

            const response = await periodService.sendChatMessage(userMsg, history);

            if (response.success) {
                setMainChatMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: response.data.message,
                    sender: 'ai'
                }]);
            } else {
                setMainChatMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "Sorry, I couldn't process that. Please try again.",
                    sender: 'ai'
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMainChatMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Connection error. Please try again.",
                sender: 'ai'
            }]);
        } finally {
            setMainChatLoading(false);
        }
    };

    // Tabs configuration
    const tabs = [
        { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
        { id: 'History', label: 'History', icon: History },
        { id: 'Insights', label: 'Insights', icon: Sparkles },
        { id: 'AI Chat', label: 'AI Chat', icon: MessageSquare }
    ];

    return (
        <div className="font-sans text-gray-800">
            {/* Page Header */}
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
                        <span className="text-gray-600 font-medium text-sm">Period Tracker</span>
                    </div>
                    <h1 className="text-2xl font-bold">Period Tracker</h1>
                    <p className="text-gray-500 text-sm">Track your cycle, symptoms, and health</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${activeTab === tab.id
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
                    {/* Current Cycle Card */}
                    <CurrentCycleCard cycleData={cycleData} loading={loading.cycle} />

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
                                <PeriodCalendar
                                    history={history}
                                    currentCycle={cycleData}
                                    insights={insights}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'History' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PeriodHistory
                                    cycles={history}
                                    loading={loading.history}
                                    onDelete={handleDeletePeriod}
                                    onEdit={handleEditPeriod}
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
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
                                <PeriodInsights
                                    stats={stats}
                                    insights={insights}
                                    loading={loading.stats || loading.insights}
                                    onRefresh={() => fetchInsights(true)}
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
                                <PeriodAiChat
                                    messages={mainChatMessages}
                                    input={mainChatInput}
                                    setInput={setMainChatInput}
                                    onSend={handleMainChatSend}
                                    loading={mainChatLoading}
                                    messagesEndRef={mainChatEndRef}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar */}
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

                    {/* Log Period Button */}
                    <motion.button
                        onClick={() => setIsLogModalOpen(true)}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-pink-200 hover:shadow-xl transition flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Log Period</span>
                    </motion.button>

                    {/* Bulk Upload Button */}
                    <motion.button
                        onClick={() => setIsBulkUploadModalOpen(true)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Upload className="w-5 h-5" />
                        <span>Upload Previous Periods</span>
                    </motion.button>

                    {/* Quick Stats */}
                    {stats && (
                        <motion.div
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm border border-purple-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Quick Stats</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Avg Cycle:</span>
                                    <span className="font-semibold text-purple-600">{stats.averageCycleLength} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Avg Duration:</span>
                                    <span className="font-semibold text-pink-600">{stats.averagePeriodDuration} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Logged:</span>
                                    <span className="font-semibold text-indigo-600">{stats.totalCyclesLogged}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Log Period Modal */}
            <LogPeriodModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                formData={logForm}
                onChange={handleFormChange}
                onSymptomChange={handleSymptomChange}
                onSubmit={handleLogPeriod}
            />

            {/* Bulk Upload Modal */}
            <BulkUploadModal
                isOpen={isBulkUploadModalOpen}
                onClose={() => setIsBulkUploadModalOpen(false)}
                onSuccess={fetchAllData}
            />
        </div>
    );
};

// Calendar Placeholder Component
const CalendarPlaceholder = () => {
    return (
        <motion.div
            className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Calendar View</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
                Interactive calendar with period tracking coming soon!
            </p>
        </motion.div>
    );
};


export default PeriodTracker;
