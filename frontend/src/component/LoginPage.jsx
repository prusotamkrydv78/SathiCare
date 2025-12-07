import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        try {
            const result = await login(formData);

            if (result.success) {
                // Successfully logged in
                navigate('/dashboard');
            } else {
                // Login failed
                setApiError(result.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            setApiError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Left Side - Company Info */}
            <motion.div
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Decorative Elements */}
                <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative z-10">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Link to="/" className="flex items-center gap-3 mb-16">
                            <motion.div
                                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-pink font-bold text-2xl shadow-lg"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            >
                                S
                            </motion.div>
                            <span className="text-3xl font-bold text-white">SaathiCare</span>
                        </Link>
                    </motion.div>

                    {/* Main Content */}
                    <div className="text-white">
                        <motion.h1
                            className="text-5xl font-bold mb-6 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            Welcome Back!
                        </motion.h1>
                        <motion.p
                            className="text-xl opacity-90 mb-12 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Continue your health journey with personalized insights and expert care.
                        </motion.p>

                        {/* Features */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            {[
                                { icon: '📊', title: 'Track Your Health', desc: 'Monitor your cycle, pregnancy, and overall wellness' },
                                { icon: '🤖', title: 'AI-Powered Insights', desc: 'Get personalized predictions and health tips' },
                                { icon: '👩‍⚕️', title: 'Expert Support', desc: 'Connect with verified doctors and specialists' }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-start gap-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (i * 0.1), duration: 0.5 }}
                                    whileHover={{ x: 10 }}
                                >
                                    <motion.div
                                        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                                        <p className="opacity-75 text-sm">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Stats */}
                <motion.div
                    className="relative z-10 grid grid-cols-3 gap-8 pt-8 border-t border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    {[
                        { num: '10K+', label: 'Active Users' },
                        { num: '4.9/5', label: 'User Rating' },
                        { num: '98%', label: 'Satisfaction' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="text-3xl font-bold text-white mb-1">{stat.num}</div>
                            <div className="text-sm opacity-75">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Link to="/" className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                S
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                SaathiCare
                            </span>
                        </Link>
                    </motion.div>

                    {/* Form Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                        <p className="text-gray-600">Enter your credentials to access your account</p>
                    </motion.div>

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

                    {/* Login Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <motion.input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                    } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                                placeholder="you@example.com"
                                whileFocus={{ scale: 1.01 }}
                            />
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.email}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <motion.input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                        } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                                    placeholder="••••••••"
                                    whileFocus={{ scale: 1.01 }}
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
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
                                </motion.button>
                            </div>
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.password}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Remember Me & Forgot Password */}
                        <motion.div
                            className="flex items-center justify-between"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-pink border-gray-300 rounded focus:ring-primary-pink"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary-pink hover:text-pink-700 font-semibold">
                                Forgot password?
                            </Link>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </motion.svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </motion.form>

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

                    {/* Sign Up Link */}
                    <motion.p
                        className="text-center text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-pink hover:text-pink-700 font-semibold">
                            Sign up for free
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

export default LoginPage;
