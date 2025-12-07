import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        // Basic Required Info (collected at signup)
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false // Don't return password by default in queries
        },

        // Optional Basic Info (can be added later)
        age: {
            type: Number,
            min: [13, 'Age must be at least 13'],
            max: [100, 'Age must be less than 100'],
            default: null
        },
        language: {
            type: String,
            enum: ['nepali', 'hindi', 'english', 'maithili'],
            default: 'english'
        },
        profileImage: {
            type: String,
            default: null
        },
        primaryLocation: {
            city: String,
            state: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            }
        },

        // Refresh token for JWT
        refreshToken: {
            type: String,
            default: null
        },

        // Account status
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: Date
    },
    {
        timestamps: true
    }
);

// Indexes are automatically created by unique: true on email and phone fields

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    delete user.__v;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
