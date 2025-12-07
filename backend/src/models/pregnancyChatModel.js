import mongoose from 'mongoose';

const pregnancyChatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        pregnancyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pregnancy',
            required: true
        },
        messages: [{
            role: {
                type: String,
                enum: ['user', 'assistant'],
                required: true
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        // Store context used for this chat session
        contextSnapshot: {
            currentWeek: Number,
            trimester: Number,
            dueDate: Date,
            commonSymptoms: [String]
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
pregnancyChatSchema.index({ userId: 1, pregnancyId: 1, isActive: 1 });

const PregnancyChat = mongoose.model('PregnancyChat', pregnancyChatSchema);

export default PregnancyChat;
