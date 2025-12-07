import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Globe,
    Bell,
    Moon,
    Lock,
    Shield,
    Camera,
    Save,
    Trash2,
    ChevronLeft,
    AlertCircle,
    CheckCircle,
    Loader,
    ChevronRight
} from 'lucide-react';
import * as userService from '../services/userService';

const ProfileManage = () => {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();

    // State management
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        language: 'english',
        primaryLocation: {
            city: '',
            state: ''
        }
    });

    // Preferences state
    const [preferences, setPreferences] = useState({
        notifications: true,
        darkMode: false
    });

    // Load user profile on mount
    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await userService.getUserProfile();

            if (response.success && response.data.user) {
                const userData = response.data.user;
                setUser(userData);

                // Populate form data
                setFormData({
                    name: userData.name || '',
                    age: userData.age || '',
                    phone: userData.phone || '',
                    language: userData.language || 'english',
                    primaryLocation: {
                        city: userData.primaryLocation?.city || '',
                        state: userData.primaryLocation?.state || ''
                    }
                });

                // Set preferences if available
                if (userData.preferences) {
                    setPreferences({
                        notifications: userData.preferences.notifications ?? true,
                        darkMode: userData.preferences.darkMode ?? false
                    });
                }
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            setError(err.message || 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleToggle = (field) => {
        setPreferences(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            setError(null);
            setSuccess(null);

            // Update profile
            const profileResponse = await userService.updateUserProfile(formData);

            // Update preferences
            const preferencesResponse = await userService.updatePreferences(preferences);

            if (profileResponse.success && preferencesResponse.success) {
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                await loadUserProfile(); // Reload to get fresh data

                // Notify Layout to update notification count
                window.dispatchEvent(new Event('notificationUpdate'));

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            setError(err.message || 'Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setIsSaving(true);
            setError(null);

            const response = await userService.deleteUserAccount();

            if (response.success) {
                await logout();
                navigate('/');
            }
        } catch (err) {
            console.error('Error deleting account:', err);
            setError(err.message || 'Failed to delete account');
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsSaving(true);
            setError(null);

            const response = await userService.uploadProfileImage(file);

            if (response.success) {
                setSuccess('Profile image updated!');
                await loadUserProfile();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            setError(err.message || 'Failed to upload image');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-pink-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-8 text-center">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <label
                            htmlFor="profile-image-upload"
                            className="absolute bottom-0 right-0 bg-pink-600 text-white p-2 rounded-full shadow-lg hover:bg-pink-700 transition cursor-pointer"
                        >
                            <Camera className="w-4 h-4" />
                            <input
                                id="profile-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</h1>
                    <p className="text-sm text-gray-500">{user?.email || ''}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {/* Success/Error Messages */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
                    >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-800 font-medium text-sm">{success}</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800 font-medium text-sm">{error}</p>
                    </motion.div>
                )}

                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    <div className="px-6 py-6 space-y-5">
                        {/* Full Name */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-600">
                                <User className="w-4 h-4" />
                                <span className="text-sm font-medium">Full Name</span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="text-sm font-medium text-gray-900 text-right border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <span className="text-sm font-medium text-gray-900">{user?.name || 'N/A'}</span>
                            )}
                        </div>

                        {/* Age */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">Age</span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="text-sm font-medium text-gray-900 text-right border border-gray-300 rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Age"
                                />
                            ) : (
                                <span className="text-sm font-medium text-gray-900">{user?.age || 'N/A'}</span>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm font-medium">Phone</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user?.phone || 'N/A'}</span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">Email</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user?.email || 'N/A'}</span>
                        </div>

                        {/* Language */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Globe className="w-4 h-4" />
                                <span className="text-sm font-medium">Language</span>
                            </div>
                            {isEditing ? (
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    className="text-sm font-medium text-gray-900 text-right border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="english">English</option>
                                    <option value="nepali">Nepali</option>
                                    <option value="hindi">Hindi</option>
                                    <option value="maithili">Maithili</option>
                                </select>
                            ) : (
                                <span className="text-sm font-medium text-gray-900 capitalize">{user?.language || 'English'}</span>
                            )}
                        </div>

                        {/* Location */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">Location</span>
                            </div>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="primaryLocation.city"
                                        value={formData.primaryLocation.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="text-sm font-medium text-gray-900 text-right border border-gray-300 rounded-lg px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        name="primaryLocation.state"
                                        value={formData.primaryLocation.state}
                                        onChange={handleInputChange}
                                        placeholder="State"
                                        className="text-sm font-medium text-gray-900 text-right border border-gray-300 rounded-lg px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    />
                                </div>
                            ) : (
                                <span className="text-sm font-medium text-gray-900">
                                    {user?.primaryLocation?.city && user?.primaryLocation?.state
                                        ? `${user.primaryLocation.city}, ${user.primaryLocation.state}`
                                        : 'N/A'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-900">Settings</h2>
                    </div>

                    <div className="px-6 py-6 space-y-5">
                        {/* Notifications Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-4 h-4 text-gray-600" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Health tips and reminders</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle('notifications')}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${preferences.notifications ? 'bg-pink-600' : 'bg-gray-200'
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${preferences.notifications ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Moon className="w-4 h-4 text-gray-600" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Reduce eye strain</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle('darkMode')}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${preferences.darkMode ? 'bg-gray-800' : 'bg-gray-200'
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${preferences.darkMode ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Change Password */}
                        <button className="w-full flex items-center justify-between py-3 px-4 -mx-4 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">Change Password</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Two-Factor Auth */}
                        <button className="w-full flex items-center justify-between py-3 px-4 -mx-4 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">Two-Factor Authentication</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <h2 className="text-base font-bold text-red-600">Danger Zone</h2>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                            Once you delete your account, there is no going back.
                        </p>
                    </div>

                    <div className="px-6 py-6 flex gap-3">
                        <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold text-sm py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                            Export Data
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex-1 bg-red-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                    <div className="sticky bottom-6">
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account?</h3>
                            <p className="text-sm text-gray-600">
                                This action cannot be undone. All your data will be permanently deleted.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isSaving}
                                className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ProfileManage;
