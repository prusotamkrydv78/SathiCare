import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, CheckCircle } from 'lucide-react';
import doctorService from '../../services/doctorService';

const BookingModal = ({ doctor, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        scheduledDate: '',
        scheduledTime: '',
        reason: '',
        consultationType: 'video'
    });
    const [loading, setLoading] = useState(false);
    const [waitingApproval, setWaitingApproval] = useState(false);
    const [appointmentId, setAppointmentId] = useState(null);
    const [countdown, setCountdown] = useState(10);

    // Poll for appointment status
    useEffect(() => {
        if (!waitingApproval || !appointmentId) return;

        let countdownTimer;
        let pollInterval;

        // Countdown timer
        countdownTimer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownTimer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Poll for status every 2 seconds
        pollInterval = setInterval(async () => {
            try {
                const response = await doctorService.getAppointmentById(appointmentId);
                if (response.success && response.data.appointment.status === 'accepted') {
                    clearInterval(pollInterval);
                    clearInterval(countdownTimer);
                    setWaitingApproval(false);
                    onSuccess('Appointment approved! You can now chat with the doctor.');
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 2000);

        // Stop polling after 15 seconds
        const timeout = setTimeout(() => {
            clearInterval(pollInterval);
            clearInterval(countdownTimer);
            if (waitingApproval) {
                setWaitingApproval(false);
                onSuccess('Appointment booked! Waiting for doctor approval.');
            }
        }, 15000);

        return () => {
            clearInterval(pollInterval);
            clearInterval(countdownTimer);
            clearTimeout(timeout);
        };
    }, [waitingApproval, appointmentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await doctorService.bookAppointment({
                doctorId: doctor._id || doctor.id,
                ...formData
            });

            if (response.success) {
                setAppointmentId(response.data.appointment._id);
                setLoading(false);
                setWaitingApproval(true);
                setCountdown(10);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Failed to book appointment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
                {waitingApproval ? (
                    // Waiting for Approval Screen
                    <div className="text-center py-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 mx-auto mb-6"
                        >
                            <Loader className="w-20 h-20 text-blue-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Waiting for Approval</h2>
                        <p className="text-gray-600 mb-4">
                            Your appointment request has been sent to the doctor
                        </p>
                        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-2">Auto-approval in</p>
                            <div className="text-4xl font-bold text-blue-600">{countdown}s</div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span>Processing your request...</span>
                        </div>
                    </div>
                ) : (
                    // Booking Form
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h2>

                        <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-2xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                                {doctor.profileImage || doctor.image || '👨‍⚕️'}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                                <p className="text-sm text-gray-600">{doctor.specialization || doctor.specialty}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                                <input
                                    type="time"
                                    required
                                    value={formData.scheduledTime}
                                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
                                <textarea
                                    required
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="Describe your symptoms or reason for consultation..."
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Booking...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default BookingModal;
