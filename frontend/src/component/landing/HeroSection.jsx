import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <header className="py-20 px-6 text-center md:text-left relative overflow-hidden">
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.span
                    className="absolute top-[60%] left-[10%] text-2xl"
                    animate={{ y: [-20, 0, -20], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    🌸
                </motion.span>
                <motion.span
                    className="absolute top-[80%] left-[20%] text-3xl"
                    animate={{ y: [-20, 0, -20], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                    💖
                </motion.span>
                <motion.span
                    className="absolute top-[50%] left-[80%] text-xl"
                    animate={{ y: [-20, 0, -20], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    💗
                </motion.span>
                <motion.span
                    className="absolute top-[70%] left-[90%] text-4xl"
                    animate={{ y: [-20, 0, -20], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                >
                    🌺
                </motion.span>
                <motion.span
                    className="absolute top-[40%] left-[5%] text-2xl"
                    animate={{ y: [-20, 0, -20], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                >
                    💕
                </motion.span>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10 gap-12">
                <motion.div
                    className="md:w-1/2 mb-10 md:mb-0"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-block mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <span className="px-4 py-2 bg-pink-100 text-primary-pink rounded-full text-sm font-semibold">
                            🌸 Your Health Companion
                        </span>
                    </motion.div>
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Empowering Women's Health
                        <br />
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            तपाईंको स्वास्थ्य साथी
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl mb-8 text-gray-600 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        Track your health, connect with experts, and access personalized care—all in one place. Built for women in Nepal.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/signup"
                                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-200 font-semibold text-center block"
                            >
                                Get Started Free →
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/features"
                                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:border-primary-pink transition-all duration-200 font-semibold text-center block"
                            >
                                Explore Features
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        className="mt-12 flex flex-wrap items-center gap-6 text-sm text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">100% Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">AI-Powered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Free to Use</span>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="md:w-1/2 relative"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {/* Hero Image/Illustration */}
                    <div className="relative">
                        <motion.div
                            className="w-full aspect-square max-w-lg mx-auto bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Decorative Elements */}
                            <motion.div
                                className="absolute top-10 right-10 w-20 h-20 bg-pink-300 rounded-full opacity-50"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute bottom-10 left-10 w-16 h-16 bg-purple-300 rounded-full opacity-50"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                            />

                            {/* Main Content */}
                            <div className="text-center z-10">
                                <motion.div
                                    className="text-8xl mb-4"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    🌸
                                </motion.div>
                                <p className="text-gray-600 font-semibold text-lg">Your Health Journey Starts Here</p>
                            </div>
                        </motion.div>

                        {/* Floating Stats */}
                        <motion.div
                            className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                                    ✓
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">10K+</p>
                                    <p className="text-xs text-gray-500">Happy Users</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-2xl">
                                    ⭐
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">4.9/5</p>
                                    <p className="text-xs text-gray-500">User Rating</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
};

export default HeroSection;
