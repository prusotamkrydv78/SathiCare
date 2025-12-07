import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional linking
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const communityPostSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
        trim: true
    },
    category: {
        type: String,
        enum: ['General', 'Health', 'Pregnancy', 'Period', 'Mental Wellness', 'Relationships', 'Career', 'Motherhood'],
        default: 'General'
    },
    tags: [{
        type: String,
        trim: true
    }],
    isAnonymous: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

// Index for search
communityPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

export default CommunityPost;
