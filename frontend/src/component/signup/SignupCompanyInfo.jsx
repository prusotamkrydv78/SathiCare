import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupCompanyInfo = ({ currentTab, tabs }) => {
    return (
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
                        Start Your Health Journey
                    </motion.h1>
                    <motion.p
                        className="text-xl opacity-90 mb-12 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Join thousands of women who trust SaathiCare for their health and wellness.
                    </motion.p>

                    {/* Progress Steps */}
                    <motion.div
                        className="space-y-4 mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        {tabs.map((tab, index) => (
                            <motion.div
                                key={tab.id}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${index === currentTab
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : index < currentTab
                                            ? 'bg-white/10'
                                            : 'opacity-50'
                                    }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                                whileHover={{ x: 5 }}
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
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Benefits */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                    >
                        {[
                            '100% Free Forever',
                            'Privacy Protected',
                            'AI-Powered Insights'
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.0 + (i * 0.1), duration: 0.5 }}
                                whileHover={{ x: 5 }}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{benefit}</span>
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
                transition={{ delay: 1.3, duration: 0.6 }}
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
    );
};

export default SignupCompanyInfo;
