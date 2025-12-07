import mongoose from 'mongoose';

const periodCycleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        // Period dates
        startDate: {
            type: Date,
            required: [true, 'Period start date is required']
        },
        endDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return !value || value >= this.startDate;
                },
                message: 'End date must be after start date'
            }
        },
        // Cycle length (calculated)
        cycleLength: {
            type: Number, // Days between this period and next period
            default: null
        },
        // Flow intensity tracking (daily)
        flowIntensity: [{
            date: Date,
            level: {
                type: String,
                enum: ['light', 'medium', 'heavy', 'spotting'],
                required: true
            }
        }],
        // Symptoms tracking
        symptoms: {
            pain: {
                level: {
                    type: Number,
                    min: 0,
                    max: 10,
                    default: 0
                },
                location: [{
                    type: String,
                    enum: ['abdomen', 'lower_back', 'legs', 'head', 'breasts', 'other']
                }]
            },
            mood: [{
                type: String,
                enum: ['happy', 'sad', 'irritable', 'anxious', 'energetic', 'tired', 'normal']
            }],
            physicalSymptoms: [{
                type: String,
                enum: ['bloating', 'cramps', 'headache', 'nausea', 'fatigue', 'acne', 'breast_tenderness', 'back_pain', 'food_cravings']
            }]
        },
        // Notes
        notes: {
            type: String,
            maxlength: 500
        },
        // Predictions (will be updated by AI)
        predictions: {
            nextPeriodDate: Date,
            fertileWindowStart: Date,
            fertileWindowEnd: Date,
            ovulationDate: Date
        },
        // AI insights
        aiInsights: {
            patterns: [String],
            recommendations: [String],
            irregularities: [String],
            generatedAt: Date
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
periodCycleSchema.index({ userId: 1, startDate: -1 });

// Calculate cycle length when next period is logged
periodCycleSchema.statics.updateCycleLength = async function (userId, currentStartDate) {
    const previousCycle = await this.findOne({
        userId,
        startDate: { $lt: currentStartDate }
    }).sort({ startDate: -1 });

    if (previousCycle) {
        const daysDiff = Math.floor((currentStartDate - previousCycle.startDate) / (1000 * 60 * 60 * 24));
        previousCycle.cycleLength = daysDiff;
        await previousCycle.save();
        return daysDiff;
    }
    return null;
};

const PeriodCycle = mongoose.model('PeriodCycle', periodCycleSchema);

export default PeriodCycle;
