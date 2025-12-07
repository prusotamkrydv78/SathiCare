import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Search,
    Filter,
    Star,
    Clock,
    MapPin,
    Calendar,
    Video,
    Phone,
    MessageSquare,
    CheckCircle,
    XCircle,
    Loader
} from 'lucide-react';
import doctorService from '../services/doctorService';
import DoctorCard from './consultations/DoctorCard';
import AppointmentCard from './consultations/AppointmentCard';
import BookingModal from './consultations/BookingModal';

const DoctorConsultations = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('find');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [specializations, setSpecializations] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        loadDoctors();
        loadSpecializations();
        if (activeTab === 'history') {
            loadAppointments();
        }
    }, [activeTab]);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const response = await doctorService.getAllDoctors();
            if (response.success) {
                setDoctors(response.data.doctors || []);
            }
        } catch (error) {
            console.error('Failed to load doctors:', error);
            showNotification('Failed to load doctors', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadSpecializations = async () => {
        try {
            const response = await doctorService.getSpecializations();
            if (response.success) {
                setSpecializations(response.data.specializations || []);
            }
        } catch (error) {
            console.error('Failed to load specializations:', error);
        }
    };

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const response = await doctorService.getUserAppointments();
            if (response.success) {
                setAppointments(response.data.appointments || []);
            }
        } catch (error) {
            console.error('Failed to load appointments:', error);
            showNotification('Failed to load appointments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = (doctor) => {
        setSelectedDoctor(doctor);
        setShowBookingModal(true);
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    const handleCancelAppointment = async (appointmentId) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            await doctorService.cancelAppointment(appointmentId);
            showNotification('Appointment cancelled successfully');
            loadAppointments();
        } catch (error) {
            showNotification('Failed to cancel appointment', 'error');
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 ${notification.type === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}
                    >
                        {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <XCircle className="w-5 h-5" />
                        )}
                        <span className="font-semibold">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 rounded-3xl p-6 mb-4 shadow-xl"
            >
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate('/health-assistant')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold transition backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">{doctors.length} Doctors Available</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                        👨‍⚕️
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-1">Doctor Consultations</h1>
                        <p className="text-white/90 text-sm">Connect with certified specialists for expert care</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-6">
                    <button
                        onClick={() => setActiveTab('find')}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'find'
                                ? 'bg-white text-blue-600 shadow-lg'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                    >
                        Find Doctors
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'history'
                                ? 'bg-white text-blue-600 shadow-lg'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                    >
                        My Appointments
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                {activeTab === 'find' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
                        {/* Filters Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit"
                        >
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-blue-600" />
                                Filters
                            </h3>

                            {/* Search */}
                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Doctor name..."
                                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>

                            {/* Specialty Filter */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Specialty
                                </label>
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                >
                                    <option value="all">All Specialties</option>
                                    {specializations.map((spec) => (
                                        <option key={spec} value={spec}>
                                            {spec}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>

                        {/* Doctors List */}
                        <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                                </div>
                            ) : filteredDoctors.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                                        👨‍⚕️
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Doctors Found</h3>
                                    <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredDoctors.map((doctor) => (
                                        <DoctorCard
                                            key={doctor._id || doctor.id}
                                            doctor={doctor}
                                            onBook={handleBookAppointment}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full overflow-y-auto"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                                    📅
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Yet</h3>
                                <p className="text-gray-500 text-sm">Book your first consultation with a doctor</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment._id}
                                        appointment={appointment}
                                        onCancel={handleCancelAppointment}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingModal
                    doctor={selectedDoctor}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedDoctor(null);
                    }}
                    onSuccess={(message) => {
                        setShowBookingModal(false);
                        setSelectedDoctor(null);
                        showNotification(message || 'Appointment booked successfully!');
                        loadAppointments();
                    }}
                />
            )}
        </div>
    );
};

export default DoctorConsultations;
