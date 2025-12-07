import CommunityPost from '../models/communityPostModel.js';

/**
 * Get all posts with pagination and filtering
 * GET /api/community
 */
export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const sort = req.query.sort || '-createdAt'; // Default: Newest first

        let query = {};
        if (category && category !== 'All') {
            query.category = category;
        }

        const posts = await CommunityPost.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await CommunityPost.countDocuments(query);

        res.json({
            success: true,
            count: posts.length,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            data: posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Get single post details
 * GET /api/community/:id
 */
export const getPostById = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Create a new post
 * POST /api/community
 */
export const createPost = async (req, res) => {
    try {
        const { title, content, category, tags, isAnonymous, userName } = req.body;

        const newPost = await CommunityPost.create({
            user: { name: userName || 'Anonymous User' }, // In real app, get from req.user
            title,
            content,
            category,
            tags,
            isAnonymous
        });

        res.status(201).json({
            success: true,
            data: newPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

/**
 * Like a post
 * PUT /api/community/:id/like
 */
export const likePost = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Simple increment for now. In real app, track user IDs to prevent double liking.
        post.likes += 1;
        await post.save();

        res.json({
            success: true,
            data: { likes: post.likes }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Add a comment
 * POST /api/community/:id/comment
 */
export const addComment = async (req, res) => {
    try {
        const { userName, content } = req.body;

        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const newComment = {
            user: { name: userName || 'Anonymous' },
            content
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({
            success: true,
            data: post.comments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
