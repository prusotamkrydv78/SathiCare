import express from 'express';
import { body } from 'express-validator';
import {
    sendMessage,
    getChatHistory,
    getAllChats,
    deleteChat,
    startNewChat,
    getDailyTip,
    checkSymptoms
} from '../controllers/healthAssistantController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const chatMessageValidation = [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('chatId').optional().isMongoId().withMessage('Invalid chat ID'),
    validate
];

const symptomValidation = [
    body('symptoms').isArray({ min: 1 }).withMessage('Symptoms array is required'),
    validate
];

// Chat routes
router.post('/chat/new', startNewChat);
router.post('/chat', chatMessageValidation, sendMessage);
router.get('/chats', getAllChats);
router.get('/chat/:chatId', getChatHistory);
router.delete('/chat/:chatId', deleteChat);

// Health features
router.get('/tip', getDailyTip);
router.post('/symptoms', symptomValidation, checkSymptoms);

export default router;
