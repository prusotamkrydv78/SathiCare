import User from '../models/userModel.js';
import {
    generateAccessToken,
    generateRefreshToken,
    setTokenCookies,
    clearTokenCookies
} from '../utils/jwtUtils.js';

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { email, phone, name, password, age, language } = req.body;

        // Validation
        if (!email || !phone || !name || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, phone, name, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
            });
        }

        // Create new user (password will be hashed by pre-save hook)
        const user = await User.create({
            email,
            phone,
            name,
            password,
            age,
            language: language || 'english'
        });

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                user: user.toJSON(),
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create account',
            error: error.message
        });
    }
};

// @desc    Login user with email and password
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordMatch = await user.matchPassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: {
                user: user.toJSON(),
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error.message
        });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public (requires refresh token)
export const refreshToken = async (req, res) => {
    try {
        // User is attached by verifyRefresh middleware
        const user = req.user;

        // Generate new access token
        const accessToken = generateAccessToken(user._id);

        // Optionally generate new refresh token (rotate refresh tokens)
        const newRefreshToken = generateRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        // Set new cookies
        setTokenCookies(res, accessToken, newRefreshToken);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken,
                refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        console.error('Refresh Token Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to refresh token',
            error: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        // Clear refresh token from database
        req.user.refreshToken = null;
        await req.user.save();

        // Clear cookies
        clearTokenCookies(res);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to logout',
            error: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                user: req.user.toJSON()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get user info',
            error: error.message
        });
    }
};
