import User from '../models/userModel.js';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-otp -refreshToken');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update allowed fields
        const allowedUpdates = ['name', 'age', 'language', 'profileImage', 'primaryLocation', 'healthProfile', 'preferences'];

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                if (key === 'primaryLocation' || key === 'healthProfile' || key === 'preferences') {
                    // For nested objects, merge with existing data
                    user[key] = { ...user[key].toObject(), ...req.body[key] };
                } else {
                    user[key] = req.body[key];
                }
            }
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
export const deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Soft delete - deactivate account
        user.isActive = false;
        user.refreshToken = null;
        await user.save();

        // Or hard delete - completely remove
        // await User.findByIdAndDelete(req.user._id);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error.message
        });
    }
};

// @desc    Update health profile
// @route   PUT /api/user/health-profile
// @access  Private
export const updateHealthProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update health profile
        user.healthProfile = { ...user.healthProfile.toObject(), ...req.body };
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Health profile updated successfully',
            data: {
                healthProfile: user.healthProfile
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update health profile',
            error: error.message
        });
    }
};

// @desc    Update preferences
// @route   PUT /api/user/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update preferences
        user.preferences = { ...user.preferences.toObject(), ...req.body };
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Preferences updated successfully',
            data: {
                preferences: user.preferences
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences',
            error: error.message
        });
    }
};
