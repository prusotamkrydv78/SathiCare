import mongoose from 'mongoose';

const pregnancySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        // Pregnancy dates
        lmpDate: {
            type: Date,
            required: [true, 'Last menstrual period date is required']
        },
        dueDate: {
            type: Date,
            required: true
        },
        conceptionDate: {
            type: Date
        },
        // Current status
        currentWeek: {
            type: Number,
            min: 0,
            max: 42
        },
        currentDay: {
            type: Number,
            min: 0,
            max: 294
        },
        trimester: {
            type: Number,
            enum: [1, 2, 3],
            default: 1
        },
        isActive: {
            type: Boolean,
            default: true
        },
        // Pregnancy outcome
        outcome: {
            type: String,
            enum: ['ongoing', 'delivered', 'miscarriage', 'terminated'],
            default: 'ongoing'
        },
        deliveryDate: Date,
        // Daily health logs
        dailyLogs: [{
            date: {
                type: Date,
                required: true
            },
            weight: Number, // in kg
            bloodPressure: {
                systolic: Number,
                diastolic: Number
            },
            symptoms: [{
                type: String,
                enum: ['nausea', 'vomiting', 'fatigue', 'headache', 'back_pain',
                    'swelling', 'cramps', 'bleeding', 'discharge', 'contractions',
                    'dizziness', 'heartburn', 'constipation', 'mood_swings', 'other']
            }],
            mood: {
                type: String,
                enum: ['happy', 'anxious', 'tired', 'excited', 'worried', 'normal']
            },
            babyMovements: {
                type: Number,
                min: 0
            },
            notes: String
        }],
        // Appointments
        appointments: [{
            date: {
                type: Date,
                required: true
            },
            type: {
                type: String,
                enum: ['checkup', 'ultrasound', 'blood_test', 'glucose_test', 'other'],
                required: true
            },
            doctor: String,
            hospital: String,
            notes: String,
            testResults: [{
                testName: String,
                result: String,
                normalRange: String
            }],
            completed: {
                type: Boolean,
                default: false
            },
            reminder: {
                enabled: Boolean,
                daysBefore: Number
            }
        }],

        // AI-generated tips (cached)
        weeklyTips: [{
            week: Number,
            tips: {
                nutrition: [String],
                exercise: [String],
                symptoms: [String],
                babyDevelopment: String,
                momChanges: String,
                warnings: [String]
            },
            generatedAt: Date
        }],
        // Preferences
        preferences: {
            weightUnit: {
                type: String,
                enum: ['kg', 'lbs'],
                default: 'kg'
            },
            reminderTime: String, // HH:MM format
            notifications: {
                weeklyUpdates: {
                    type: Boolean,
                    default: true
                },
                appointments: {
                    type: Boolean,
                    default: true
                },
                dailyTips: {
                    type: Boolean,
                    default: true
                }
            }
        }
    },
    {
        timestamps: true
    }
);

// Indexes
pregnancySchema.index({ userId: 1, isActive: 1 });
pregnancySchema.index({ dueDate: 1 });

// Calculate current week and trimester before saving
pregnancySchema.pre('save', function (next) {
    if (this.lmpDate && this.isActive) {
        const today = new Date();
        const daysSinceLMP = Math.floor((today - this.lmpDate) / (1000 * 60 * 60 * 24));

        // Cap at maximum pregnancy duration (42 weeks = 294 days)
        this.currentDay = Math.min(daysSinceLMP, 294);
        this.currentWeek = Math.min(Math.floor(daysSinceLMP / 7), 42);

        // If pregnancy is overdue (past 42 weeks), suggest ending it
        if (daysSinceLMP > 294) {
            // Don't auto-end, but cap the values
            this.currentDay = 294;
            this.currentWeek = 42;
        }

        // Calculate trimester
        if (this.currentWeek <= 13) {
            this.trimester = 1;
        } else if (this.currentWeek <= 27) {
            this.trimester = 2;
        } else {
            this.trimester = 3;
        }
    }
    next();
});

// Method to calculate due date from LMP
pregnancySchema.statics.calculateDueDate = function (lmpDate) {
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
    return dueDate;
};

// Method to calculate LMP from due date
pregnancySchema.statics.calculateLMPFromDueDate = function (dueDate) {
    const lmpDate = new Date(dueDate);
    lmpDate.setDate(lmpDate.getDate() - 280);
    return lmpDate;
};

const Pregnancy = mongoose.model('Pregnancy', pregnancySchema);

export default Pregnancy;
