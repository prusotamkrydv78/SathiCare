import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import SignupCompanyInfo from './signup/SignupCompanyInfo';
import SignupFormHeader from './signup/SignupFormHeader';
import SignupTab1 from './signup/SignupTab1';
import SignupTab2 from './signup/SignupTab2';
import SignupTab3 from './signup/SignupTab3';
import SignupNavigationButtons from './signup/SignupNavigationButtons';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup, loading } = useAuth();

    const [currentTab, setCurrentTab] = useState(0);
    const [formData, setFormData] = useState({
        // Tab 1 - Account Info
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        // Tab 2 - Contact Info
        phone: '',
        age: '',
        // Tab 3 - Preferences
        language: 'english',
        city: ''
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const tabs = [
        { id: 0, name: 'Account', icon: '👤' },
        { id: 1, name: 'Contact', icon: '📱' },
        { id: 2, name: 'Preferences', icon: '⚙️' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (apiError) setApiError('');
    };

    const validateTab = (tabIndex) => {
        const newErrors = {};

        if (tabIndex === 0) {
            // Tab 1 - Account Info
            if (!formData.name.trim()) {
                newErrors.name = 'Name is required';
            } else if (formData.name.trim().length < 2) {
                newErrors.name = 'Name must be at least 2 characters';
            }

            if (!formData.email) {
                newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email';
            }

            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        } else if (tabIndex === 1) {
            // Tab 2 - Contact Info
            if (!formData.phone) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
                newErrors.phone = 'Please enter a valid 10-digit phone number';
            }

            if (formData.age && (formData.age < 13 || formData.age > 100)) {
                newErrors.age = 'Age must be between 13 and 100';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateTab(currentTab)) {
            setCurrentTab(prev => Math.min(prev + 1, tabs.length - 1));
        }
    };

    const handlePrevious = () => {
        setCurrentTab(prev => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateTab(currentTab)) {
            return;
        }

        try {
            const { confirmPassword, ...signupData } = formData;
            // Convert age to number if provided
            if (signupData.age) {
                signupData.age = parseInt(signupData.age);
            }

            const result = await signup(signupData);

            if (result.success) {
                // Successfully signed up and authenticated
                navigate('/dashboard');
            } else {
                // Signup failed
                setApiError(result.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            setApiError(error.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Left Side - Company Info */}
            <SignupCompanyInfo currentTab={currentTab} tabs={tabs} />

            {/* Right Side - Signup Form */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="w-full max-w-md">
                    {/* Form Header */}
                    <SignupFormHeader currentTab={currentTab} tabs={tabs} />

                    {/* API Error */}
                    <AnimatePresence>
                        {apiError && (
                            <motion.div
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-700 text-sm">{apiError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {/* Tab 1 - Account Info */}
                            {currentTab === 0 && (
                                <SignupTab1
                                    formData={formData}
                                    errors={errors}
                                    showPassword={showPassword}
                                    showConfirmPassword={showConfirmPassword}
                                    handleChange={handleChange}
                                    setShowPassword={setShowPassword}
                                    setShowConfirmPassword={setShowConfirmPassword}
                                />
                            )}

                            {/* Tab 2 - Contact Info */}
                            {currentTab === 1 && (
                                <SignupTab2
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />
                            )}

                            {/* Tab 3 - Preferences */}
                            {currentTab === 2 && (
                                <SignupTab3
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <SignupNavigationButtons
                            currentTab={currentTab}
                            tabs={tabs}
                            loading={loading}
                            handlePrevious={handlePrevious}
                            handleNext={handleNext}
                        />
                    </form>

                    {/* Divider */}
                    <motion.div
                        className="my-8 flex items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                    >
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </motion.div>

                    {/* Login Link */}
                    <motion.p
                        className="text-center text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-pink hover:text-pink-700 font-semibold">
                            Sign in
                        </Link>
                    </motion.p>

                    {/* Back to Home */}
                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                    >
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to home
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
