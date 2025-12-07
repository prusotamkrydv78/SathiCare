import express from 'express';
import { body } from 'express-validator';
import {
    signup,
    login,
    refreshToken,
    logout,
    getMe
} from '../controllers/authController.js';
import { protect, verifyRefresh } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Validation rules
const signupValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('age').optional().isInt({ min: 13, max: 100 }).withMessage('Age must be between 13 and 100'),
    body('language').optional().isIn(['nepali', 'hindi', 'english', 'maithili']).withMessage('Invalid language'),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/refresh-token', verifyRefresh, refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
