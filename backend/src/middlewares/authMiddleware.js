import User from '../models/userModel.js';
import { verifyAccessToken, verifyRefreshToken } from '../utils/jwtUtils.js';

// Protect routes - verify access token
export const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from cookie or Authorization header
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        try {
            // Verify token
            const decoded = verifyAccessToken(token);

            // Get user from database
            req.user = await User.findById(decoded.userId).select('-otp -refreshToken');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (!req.user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token invalid or expired'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error in authentication',
            error: error.message
        });
    }
};

// Verify refresh token middleware
export const verifyRefresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token provided'
            });
        }

        try {
            const decoded = verifyRefreshToken(refreshToken);

            // Get user and verify refresh token matches
            const user = await User.findById(decoded.userId);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid refresh token'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token expired or invalid'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error in token verification',
            error: error.message
        });
    }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken ||
            (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (token) {
            try {
                const decoded = verifyAccessToken(token);
                req.user = await User.findById(decoded.userId).select('-otp -refreshToken');
            } catch (error) {
                // Token invalid, but continue without user
                req.user = null;
            }
        }

        next();
    } catch (error) {
        next();
    }
};
