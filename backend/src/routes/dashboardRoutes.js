import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Dashboard data endpoint
router.get('/', getDashboardData);

export default router;
