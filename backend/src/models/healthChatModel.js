import mongoose from 'mongoose';

const healthChatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
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
        // Health context snapshot at time of chat
        contextSnapshot: {
            age: Number,
            hasPeriodData: Boolean,
            hasPregnancyData: Boolean,
            lastPeriodDate: Date,
            pregnancyWeek: Number,
            commonSymptoms: [String],
            medications: [String]
        },
        // AI detected urgency level
        urgencyLevel: {
            type: String,
            enum: ['normal', 'moderate', 'urgent', 'emergency'],
            default: 'normal'
        },
        // Topics discussed
        topics: [{
            type: String,
            enum: ['general', 'period', 'pregnancy', 'nutrition', 'exercise',
                'mental_health', 'symptoms', 'medication', 'emergency']
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes
healthChatSchema.index({ userId: 1, isActive: 1 });
healthChatSchema.index({ urgencyLevel: 1 });

const HealthChat = mongoose.model('HealthChat', healthChatSchema);

export default HealthChat;
