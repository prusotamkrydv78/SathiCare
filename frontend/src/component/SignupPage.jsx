import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
            await signup(signupData);
            navigate('/dashboard');
        } catch (error) {
            setApiError(error.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Left Side - Company Info */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-pink font-bold text-2xl shadow-lg">
                            S
                        </div>
                        <span className="text-3xl font-bold text-white">SaathiCare</span>
                    </Link>

                    {/* Main Content */}
                    <div className="text-white">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Start Your Health Journey
                        </h1>
                        <p className="text-xl opacity-90 mb-12 leading-relaxed">
                            Join thousands of women who trust SaathiCare for their health and wellness.
                        </p>

                        {/* Progress Steps */}
                        <div className="space-y-4 mb-12">
                            {tabs.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${index === currentTab
                                            ? 'bg-white/20 backdrop-blur-sm'
                                            : index < currentTab
                                                ? 'bg-white/10'
                                                : 'opacity-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${index < currentTab
                                            ? 'bg-green-500 text-white'
                                            : index === currentTab
                                                ? 'bg-white text-primary-pink'
                                                : 'bg-white/20 text-white'
                                        }`}>
                                        {index < currentTab ? '✓' : tab.icon}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{tab.name}</div>
                                        <div className="text-sm opacity-75">
                                            {index === 0 && 'Basic account information'}
                                            {index === 1 && 'Contact details'}
                                            {index === 2 && 'Your preferences'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Benefits */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>100% Free Forever</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Privacy Protected</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>AI-Powered Insights</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">10K+</div>
                        <div className="text-sm opacity-75">Active Users</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                        <div className="text-sm opacity-75">User Rating</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">98%</div>
                        <div className="text-sm opacity-75">Satisfaction</div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            S
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            SaathiCare
                        </span>
                    </Link>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-600">Step {currentTab + 1} of {tabs.length}: {tabs[currentTab].name}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex gap-2">
                            {tabs.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${index <= currentTab ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 text-sm">{apiError}</span>
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Tab 1 - Account Info */}
                        {currentTab === 0 && (
                            <>
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                            } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                                        placeholder="Your full name"
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                            } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                                } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                                } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Tab 2 - Contact Info */}
                        {currentTab === 1 && (
                            <>
                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                            } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                                        placeholder="9800000000"
                                    />
                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.phone}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">Used for emergency alerts and notifications</p>
                                </div>

                                {/* Age Field */}
                                <div>
                                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Age (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        min="13"
                                        max="100"
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.age ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                            } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                                        placeholder="Enter your age"
                                    />
                                    {errors.age && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.age}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">Helps us provide age-appropriate health insights</p>
                                </div>

                                {/* Info Box */}
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex gap-3">
                                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <div className="text-sm text-blue-700">
                                            <p className="font-semibold mb-1">Your privacy matters</p>
                                            <p>Your contact information is encrypted and never shared with third parties.</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Tab 3 - Preferences */}
                        {currentTab === 2 && (
                            <>
                                {/* Language Field */}
                                <div>
                                    <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Preferred Language
                                    </label>
                                    <select
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="english">English</option>
                                        <option value="nepali">नेपाली (Nepali)</option>
                                        <option value="hindi">हिन्दी (Hindi)</option>
                                        <option value="maithili">मैथिली (Maithili)</option>
                                    </select>
                                    <p className="mt-2 text-xs text-gray-500">Choose your preferred language for the app</p>
                                </div>

                                {/* City Field */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                        City (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200"
                                        placeholder="e.g., Kathmandu"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Helps us find nearby healthcare facilities</p>
                                </div>

                                {/* Terms & Conditions */}
                                <div className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        required
                                        className="mt-1 w-4 h-4 text-primary-pink border-gray-300 rounded focus:ring-primary-pink"
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-primary-pink hover:text-pink-700 font-semibold">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link to="/privacy" className="text-primary-pink hover:text-pink-700 font-semibold">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>

                                {/* Success Message */}
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="flex gap-3">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div className="text-sm text-green-700">
                                            <p className="font-semibold mb-1">Almost done!</p>
                                            <p>Click "Create Account" to start your health journey.</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 pt-4">
                            {currentTab > 0 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                                >
                                    Previous
                                </button>
                            )}
                            {currentTab < tabs.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-pink hover:text-pink-700 font-semibold">
                            Sign in
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
