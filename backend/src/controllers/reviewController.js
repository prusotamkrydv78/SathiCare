import Review from '../models/reviewModel.js';

/**
 * Get reviews for a specific hospital
 * GET /api/reviews/:hospitalId
 */
export const getHospitalReviews = async (req, res) => {
    try {
        const { hospitalId } = req.params;

        const reviews = await Review.find({ hospitalId })
            .sort({ createdAt: -1 }); // Newest first

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

/**
 * Create a new review
 * POST /api/reviews
 */
export const createReview = async (req, res) => {
    try {
        const { hospitalId, name, rating, comment } = req.body;

        if (!hospitalId || !name || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newReview = await Review.create({
            hospitalId,
            user: { name },
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: newReview
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting review',
            error: error.message
        });
    }
};
