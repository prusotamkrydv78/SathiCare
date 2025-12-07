import React from 'react';
import { motion } from 'framer-motion';

const SignupNavigationButtons = ({ currentTab, tabs, loading, handlePrevious, handleNext }) => {
    return (
        <div className="flex gap-4 pt-4">
            {currentTab > 0 && (
                <motion.button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    Previous
                </motion.button>
            )}
            {currentTab < tabs.length - 1 ? (
                <motion.button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    Next
                </motion.button>
            ) : (
                <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
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
                            Creating account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </motion.button>
            )}
        </div>
    );
};

export default SignupNavigationButtons;
