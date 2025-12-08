import express from 'express';
import {
    getPosts,
    createPost,
    getPostById,
    likePost,
    addComment
} from '../controllers/communityController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getPosts);
router.post('/', createPost);
router.get('/:id', getPostById);
router.put('/:id/like', likePost);
router.post('/:id/comment', addComment);

export default router;

