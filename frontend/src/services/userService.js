import api from './api';

/**
 * User Service
 * Handles all user profile related API calls
 */

// Get user profile
export const getUserProfile = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update health profile
export const updateHealthProfile = async (healthData) => {
    try {
        const response = await api.put('/user/health-profile', healthData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update preferences
export const updatePreferences = async (preferences) => {
    try {
        const response = await api.put('/user/preferences', preferences);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete user account
export const deleteUserAccount = async () => {
    try {
        const response = await api.delete('/user/account');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Upload profile image
export const uploadProfileImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', imageFile);

        const response = await api.post('/user/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export default {
    getUserProfile,
    updateUserProfile,
    updateHealthProfile,
    updatePreferences,
    deleteUserAccount,
    uploadProfileImage
};
