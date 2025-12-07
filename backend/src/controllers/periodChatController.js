import PeriodChat from '../models/periodChatModel.js';
import PeriodCycle from '../models/periodCycleModel.js';
import { chatAboutPeriods } from '../services/periodChatService.js';

// @desc    Send a message and get AI response about period data
// @route   POST /api/period/chat
// @access  Private
export const sendChatMessage = async (req, res) => {
    try {
        const { message, chatId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Get user's period data
        const cycles = await PeriodCycle.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .limit(12);

        if (cycles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No period data found. Please log your periods first to chat about them.'
            });
        }

        // Get or create chat session
        let chat;
        if (chatId) {
            chat = await PeriodChat.findOne({ _id: chatId, userId: req.user._id, isActive: true });
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat session not found'
                });
            }
        } else {
            // Create new chat session
            chat = await PeriodChat.create({
                userId: req.user._id,
                messages: [],
                contextSnapshot: {
                    totalCycles: cycles.length,
                    averageCycleLength: cycles.filter(c => c.cycleLength).length > 0
                        ? Math.round(cycles.filter(c => c.cycleLength).map(c => c.cycleLength).reduce((a, b) => a + b, 0) / cycles.filter(c => c.cycleLength).length)
                        : 28,
                    lastPeriodDate: cycles[0].startDate,
                    isIrregular: cycles.filter(c => c.cycleLength).length > 3 &&
                        (Math.max(...cycles.filter(c => c.cycleLength).map(c => c.cycleLength)) -
                            Math.min(...cycles.filter(c => c.cycleLength).map(c => c.cycleLength))) > 7
                }
            });
        }

        // Add user message to chat
        chat.messages.push({
            role: 'user',
            content: message.trim(),
            timestamp: new Date()
        });

        // Get AI response
        const aiResponse = await chatAboutPeriods(
            message.trim(),
            cycles,
            req.user,
            chat.messages
        );

        if (!aiResponse.success) {
            return res.status(500).json(aiResponse);
        }

        // Add AI response to chat
        chat.messages.push({
            role: 'assistant',
            content: aiResponse.data.message,
            timestamp: new Date()
        });

        await chat.save();

        res.status(200).json({
            success: true,
            data: {
                chatId: chat._id,
                message: aiResponse.data.message,
                context: aiResponse.data.context,
                messageCount: chat.messages.length
            }
        });
    } catch (error) {
        console.error('Send Chat Message Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// @desc    Get chat history
// @route   GET /api/period/chat/:chatId
// @access  Private
export const getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await PeriodChat.findOne({
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
            data: {
                chat
            }
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
// @route   GET /api/period/chats
// @access  Private
export const getAllChats = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const chats = await PeriodChat.find({
            userId: req.user._id,
            isActive: true
        })
            .sort({ updatedAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('messages contextSnapshot createdAt updatedAt');

        const total = await PeriodChat.countDocuments({
            userId: req.user._id,
            isActive: true
        });

        // Add preview of last message
        const chatsWithPreview = chats.map(chat => ({
            _id: chat._id,
            lastMessage: chat.messages[chat.messages.length - 1],
            messageCount: chat.messages.length,
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
// @route   DELETE /api/period/chat/:chatId
// @access  Private
export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await PeriodChat.findOne({
            _id: chatId,
            userId: req.user._id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        // Soft delete
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

// @desc    Start new chat session
// @route   POST /api/period/chat/new
// @access  Private
export const startNewChat = async (req, res) => {
    try {
        // Get user's period data for context
        const cycles = await PeriodCycle.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .limit(12);

        if (cycles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No period data found. Please log your periods first.'
            });
        }

        const cycleLengths = cycles.filter(c => c.cycleLength).map(c => c.cycleLength);

        // Create new chat
        const chat = await PeriodChat.create({
            userId: req.user._id,
            messages: [],
            contextSnapshot: {
                totalCycles: cycles.length,
                averageCycleLength: cycleLengths.length > 0
                    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
                    : 28,
                lastPeriodDate: cycles[0].startDate,
                isIrregular: cycleLengths.length > 3 &&
                    (Math.max(...cycleLengths) - Math.min(...cycleLengths)) > 7
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
