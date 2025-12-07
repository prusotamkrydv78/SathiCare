import Appointment from '../models/appointmentModel.js';
import Doctor from '../models/doctorModel.js';
import ConsultationChat from '../models/consultationChatModel.js';
import PeriodCycle from '../models/periodCycleModel.js';
import Pregnancy from '../models/pregnancyModel.js';

// @desc    Book appointment
// @route   POST /api/appointments/book
// @access  Private
export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, scheduledDate, scheduledTime, reason, symptoms } = req.body;

        // Validate doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || !doctor.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found or not available'
            });
        }

        // Get user's medical history
        const periodData = await PeriodCycle.findOne({ userId: req.user._id })
            .sort({ startDate: -1 });
        const pregnancyData = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        const medicalHistory = {
            hasPeriodData: !!periodData,
            hasPregnancyData: !!pregnancyData,
            currentMedications: req.user.medications || [],
            allergies: req.user.allergies || [],
            previousConditions: req.user.previousConditions || []
        };

        // Create appointment
        const appointment = await Appointment.create({
            userId: req.user._id,
            doctorId,
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            reason,
            symptoms: symptoms || [],
            medicalHistory,
            consultationFee: doctor.consultationFee,
            status: 'pending'
        });

        // Populate doctor details
        await appointment.populate('doctorId', 'name specialization hospital consultationFee');

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: { appointment }
        });
    } catch (error) {
        console.error('Book Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book appointment',
            error: error.message
        });
    }
};

// @desc    Get user's appointments
// @route   GET /api/appointments
// @access  Private
export const getUserAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = { userId: req.user._id };
        if (status) {
            filter.status = status;
        }

        const appointments = await Appointment.find(filter)
            .populate('doctorId', 'name specialization hospital profileImage rating')
            .sort({ scheduledDate: -1, createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Appointment.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                appointments,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get Appointments Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get appointments',
            error: error.message
        });
    }
};

// @desc    Get appointment details
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id)
            .populate('userId', 'name email phone age')
            .populate('doctorId', 'name specialization hospital profileImage rating consultationFee');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        if (appointment.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this appointment'
            });
        }

        res.status(200).json({
            success: true,
            data: { appointment }
        });
    } catch (error) {
        console.error('Get Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get appointment',
            error: error.message
        });
    }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        if (appointment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this appointment'
            });
        }

        // Can only cancel pending or accepted appointments
        if (!['pending', 'accepted'].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel ${appointment.status} appointment`
            });
        }

        appointment.status = 'cancelled';
        appointment.cancelledAt = new Date();
        appointment.cancellationReason = reason;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: { appointment }
        });
    } catch (error) {
        console.error('Cancel Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel appointment',
            error: error.message
        });
    }
};

// @desc    Accept appointment (Doctor only)
// @route   PUT /api/appointments/:id/accept
// @access  Private (Doctor)
export const acceptAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        if (appointment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Appointment is not pending'
            });
        }

        appointment.status = 'accepted';
        appointment.acceptedAt = new Date();
        await appointment.save();

        // Create consultation chat room
        await ConsultationChat.create({
            appointmentId: appointment._id,
            userId: appointment.userId,
            doctorId: appointment.doctorId,
            messages: [],
            isActive: false // Will activate at scheduled time
        });

        res.status(200).json({
            success: true,
            message: 'Appointment accepted successfully',
            data: { appointment }
        });
    } catch (error) {
        console.error('Accept Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept appointment',
            error: error.message
        });
    }
};

// @desc    Reject appointment (Doctor only)
// @route   PUT /api/appointments/:id/reject
// @access  Private (Doctor)
export const rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        if (appointment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Appointment is not pending'
            });
        }

        appointment.status = 'rejected';
        appointment.rejectedAt = new Date();
        appointment.rejectionReason = reason;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment rejected',
            data: { appointment }
        });
    } catch (error) {
        console.error('Reject Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject appointment',
            error: error.message
        });
    }
};

// @desc    Complete appointment
// @route   PUT /api/appointments/:id/complete
// @access  Private (Doctor)
export const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { consultationNotes, prescription, followUpRequired, followUpDate } = req.body;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        if (appointment.status !== 'accepted') {
            return res.status(400).json({
                success: false,
                message: 'Appointment must be accepted first'
            });
        }

        appointment.status = 'completed';
        appointment.completedAt = new Date();
        appointment.consultationNotes = consultationNotes;
        appointment.prescription = prescription;
        appointment.followUpRequired = followUpRequired;
        appointment.followUpDate = followUpDate ? new Date(followUpDate) : null;
        await appointment.save();

        // Close consultation chat
        await ConsultationChat.findOneAndUpdate(
            { appointmentId: id },
            { isActive: false, endedAt: new Date() }
        );

        // Update doctor's total consultations
        await Doctor.findByIdAndUpdate(
            appointment.doctorId,
            { $inc: { totalConsultations: 1 } }
        );

        res.status(200).json({
            success: true,
            message: 'Appointment completed successfully',
            data: { appointment }
        });
    } catch (error) {
        console.error('Complete Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete appointment',
            error: error.message
        });
    }
};

// @desc    Rate appointment
// @route   PUT /api/appointments/:id/rate
// @access  Private
export const rateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, review } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        if (appointment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (appointment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Can only rate completed appointments'
            });
        }

        if (appointment.userRating) {
            return res.status(400).json({
                success: false,
                message: 'Appointment already rated'
            });
        }

        appointment.userRating = rating;
        appointment.userReview = review;
        await appointment.save();

        // Update doctor's rating
        const doctor = await Doctor.findById(appointment.doctorId);
        const newTotalRatings = doctor.totalRatings + 1;
        const newRating = ((doctor.rating * doctor.totalRatings) + rating) / newTotalRatings;

        await Doctor.findByIdAndUpdate(appointment.doctorId, {
            rating: newRating,
            totalRatings: newTotalRatings
        });

        res.status(200).json({
            success: true,
            message: 'Rating submitted successfully',
            data: { appointment }
        });
    } catch (error) {
        console.error('Rate Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to rate appointment',
            error: error.message
        });
    }
};
