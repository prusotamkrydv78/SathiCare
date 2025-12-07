import express from 'express';
import { getHospitalReviews, createReview } from '../controllers/reviewController.js';

const router = express.Router();

/**
 * @route   GET /api/reviews/:hospitalId
 * @desc    Get reviews for a specific hospital
 * @access  Public
 */
router.get('/:hospitalId', getHospitalReviews);

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Public (or Protected if you add auth middleware)
 */
router.post('/', createReview);

export default router;
