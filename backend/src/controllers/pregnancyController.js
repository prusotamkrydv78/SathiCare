import Pregnancy from '../models/pregnancyModel.js';
import {
    getWeeklyPregnancyTips,
    analyzePregnancySymptoms,
    answerPregnancyQuestion,
    getNutritionRecommendations,
    analyzeContractions
} from '../services/pregnancyAIService.js';

// @desc    Start pregnancy tracking
// @route   POST /api/pregnancy/start
// @access  Private
export const startPregnancy = async (req, res) => {
    try {
        const { lmpDate, dueDate, conceptionDate } = req.body;

        // Check if user already has an active pregnancy
        const existingPregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (existingPregnancy) {
            return res.status(400).json({
                success: false,
                message: 'You already have an active pregnancy tracker'
            });
        }

        let calculatedDueDate;
        let calculatedLMP;

        if (lmpDate) {
            calculatedLMP = new Date(lmpDate);
            calculatedDueDate = Pregnancy.calculateDueDate(calculatedLMP);
        } else if (dueDate) {
            calculatedDueDate = new Date(dueDate);
            calculatedLMP = Pregnancy.calculateLMPFromDueDate(calculatedDueDate);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Either LMP date or due date is required'
            });
        }

        // Create pregnancy tracker
        const pregnancy = await Pregnancy.create({
            userId: req.user._id,
            lmpDate: calculatedLMP,
            dueDate: calculatedDueDate,
            conceptionDate: conceptionDate ? new Date(conceptionDate) : null
        });

        // Generate first week tips
        const tips = await getWeeklyPregnancyTips(
            pregnancy.currentWeek,
            pregnancy.trimester,
            req.user
        );

        if (tips.success) {
            pregnancy.weeklyTips.push({
                week: pregnancy.currentWeek,
                tips: tips.data,
                generatedAt: new Date()
            });
            await pregnancy.save();
        }

        res.status(201).json({
            success: true,
            message: 'Pregnancy tracking started successfully',
            data: {
                pregnancy,
                weeklyTips: tips.success ? tips.data : null
            }
        });
    } catch (error) {
        console.error('Start Pregnancy Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start pregnancy tracking',
            error: error.message
        });
    }
};

// @desc    Get current pregnancy
// @route   GET /api/pregnancy/current
// @access  Private
export const getCurrentPregnancy = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        // Calculate days remaining
        const today = new Date();
        const daysRemaining = Math.ceil((pregnancy.dueDate - today) / (1000 * 60 * 60 * 24));

        res.status(200).json({
            success: true,
            data: {
                pregnancy,
                daysRemaining,
                percentComplete: Math.round((pregnancy.currentDay / 280) * 100)
            }
        });
    } catch (error) {
        console.error('Get Current Pregnancy Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get pregnancy data',
            error: error.message
        });
    }
};

// @desc    Update pregnancy
// @route   PUT /api/pregnancy/update
// @access  Private
export const updatePregnancy = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const { lmpDate, dueDate, preferences } = req.body;

        if (lmpDate) {
            pregnancy.lmpDate = new Date(lmpDate);
            pregnancy.dueDate = Pregnancy.calculateDueDate(pregnancy.lmpDate);
        } else if (dueDate) {
            pregnancy.dueDate = new Date(dueDate);
            pregnancy.lmpDate = Pregnancy.calculateLMPFromDueDate(pregnancy.dueDate);
        }

        if (preferences) {
            pregnancy.preferences = { ...pregnancy.preferences, ...preferences };
        }

        await pregnancy.save();

        res.status(200).json({
            success: true,
            message: 'Pregnancy updated successfully',
            data: { pregnancy }
        });
    } catch (error) {
        console.error('Update Pregnancy Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update pregnancy',
            error: error.message
        });
    }
};

// @desc    End pregnancy tracking
// @route   POST /api/pregnancy/end
// @access  Private
export const endPregnancy = async (req, res) => {
    try {
        const { outcome, deliveryDate } = req.body;

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        pregnancy.isActive = false;
        pregnancy.outcome = outcome || 'delivered';
        pregnancy.deliveryDate = deliveryDate ? new Date(deliveryDate) : new Date();

        await pregnancy.save();

        res.status(200).json({
            success: true,
            message: 'Pregnancy tracking ended',
            data: { pregnancy }
        });
    } catch (error) {
        console.error('End Pregnancy Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to end pregnancy tracking',
            error: error.message
        });
    }
};

// @desc    Add daily health log
// @route   POST /api/pregnancy/log
// @access  Private
export const addHealthLog = async (req, res) => {
    try {
        const { date, weight, bloodPressure, symptoms, mood, babyMovements, notes } = req.body;

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        pregnancy.dailyLogs.push({
            date: date ? new Date(date) : new Date(),
            weight,
            bloodPressure,
            symptoms: symptoms || [],
            mood,
            babyMovements,
            notes
        });

        await pregnancy.save();

        res.status(201).json({
            success: true,
            message: 'Health log added successfully',
            data: {
                log: pregnancy.dailyLogs[pregnancy.dailyLogs.length - 1]
            }
        });
    } catch (error) {
        console.error('Add Health Log Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add health log',
            error: error.message
        });
    }
};

// @desc    Get health logs
// @route   GET /api/pregnancy/logs
// @access  Private
export const getHealthLogs = async (req, res) => {
    try {
        const { limit = 30 } = req.query;

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const logs = pregnancy.dailyLogs
            .sort((a, b) => b.date - a.date)
            .slice(0, parseInt(limit));

        res.status(200).json({
            success: true,
            data: { logs }
        });
    } catch (error) {
        console.error('Get Health Logs Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get health logs',
            error: error.message
        });
    }
};

// @desc    Add appointment
// @route   POST /api/pregnancy/appointment
// @access  Private
export const addAppointment = async (req, res) => {
    try {
        const { date, type, doctor, hospital, notes, reminder } = req.body;

        if (!date || !type) {
            return res.status(400).json({
                success: false,
                message: 'Date and type are required'
            });
        }

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        pregnancy.appointments.push({
            date: new Date(date),
            type,
            doctor,
            hospital,
            notes,
            reminder
        });

        await pregnancy.save();

        res.status(201).json({
            success: true,
            message: 'Appointment added successfully',
            data: {
                appointment: pregnancy.appointments[pregnancy.appointments.length - 1]
            }
        });
    } catch (error) {
        console.error('Add Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add appointment',
            error: error.message
        });
    }
};

// @desc    Get appointments
// @route   GET /api/pregnancy/appointments
// @access  Private
export const getAppointments = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const appointments = pregnancy.appointments.sort((a, b) => a.date - b.date);

        res.status(200).json({
            success: true,
            data: { appointments }
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

// @desc    Update appointment
// @route   PUT /api/pregnancy/appointment/:id
// @access  Private
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const appointment = pregnancy.appointments.id(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        Object.assign(appointment, updates);
        await pregnancy.save();

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: { appointment }
        });
    } catch (error) {
        console.error('Update Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment',
            error: error.message
        });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/pregnancy/appointment/:id
// @access  Private
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        pregnancy.appointments.pull(id);
        await pregnancy.save();

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Delete Appointment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete appointment',
            error: error.message
        });
    }
};

// ============ AI-POWERED ENDPOINTS ============

// @desc    Get weekly tips
// @route   GET /api/pregnancy/ai/tips
// @access  Private
export const getWeeklyTips = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        // Check if we have cached tips for current week
        const cachedTips = pregnancy.weeklyTips.find(t => t.week === pregnancy.currentWeek);

        if (cachedTips && req.query.force !== 'true') {
            return res.status(200).json({
                success: true,
                data: {
                    tips: cachedTips.tips,
                    week: pregnancy.currentWeek,
                    cached: true
                }
            });
        }

        // Generate new tips
        const tips = await getWeeklyPregnancyTips(
            pregnancy.currentWeek,
            pregnancy.trimester,
            req.user
        );

        if (!tips.success) {
            return res.status(500).json(tips);
        }

        // Save to cache
        const existingIndex = pregnancy.weeklyTips.findIndex(t => t.week === pregnancy.currentWeek);
        if (existingIndex >= 0) {
            pregnancy.weeklyTips[existingIndex] = {
                week: pregnancy.currentWeek,
                tips: tips.data,
                generatedAt: new Date()
            };
        } else {
            pregnancy.weeklyTips.push({
                week: pregnancy.currentWeek,
                tips: tips.data,
                generatedAt: new Date()
            });
        }

        await pregnancy.save();

        res.status(200).json({
            success: true,
            data: {
                tips: tips.data,
                week: pregnancy.currentWeek,
                cached: false
            }
        });
    } catch (error) {
        console.error('Get Weekly Tips Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get weekly tips',
            error: error.message
        });
    }
};

// @desc    Analyze symptoms
// @route   POST /api/pregnancy/ai/analyze-symptoms
// @access  Private
export const analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Symptoms are required'
            });
        }

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const analysis = await analyzePregnancySymptoms(
            symptoms,
            pregnancy.currentWeek,
            req.user
        );

        res.status(200).json(analysis);
    } catch (error) {
        console.error('Analyze Symptoms Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze symptoms',
            error: error.message
        });
    }
};

// @desc    Ask pregnancy question
// @route   POST /api/pregnancy/ai/ask
// @access  Private
export const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'Question is required'
            });
        }

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const answer = await answerPregnancyQuestion(
            question,
            pregnancy,
            req.user
        );

        res.status(200).json(answer);
    } catch (error) {
        console.error('Ask Question Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to answer question',
            error: error.message
        });
    }
};

// @desc    Get nutrition recommendations
// @route   GET /api/pregnancy/ai/nutrition
// @access  Private
export const getNutrition = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const nutrition = await getNutritionRecommendations(
            pregnancy.currentWeek,
            pregnancy.trimester,
            req.user
        );

        res.status(200).json(nutrition);
    } catch (error) {
        console.error('Get Nutrition Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get nutrition recommendations',
            error: error.message
        });
    }
};

// @desc    Start contraction timer
// @route   POST /api/pregnancy/contraction/start
// @access  Private
export const startContraction = async (req, res) => {
    try {
        const { intensity } = req.body;

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        pregnancy.contractions.push({
            startTime: new Date(),
            intensity: intensity || 'moderate'
        });

        await pregnancy.save();

        res.status(201).json({
            success: true,
            message: 'Contraction started',
            data: {
                contractionId: pregnancy.contractions[pregnancy.contractions.length - 1]._id
            }
        });
    } catch (error) {
        console.error('Start Contraction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start contraction',
            error: error.message
        });
    }
};

// @desc    Stop contraction timer
// @route   POST /api/pregnancy/contraction/stop
// @access  Private
export const stopContraction = async (req, res) => {
    try {
        const { contractionId } = req.body;

        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const contraction = pregnancy.contractions.id(contractionId);
        if (!contraction) {
            return res.status(404).json({
                success: false,
                message: 'Contraction not found'
            });
        }

        contraction.endTime = new Date();
        contraction.duration = Math.floor((contraction.endTime - contraction.startTime) / 1000);

        await pregnancy.save();

        // Analyze contractions if we have enough data
        const recentContractions = pregnancy.contractions
            .filter(c => c.endTime)
            .slice(-10);

        let analysis = null;
        if (recentContractions.length >= 3) {
            const analysisResult = await analyzeContractions(recentContractions);
            if (analysisResult.success) {
                analysis = analysisResult.data;
            }
        }

        res.status(200).json({
            success: true,
            message: 'Contraction stopped',
            data: {
                contraction,
                analysis
            }
        });
    } catch (error) {
        console.error('Stop Contraction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to stop contraction',
            error: error.message
        });
    }
};

// @desc    Get contraction stats
// @route   GET /api/pregnancy/contraction/stats
// @access  Private
export const getContractionStats = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found'
            });
        }

        const recentContractions = pregnancy.contractions
            .filter(c => c.endTime)
            .slice(-20);

        const analysis = await analyzeContractions(recentContractions);

        res.status(200).json({
            success: true,
            data: {
                contractions: recentContractions,
                analysis: analysis.success ? analysis.data : null
            }
        });
    } catch (error) {
        console.error('Get Contraction Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contraction stats',
            error: error.message
        });
    }
};
