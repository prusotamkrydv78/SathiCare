import express from 'express';
import { body } from 'express-validator';
import {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    updateHealthProfile,
    updatePreferences,
    uploadProfileImage
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/account', deleteUserAccount);

// Health profile routes
router.put('/health-profile', updateHealthProfile);

// Preferences routes
router.put('/preferences', updatePreferences);

// Profile image upload
router.post('/profile-image', upload.single('profileImage'), uploadProfileImage);

export default router;
