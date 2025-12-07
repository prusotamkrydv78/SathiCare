import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SignupTab2 = ({ formData, errors, handleChange }) => {
    return (
        <motion.div
            key="tab-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
        >
            {/* Phone Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <motion.input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        } focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200`}
                    placeholder="9800000000"
                    whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                    {errors.phone && (
                        <motion.p
                            className="mt-2 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.phone}
                        </motion.p>
                    )}
                </AnimatePresence>
                <p className="mt-2 text-xs text-gray-500">Used for emergency alerts and notifications</p>
            </motion.div>

            {/* Age Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                    Age (Optional)
                </label>
                <motion.input
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
                    whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                    {errors.age && (
                        <motion.p
                            className="mt-2 text-sm text-red-600 flex items-center gap-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.age}
                        </motion.p>
                    )}
                </AnimatePresence>
                <p className="mt-2 text-xs text-gray-500">Helps us provide age-appropriate health insights</p>
            </motion.div>

            {/* Info Box */}
            <motion.div
                className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">Your privacy matters</p>
                        <p>Your contact information is encrypted and never shared with third parties.</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SignupTab2;
