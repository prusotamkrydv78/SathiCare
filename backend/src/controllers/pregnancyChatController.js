import PregnancyChat from '../models/pregnancyChatModel.js';
import Pregnancy from '../models/pregnancyModel.js';
import { chatAboutPregnancy } from '../services/pregnancyAIService.js';

// @desc    Send a message and get AI response about pregnancy
// @route   POST /api/pregnancy/chat
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

        // Get user's active pregnancy
        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found. Please start pregnancy tracking first.'
            });
        }

        // Get or create chat session
        let chat;
        if (chatId) {
            chat = await PregnancyChat.findOne({
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
            // Create new chat session
            chat = await PregnancyChat.create({
                userId: req.user._id,
                pregnancyId: pregnancy._id,
                messages: [],
                contextSnapshot: {
                    currentWeek: pregnancy.currentWeek,
                    trimester: pregnancy.trimester,
                    dueDate: pregnancy.dueDate
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
        const aiResponse = await chatAboutPregnancy(
            message.trim(),
            pregnancy,
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
// @route   GET /api/pregnancy/chat/:chatId
// @access  Private
export const getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await PregnancyChat.findOne({
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
// @route   GET /api/pregnancy/chats
// @access  Private
export const getAllChats = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const chats = await PregnancyChat.find({
            userId: req.user._id,
            isActive: true
        })
            .sort({ updatedAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('messages contextSnapshot createdAt updatedAt');

        const total = await PregnancyChat.countDocuments({
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
// @route   DELETE /api/pregnancy/chat/:chatId
// @access  Private
export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await PregnancyChat.findOne({
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
// @route   POST /api/pregnancy/chat/new
// @access  Private
export const startNewChat = async (req, res) => {
    try {
        // Get user's active pregnancy
        const pregnancy = await Pregnancy.findOne({
            userId: req.user._id,
            isActive: true
        });

        if (!pregnancy) {
            return res.status(404).json({
                success: false,
                message: 'No active pregnancy found. Please start pregnancy tracking first.'
            });
        }

        // Create new chat
        const chat = await PregnancyChat.create({
            userId: req.user._id,
            pregnancyId: pregnancy._id,
            messages: [],
            contextSnapshot: {
                currentWeek: pregnancy.currentWeek,
                trimester: pregnancy.trimester,
                dueDate: pregnancy.dueDate
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
