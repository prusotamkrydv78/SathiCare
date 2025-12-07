import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    hospitalId: {
        type: String,
        required: true,
        index: true
    },
    user: {
        // Optional: link to a user if your system expects logged-in users
        // Use a string name if you allow anonymous/guest reviews
        name: {
            type: String,
            required: true
        },
        // If you have authentication, you might want a userId reference here
        // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
