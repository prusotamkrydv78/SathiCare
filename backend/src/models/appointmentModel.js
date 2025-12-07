import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
            index: true
        },
        scheduledDate: {
            type: Date,
            required: [true, 'Scheduled date is required']
        },
        scheduledTime: {
            type: String,
            required: [true, 'Scheduled time is required']
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
            default: 'pending',
            index: true
        },
        // Booking details
        reason: {
            type: String,
            required: [true, 'Reason for consultation is required']
        },
        symptoms: [{
            type: String
        }],
        // Medical history shared with doctor
        medicalHistory: {
            hasPeriodData: Boolean,
            hasPregnancyData: Boolean,
            currentMedications: [String],
            allergies: [String],
            previousConditions: [String]
        },
        // Consultation outcome
        consultationNotes: String,
        prescription: String,
        followUpRequired: Boolean,
        followUpDate: Date,
        // Payment
        consultationFee: {
            type: Number,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'refunded'],
            default: 'pending'
        },
        paymentMethod: String,
        // Ratings
        userRating: {
            type: Number,
            min: 1,
            max: 5
        },
        userReview: String,
        // Timestamps
        acceptedAt: Date,
        rejectedAt: Date,
        completedAt: Date,
        cancelledAt: Date,
        rejectionReason: String,
        cancellationReason: String
    },
    {
        timestamps: true
    }
);

// Indexes for efficient queries
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });
appointmentSchema.index({ scheduledDate: 1 });
appointmentSchema.index({ status: 1, scheduledDate: 1 });

// Virtual for consultation chat
appointmentSchema.virtual('consultation', {
    ref: 'ConsultationChat',
    localField: '_id',
    foreignField: 'appointmentId',
    justOne: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
