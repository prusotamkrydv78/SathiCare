import express from 'express';
import { upload } from '../config/cloudinary.js';
import {
    uploadMedia,
    getMessages,
    getActiveConsultations
} from '../controllers/consultationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload media (image or document)
router.post('/:appointmentId/upload', upload.single('file'), uploadMedia);

// Get messages
router.get('/:appointmentId/messages', getMessages);

// Get active consultations
router.get('/active', getActiveConsultations);

export default router;
