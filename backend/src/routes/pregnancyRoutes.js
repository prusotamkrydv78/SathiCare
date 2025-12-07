import express from 'express';
import { body } from 'express-validator';
import {
    startPregnancy,
    getCurrentPregnancy,
    updatePregnancy,
    endPregnancy,
    addHealthLog,
    getHealthLogs,
    addAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment,
    getWeeklyTips,
    startContraction,
    stopContraction,
    getContractionStats
} from '../controllers/pregnancyController.js';
import {
    sendChatMessage,
    getChatHistory,
    getAllChats,
    deleteChat,
    startNewChat
} from '../controllers/pregnancyChatController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const startPregnancyValidation = [
    body('lmpDate').optional().isISO8601().withMessage('Valid LMP date required'),
    body('currentWeek').optional().isInt({ min: 1, max: 42 }).withMessage('Current week must be between 1 and 42'),
    validate
];

const addHealthLogValidation = [
    body('date').optional().isISO8601().withMessage('Valid date required'),
    body('weight').optional().isNumeric().withMessage('Weight must be a number'),
    validate
];

const addAppointmentValidation = [
    body('date').isISO8601().withMessage('Valid date required'),
    body('type').isIn(['checkup', 'ultrasound', 'blood_test', 'glucose_test', 'other']).withMessage('Invalid appointment type'),
    validate
];

const chatMessageValidation = [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('chatId').optional().isMongoId().withMessage('Invalid chat ID'),
    validate
];

// Pregnancy CRUD routes
router.post('/start', startPregnancyValidation, startPregnancy);
router.get('/current', getCurrentPregnancy);
router.put('/update', updatePregnancy);
router.post('/end', endPregnancy);

// Health logging
router.post('/log', addHealthLogValidation, addHealthLog);
router.get('/logs', getHealthLogs);

// Appointments
router.post('/appointment', addAppointmentValidation, addAppointment);
router.get('/appointments', getAppointments);
router.put('/appointment/:id', updateAppointment);
router.delete('/appointment/:id', deleteAppointment);

// AI insights (auto-generated and cached)
router.get('/ai/insights', getWeeklyTips);

// Contraction timer
router.post('/contraction/start', startContraction);
router.post('/contraction/stop', stopContraction);
router.get('/contraction/stats', getContractionStats);

// Chat routes
router.post('/chat/new', startNewChat);
router.post('/chat', chatMessageValidation, sendChatMessage);
router.get('/chats', getAllChats);
router.get('/chat/:chatId', getChatHistory);
router.delete('/chat/:chatId', deleteChat);

export default router;
