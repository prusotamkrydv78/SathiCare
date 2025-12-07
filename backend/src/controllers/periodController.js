import PeriodCycle from '../models/periodCycleModel.js';
import {
    predictNextPeriod,
    analyzeCyclePatterns,
    getSymptomReliefTips,
    generatePeriodInsights
} from '../services/periodAIService.js';

// @desc    Log a new period cycle
// @route   POST /api/period/log
// @access  Private
export const logPeriod = async (req, res) => {
    try {
        const { startDate, endDate, flowIntensity, symptoms, notes } = req.body;

        if (!startDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date is required'
            });
        }

        // Create new period cycle
        const periodCycle = await PeriodCycle.create({
            userId: req.user._id,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            flowIntensity: flowIntensity || [],
            symptoms: symptoms || {},
            notes
        });

        // Update previous cycle's length
        await PeriodCycle.updateCycleLength(req.user._id, new Date(startDate));

        // Generate AI insights after logging
        const cycles = await PeriodCycle.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .limit(12);

        const insights = await generatePeriodInsights(cycles, req.user);

        // Update cycle with AI insights
        if (insights.success) {
            periodCycle.aiInsights = {
                patterns: insights.data.patterns?.patterns || [],
                recommendations: insights.data.patterns?.recommendations || [],
                irregularities: insights.data.patterns?.irregularities || [],
                generatedAt: new Date()
            };
            periodCycle.predictions = {
                nextPeriodDate: insights.data.prediction?.nextPeriodDate,
                fertileWindowStart: insights.data.prediction?.fertileWindow?.start,
                fertileWindowEnd: insights.data.prediction?.fertileWindow?.end,
                ovulationDate: insights.data.prediction?.ovulationDate
            };
            await periodCycle.save();
        }

        res.status(201).json({
            success: true,
            message: 'Period logged successfully',
            data: {
                cycle: periodCycle,
                aiInsights: insights.success ? insights.data : null
            }
        });
    } catch (error) {
        console.error('Log Period Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to log period',
            error: error.message
        });
    }
};

// @desc    Get period history
// @route   GET /api/period/history
// @access  Private
export const getPeriodHistory = async (req, res) => {
    try {
        const { limit = 6, page = 1 } = req.query;

        const cycles = await PeriodCycle.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await PeriodCycle.countDocuments({ userId: req.user._id });

        res.status(200).json({
            success: true,
            data: {
                cycles,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get Period History Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get period history',
            error: error.message
        });
    }
};

// @desc    Get current cycle info
// @route   GET /api/period/current
// @access  Private
export const getCurrentCycle = async (req, res) => {
    try {
        // Get the most recent cycle
        const currentCycle = await PeriodCycle.findOne({ userId: req.user._id })
            .sort({ startDate: -1 });

        if (!currentCycle) {
            return res.status(404).json({
                success: false,
                message: 'No period data found. Please log your first period.'
            });
        }

        // Calculate current cycle day
        const today = new Date();
        const daysSinceStart = Math.floor((today - currentCycle.startDate) / (1000 * 60 * 60 * 24));

        res.status(200).json({
            success: true,
            data: {
                cycle: currentCycle,
                currentDay: daysSinceStart + 1,
                isOnPeriod: currentCycle.endDate ? today <= currentCycle.endDate : daysSinceStart < 7
            }
        });
    } catch (error) {
        console.error('Get Current Cycle Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get current cycle',
            error: error.message
        });
    }
};

// @desc    Get cycle statistics
// @route   GET /api/period/stats
// @access  Private
export const getCycleStats = async (req, res) => {
    try {
        const cycles = await PeriodCycle.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .limit(12); // Last 12 cycles for stats

        if (cycles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No period data found'
            });
        }

        // Calculate statistics
        const cycleLengths = cycles.filter(c => c.cycleLength).map(c => c.cycleLength);
        const averageCycleLength = cycleLengths.length > 0
            ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
            : 28;

        const periodDurations = cycles
            .filter(c => c.endDate)
            .map(c => Math.floor((c.endDate - c.startDate) / (1000 * 60 * 60 * 24)) + 1);

        const averagePeriodDuration = periodDurations.length > 0
            ? Math.round(periodDurations.reduce((a, b) => a + b, 0) / periodDurations.length)
            : 5;

        // Check for irregularities
        const isIrregular = cycleLengths.length > 3 &&
            (Math.max(...cycleLengths) - Math.min(...cycleLengths)) > 7;

        res.status(200).json({
            success: true,
            data: {
                totalCyclesLogged: cycles.length,
                averageCycleLength,
                averagePeriodDuration,
                lastPeriodDate: cycles[0].startDate,
                isIrregular,
                cycleLengthRange: cycleLengths.length > 0 ? {
                    min: Math.min(...cycleLengths),
                    max: Math.max(...cycleLengths)
                } : null
            }
        });
    } catch (error) {
        console.error('Get Cycle Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cycle statistics',
            error: error.message
        });
    }
};

// @desc    Update a period cycle
// @route   PUT /api/period/:id
// @access  Private
export const updatePeriod = async (req, res) => {
    try {
        const { id } = req.params;
        const { endDate, flowIntensity, symptoms, notes } = req.body;

        const cycle = await PeriodCycle.findOne({ _id: id, userId: req.user._id });

        if (!cycle) {
            return res.status(404).json({
                success: false,
                message: 'Period cycle not found'
            });
        }

        // Update fields
        if (endDate) cycle.endDate = new Date(endDate);
        if (flowIntensity) cycle.flowIntensity = flowIntensity;
        if (symptoms) cycle.symptoms = { ...cycle.symptoms, ...symptoms };
        if (notes !== undefined) cycle.notes = notes;

        await cycle.save();

        res.status(200).json({
            success: true,
            message: 'Period updated successfully',
            data: {
                cycle
            }
        });
    } catch (error) {
        console.error('Update Period Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update period',
            error: error.message
        });
    }
};

// @desc    Delete a period cycle
// @route   DELETE /api/period/:id
// @access  Private
export const deletePeriod = async (req, res) => {
    try {
        const { id } = req.params;

        const cycle = await PeriodCycle.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!cycle) {
            return res.status(404).json({
                success: false,
                message: 'Period cycle not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Period deleted successfully'
        });
    } catch (error) {
        console.error('Delete Period Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete period',
            error: error.message
        });
    }
};

// ============ AI-POWERED ENDPOINTS ============

// @desc    Get AI prediction for next period
// @route   GET /api/period/ai/predict
// @access  Private
export const getAIPrediction = async (req, res) => {
    try {
        const cycles = await PeriodCycle.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .limit(12);

        const prediction = await predictNextPeriod(cycles, req.user);

        if (!prediction.success) {
            return res.status(400).json(prediction);
        }

        res.status(200).json({
            success: true,
            data: prediction.data
        });
    } catch (error) {
        console.error('AI Prediction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate prediction',
            error: error.message
        });
    }
};

// @desc    Get AI cycle pattern analysis
// @route   GET /api/period/ai/analyze
// @access  Private
export const getAIAnalysis = async (req, res) => {
    try {
        const cycles = await PeriodCycle.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .limit(12);

        const analysis = await analyzeCyclePatterns(cycles, req.user);

        if (!analysis.success) {
            return res.status(400).json(analysis);
        }

        res.status(200).json({
            success: true,
            data: analysis.data
        });
    } catch (error) {
        console.error('AI Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze patterns',
            error: error.message
        });
    }
};

// @desc    Get AI symptom relief tips
// @route   POST /api/period/ai/symptom-tips
// @access  Private
export const getAISymptomTips = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({
                success: false,
                message: 'Symptoms data is required'
            });
        }

        const tips = await getSymptomReliefTips(symptoms, req.user);

        if (!tips.success) {
            return res.status(400).json(tips);
        }

        res.status(200).json({
            success: true,
            data: tips.data
        });
    } catch (error) {
        console.error('AI Tips Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate tips',
            error: error.message
        });
    }
};

// @desc    Get comprehensive AI insights
// @route   GET /api/period/ai/insights?force=true (optional)
// @access  Private
export const getAIInsights = async (req, res) => {
    try {
        const { force } = req.query; // force=true to regenerate

        const cycles = await PeriodCycle.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .limit(12);

        if (cycles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No period data found. Please log your first period.'
            });
        }

        // Check if we have recent cached insights (from last cycle)
        const latestCycle = cycles[0];
        const hasCachedInsights = latestCycle.aiInsights?.generatedAt && latestCycle.predictions?.nextPeriodDate;

        // If cached insights exist and force regeneration is not requested, return cached data
        if (hasCachedInsights && force !== 'true') {
            return res.status(200).json({
                success: true,
                data: {
                    prediction: {
                        nextPeriodDate: latestCycle.predictions.nextPeriodDate,
                        fertileWindowStart: latestCycle.predictions.fertileWindowStart,
                        fertileWindowEnd: latestCycle.predictions.fertileWindowEnd,
                        ovulationDate: latestCycle.predictions.ovulationDate
                    },
                    patterns: {
                        patterns: latestCycle.aiInsights.patterns,
                        recommendations: latestCycle.aiInsights.recommendations,
                        irregularities: latestCycle.aiInsights.irregularities
                    },
                    generatedAt: latestCycle.aiInsights.generatedAt,
                    cached: true
                }
            });
        }

        // Generate new insights (either no cache or force regeneration)
        const insights = await generatePeriodInsights(cycles, req.user);

        if (!insights.success) {
            return res.status(400).json(insights);
        }

        // Save insights to the latest cycle
        if (insights.data.prediction) {
            latestCycle.predictions = {
                nextPeriodDate: insights.data.prediction.nextPeriodDate,
                fertileWindowStart: insights.data.prediction.fertileWindow?.start,
                fertileWindowEnd: insights.data.prediction.fertileWindow?.end,
                ovulationDate: insights.data.prediction.ovulationDate
            };
        }

        if (insights.data.patterns) {
            latestCycle.aiInsights = {
                patterns: insights.data.patterns.patterns || [],
                recommendations: insights.data.patterns.recommendations || [],
                irregularities: insights.data.patterns.irregularities || [],
                generatedAt: new Date()
            };
        }

        await latestCycle.save();

        res.status(200).json({
            success: true,
            data: {
                ...insights.data,
                cached: false
            }
        });
    } catch (error) {
        console.error('AI Insights Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate insights',
            error: error.message
        });
    }
};
