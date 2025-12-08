import CommunityPost from '../models/communityPostModel.js';

// Helper function to handle legacy likes
const normalizeLikes = (likes) => {
    return Array.isArray(likes) ? likes : [];
};

/**
 * Get all posts with pagination and filtering
 * GET /api/community
 */
export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const sort = req.query.sort || '-createdAt';

        let query = {};
        if (category && category !== 'All') {
            query.category = category;
        }

        const posts = await CommunityPost.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await CommunityPost.countDocuments(query);

        const transformedPosts = posts.map(post => {
            const postObj = post.toObject();
            const likesArray = normalizeLikes(post.likes);

            return {
                ...postObj,
                likesCount: likesArray.length,
                hasLiked: req.user ? likesArray.some(id => id.toString() === req.user._id.toString()) : false,
                commentsCount: post.comments ? post.comments.length : 0
            };
        });

        res.json({
            success: true,
            count: transformedPosts.length,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            data: transformedPosts
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

        post.views += 1;
        await post.save();

        const postObj = post.toObject();
        const likesArray = normalizeLikes(post.likes);

        const transformedPost = {
            ...postObj,
            likesCount: likesArray.length,
            hasLiked: req.user ? likesArray.some(id => id.toString() === req.user._id.toString()) : false,
            commentsCount: post.comments ? post.comments.length : 0
        };

        res.json({
            success: true,
            data: transformedPost
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
        const { title, content, category, tags, isAnonymous } = req.body;

        const newPost = await CommunityPost.create({
            userId: req.user._id,
            user: { name: isAnonymous ? 'Anonymous' : req.user.name },
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
 * Like/Unlike a post (Toggle)
 * PUT /api/community/:id/like
 */
export const likePost = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const userId = req.user._id;

        // Convert legacy likes to array
        post.likes = normalizeLikes(post.likes);

        const hasLiked = post.likes.some(id => id.toString() === userId.toString());

        if (hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            success: true,
            data: {
                likes: post.likes.length,
                hasLiked: !hasLiked
            }
        });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * Add a comment to a post
 * POST /api/community/:id/comment
 */
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const newComment = {
            userId: req.user._id,
            user: { name: req.user.name },
            content: content.trim(),
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({
            success: true,
            data: post.comments,
            message: 'Comment added successfully'
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
