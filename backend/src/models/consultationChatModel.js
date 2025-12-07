import mongoose from 'mongoose';

const consultationChatSchema = new mongoose.Schema(
    {
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
            unique: true,
            index: true
        },
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
        messages: [{
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            senderType: {
                type: String,
                enum: ['user', 'doctor'],
                required: true
            },
            messageType: {
                type: String,
                enum: ['text', 'image', 'document'],
                default: 'text'
            },
            content: {
                type: String,
                required: function () {
                    return this.messageType === 'text';
                }
            },
            fileUrl: {
                type: String,
                required: function () {
                    return this.messageType !== 'text';
                }
            },
            fileName: String,
            fileSize: Number,
            timestamp: {
                type: Date,
                default: Date.now
            },
            read: {
                type: Boolean,
                default: false
            },
            readAt: Date
        }],
        // Chat status
        isActive: {
            type: Boolean,
            default: true
        },
        startedAt: Date,
        endedAt: Date,
        // Typing indicators (not stored, just for real-time)
        lastActivity: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Indexes
consultationChatSchema.index({ appointmentId: 1 });
consultationChatSchema.index({ userId: 1, isActive: 1 });
consultationChatSchema.index({ doctorId: 1, isActive: 1 });
consultationChatSchema.index({ 'messages.timestamp': -1 });

// Method to add message
consultationChatSchema.methods.addMessage = function (senderId, senderType, messageData) {
    this.messages.push({
        senderId,
        senderType,
        ...messageData,
        timestamp: new Date()
    });
    this.lastActivity = new Date();
    return this.save();
};

// Method to mark messages as read
consultationChatSchema.methods.markAsRead = function (readerId) {
    this.messages.forEach(msg => {
        if (msg.senderId.toString() !== readerId.toString() && !msg.read) {
            msg.read = true;
            msg.readAt = new Date();
        }
    });
    return this.save();
};

const ConsultationChat = mongoose.model('ConsultationChat', consultationChatSchema);

export default ConsultationChat;
