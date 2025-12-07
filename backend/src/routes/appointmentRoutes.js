import express from 'express';
import { body } from 'express-validator';
import {
    bookAppointment,
    getUserAppointments,
    getAppointmentById,
    cancelAppointment,
    acceptAppointment,
    rejectAppointment,
    completeAppointment,
    rateAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const bookAppointmentValidation = [
    body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
    body('scheduledDate').isISO8601().withMessage('Valid date is required'),
    body('scheduledTime').notEmpty().withMessage('Time is required'),
    body('reason').trim().notEmpty().withMessage('Reason is required'),
    validate
];

const rateValidation = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validate
];

// Appointment routes
router.post('/book', bookAppointmentValidation, bookAppointment);
router.get('/', getUserAppointments);
router.get('/:id', getAppointmentById);
router.delete('/:id', cancelAppointment);

// Doctor actions (TODO: Add doctor auth middleware)
router.put('/:id/accept', acceptAppointment);
router.put('/:id/reject', rejectAppointment);
router.put('/:id/complete', completeAppointment);

// User rating
router.put('/:id/rate', rateValidation, rateAppointment);

export default router;
