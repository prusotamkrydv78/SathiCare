import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupTab3 = ({ formData, handleChange }) => {
    return (
        <motion.div
            key="tab-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
        >
            {/* Language Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Language
                </label>
                <motion.select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200"
                    whileFocus={{ scale: 1.01 }}
                >
                    <option value="english">English</option>
                    <option value="nepali">नेपाली (Nepali)</option>
                    <option value="hindi">हिन्दी (Hindi)</option>
                    <option value="maithili">मैथिली (Maithili)</option>
                </motion.select>
                <p className="mt-2 text-xs text-gray-500">Choose your preferred language for the app</p>
            </motion.div>

            {/* City Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City (Optional)
                </label>
                <motion.input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Kathmandu"
                    whileFocus={{ scale: 1.01 }}
                />
                <p className="mt-2 text-xs text-gray-500">Helps us find nearby healthcare facilities</p>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div
                className="flex items-start gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
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
            </motion.div>

            {/* Success Message */}
            <motion.div
                className="p-4 bg-green-50 border border-green-200 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <div className="flex gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-green-700">
                        <p className="font-semibold mb-1">Almost done!</p>
                        <p>Click "Create Account" to start your health journey.</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SignupTab3;
