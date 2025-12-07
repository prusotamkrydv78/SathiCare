import express from 'express';
import { getTest, postTest } from '../controllers/testController.js';

const router = express.Router();

// Test routes
router.get('/test', getTest);
router.post('/test', postTest);

export default router;
