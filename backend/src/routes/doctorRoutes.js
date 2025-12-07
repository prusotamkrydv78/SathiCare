import express from 'express';
import {
    getAllDoctors,
    getDoctorById,
    getDoctorAvailability,
    searchDoctors,
    getSpecializations
} from '../controllers/doctorController.js';

const router = express.Router();

// Public routes
router.get('/specializations', getSpecializations);
router.get('/search', searchDoctors);
router.get('/:id/availability', getDoctorAvailability);
router.get('/:id', getDoctorById);
router.get('/', getAllDoctors);

export default router;
