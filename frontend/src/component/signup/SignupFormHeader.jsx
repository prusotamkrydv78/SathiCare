import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupFormHeader = ({ currentTab, tabs }) => {
    return (
        <>
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
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">Step {currentTab + 1} of {tabs.length}: {tabs[currentTab].name}</p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <div className="flex gap-2">
                    {tabs.map((tab, index) => (
                        <motion.div
                            key={tab.id}
                            className={`flex-1 h-2 rounded-full transition-all duration-300 ${index <= currentTab ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'
                                }`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5 + (index * 0.1), duration: 0.4 }}
                        />
                    ))}
                </div>
            </motion.div>
        </>
    );
};

export default SignupFormHeader;
