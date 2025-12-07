import mongoose from 'mongoose';

const sosAlertSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        location: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            },
            address: String,
            accuracy: Number
        },
        alertType: {
            type: String,
            enum: ['manual', 'automatic'],
            default: 'manual'
        },
        status: {
            type: String,
            enum: ['active', 'resolved', 'cancelled'],
            default: 'active'
        },
        contactsNotified: [{
            contactId: mongoose.Schema.Types.ObjectId,
            name: String,
            phoneNumber: String,
            smsSent: Boolean,
            smsStatus: String,
            messageSid: String,
            sentAt: Date
        }],
        message: String,
        resolvedAt: Date,
        resolvedBy: String,
        notes: String
    },
    {
        timestamps: true
    }
);

// Indexes
sosAlertSchema.index({ userId: 1, status: 1 });
sosAlertSchema.index({ createdAt: -1 });

const SOSAlert = mongoose.model('SOSAlert', sosAlertSchema);

export default SOSAlert;
