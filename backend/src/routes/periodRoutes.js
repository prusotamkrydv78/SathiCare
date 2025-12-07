import express from 'express';
import { body } from 'express-validator';
import {
    logPeriod,
    getPeriodHistory,
    getCurrentCycle,
    getCycleStats,
    updatePeriod,
    deletePeriod,
    getAIPrediction,
    getAIAnalysis,
    getAISymptomTips,
    getAIInsights
} from '../controllers/periodController.js';
import {
    sendChatMessage,
    getChatHistory,
    getAllChats,
    deleteChat,
    startNewChat
} from '../controllers/periodChatController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const logPeriodValidation = [
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().withMessage('Valid end date required'),
    validate
];

const chatMessageValidation = [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('chatId').optional().isMongoId().withMessage('Invalid chat ID'),
    validate
];

// Period CRUD routes
router.post('/log', logPeriodValidation, logPeriod);
router.get('/history', getPeriodHistory);
router.get('/current', getCurrentCycle);
router.get('/stats', getCycleStats);
router.put('/:id', updatePeriod);
router.delete('/:id', deletePeriod);

// AI-powered routes
router.get('/ai/predict', getAIPrediction);
router.get('/ai/analyze', getAIAnalysis);
router.post('/ai/symptom-tips', getAISymptomTips);
router.get('/ai/insights', getAIInsights);

// Chat routes
router.post('/chat/new', startNewChat);
router.post('/chat', chatMessageValidation, sendChatMessage);
router.get('/chats', getAllChats);
router.get('/chat/:chatId', getChatHistory);
router.delete('/chat/:chatId', deleteChat);

export default router;
