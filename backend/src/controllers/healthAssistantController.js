import HealthChat from '../models/healthChatModel.js';
import PeriodCycle from '../models/periodCycleModel.js';
import Pregnancy from '../models/pregnancyModel.js';
import {
    chatWithHealthAssistant,
    getDailyHealthTip,
    analyzeSymptoms
} from '../services/healthAssistantService.js';

/**
 * Helper: Get user's health data
 */
async function getUserHealthData(userId) {
    // Get period data
    const periodCycles = await PeriodCycle.find({ userId })
        .sort({ startDate: -1 })
        .limit(3);

    const periodData = periodCycles.length > 0 ? {
        lastPeriodDate: periodCycles[0].startDate,
        averageCycleLength: periodCycles[0].averageCycleLength,
        commonSymptoms: [...new Set(periodCycles.flatMap(c => c.symptoms || []))].slice(0, 5)
    } : null;

    // Get pregnancy data
    const pregnancy = await Pregnancy.findOne({ userId, isActive: true });

    const pregnancyData = pregnancy ? {
        currentWeek: pregnancy.currentWeek,
        trimester: pregnancy.trimester,
        dueDate: pregnancy.dueDate,
        recentSymptoms: pregnancy.dailyLogs
            .slice(-3)
            .flatMap(log => log.symptoms || [])
            .filter((v, i, a) => a.indexOf(v) === i)
            .slice(0, 5)
    } : null;

    return {
        hasPeriodData: !!periodData,
        hasPregnancyData: !!pregnancyData,
        periodData,
        pregnancyData
    };
}

// @desc    Send message to AI Health Assistant
// @route   POST /api/health/chat
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { message, chatId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Get user's health data
        const healthData = await getUserHealthData(req.user._id);

        // Get or create chat session
        let chat;
        if (chatId) {
            chat = await HealthChat.findOne({
                _id: chatId,
                userId: req.user._id,
                isActive: true
            });
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat session not found'
                });
            }
        } else {
            // Create new chat
            chat = await HealthChat.create({
                userId: req.user._id,
                messages: [],
                contextSnapshot: {
                    age: req.user.age,
                    hasPeriodData: healthData.hasPeriodData,
                    hasPregnancyData: healthData.hasPregnancyData,
                    lastPeriodDate: healthData.periodData?.lastPeriodDate,
                    pregnancyWeek: healthData.pregnancyData?.currentWeek
                }
            });
        }

        // Add user message
        chat.messages.push({
            role: 'user',
            content: message.trim(),
            timestamp: new Date()
        });

        // Get AI response
        const aiResponse = await chatWithHealthAssistant(
            message.trim(),
            req.user,
            healthData,
            chat.messages
        );

        if (!aiResponse.success) {
            return res.status(500).json(aiResponse);
        }

        // Add AI response
        chat.messages.push({
            role: 'assistant',
            content: aiResponse.data.message,
            timestamp: new Date()
        });

        // Update urgency level
        chat.urgencyLevel = aiResponse.data.urgency;

        await chat.save();

        res.status(200).json({
            success: true,
            data: {
                chatId: chat._id,
                message: aiResponse.data.message,
                urgency: aiResponse.data.urgency,
                messageCount: chat.messages.length
            }
        });
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// @desc    Get chat history
// @route   GET /api/health/chat/:chatId
// @access  Private
export const getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await HealthChat.findOne({
            _id: chatId,
            userId: req.user._id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { chat }
        });
    } catch (error) {
        console.error('Get Chat History Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get chat history',
            error: error.message
        });
    }
};

// @desc    Get all chat sessions
// @route   GET /api/health/chats
// @access  Private
export const getAllChats = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const chats = await HealthChat.find({
            userId: req.user._id,
            isActive: true
        })
            .sort({ updatedAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('messages urgencyLevel contextSnapshot createdAt updatedAt');

        const total = await HealthChat.countDocuments({
            userId: req.user._id,
            isActive: true
        });

        // Add preview
        const chatsWithPreview = chats.map(chat => ({
            _id: chat._id,
            lastMessage: chat.messages[chat.messages.length - 1],
            messageCount: chat.messages.length,
            urgencyLevel: chat.urgencyLevel,
            contextSnapshot: chat.contextSnapshot,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        }));

        res.status(200).json({
            success: true,
            data: {
                chats: chatsWithPreview,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get All Chats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get chats',
            error: error.message
        });
    }
};

// @desc    Delete chat session
// @route   DELETE /api/health/chat/:chatId
// @access  Private
export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await HealthChat.findOne({
            _id: chatId,
            userId: req.user._id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        chat.isActive = false;
        await chat.save();

        res.status(200).json({
            success: true,
            message: 'Chat deleted successfully'
        });
    } catch (error) {
        console.error('Delete Chat Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete chat',
            error: error.message
        });
    }
};

// @desc    Get daily health tip
// @route   GET /api/health/tip
// @access  Private
export const getDailyTip = async (req, res) => {
    try {
        const healthData = await getUserHealthData(req.user._id);

        const tipResponse = await getDailyHealthTip(req.user, healthData);

        if (!tipResponse.success) {
            return res.status(500).json(tipResponse);
        }

        res.status(200).json({
            success: true,
            data: {
                tip: tipResponse.data.tip,
                date: new Date().toISOString().split('T')[0]
            }
        });
    } catch (error) {
        console.error('Get Daily Tip Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get daily tip',
            error: error.message
        });
    }
};

// @desc    Analyze symptoms
// @route   POST /api/health/symptoms
// @access  Private
export const checkSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Symptoms array is required'
            });
        }

        const healthData = await getUserHealthData(req.user._id);

        const analysisResponse = await analyzeSymptoms(
            symptoms,
            req.user,
            healthData
        );

        if (!analysisResponse.success) {
            return res.status(500).json(analysisResponse);
        }

        res.status(200).json({
            success: true,
            data: analysisResponse.data
        });
    } catch (error) {
        console.error('Check Symptoms Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze symptoms',
            error: error.message
        });
    }
};

// @desc    Start new chat
// @route   POST /api/health/chat/new
// @access  Private
export const startNewChat = async (req, res) => {
    try {
        const healthData = await getUserHealthData(req.user._id);

        const chat = await HealthChat.create({
            userId: req.user._id,
            messages: [],
            contextSnapshot: {
                age: req.user.age,
                hasPeriodData: healthData.hasPeriodData,
                hasPregnancyData: healthData.hasPregnancyData,
                lastPeriodDate: healthData.periodData?.lastPeriodDate,
                pregnancyWeek: healthData.pregnancyData?.currentWeek
            }
        });

        res.status(201).json({
            success: true,
            data: {
                chatId: chat._id,
                contextSnapshot: chat.contextSnapshot
            }
        });
    } catch (error) {
        console.error('Start New Chat Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start new chat',
            error: error.message
        });
    }
};
