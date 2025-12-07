import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HealthDetails = () => {
    const [isPregnant, setIsPregnant] = useState(false);
    const [formData, setFormData] = useState({
        lastPeriodDate: '',
        medicalConditions: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 font-sans text-text-dark py-10">

            {/* Progress Header */}
            <div className="w-full max-w-[500px] flex justify-between items-center mb-8 relative">
                {/* Progress Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                {/* Progress Line Active (Full) */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-primary-pink -z-10 transform -translate-y-1/2"></div>

                {/* Step 1: Account */}
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold mb-1">1</div>
                    <span className="text-xs font-medium text-gray-400">Account</span>
                </div>

                {/* Step 2: Profile */}
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold mb-1">2</div>
                    <span className="text-xs font-medium text-gray-400 border-b-2 border-primary-pink pb-0.5">Profile</span>
                </div>

                {/* Step 3: Health (Active) */}
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-pink text-white flex items-center justify-center text-sm font-bold mb-1 ring-4 ring-pink-100">3</div>
                    <span className="text-xs font-bold text-primary-pink">Health</span>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white w-full max-w-[500px] p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Health Details</h1>
                    <p className="text-sm text-gray-500">Tell us a bit more about your health.</p>
                </div>

                <div className="space-y-6">
                    {/* Pregnant Toggle */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <span className="font-medium text-gray-700">Are you pregnant?</span>
                        <button
                            onClick={() => setIsPregnant(!isPregnant)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPregnant ? 'bg-primary-pink' : 'bg-gray-300'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPregnant ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>

                    {/* Last Period Date */}
                    {!isPregnant && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Period Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="lastPeriodDate"
                                    value={formData.lastPeriodDate}
                                    onChange={handleChange}
                                    className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition"
                                />
                            </div>
                        </div>
                    )}

                    {/* Medical Conditions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions (Optional)</label>
                        <input
                            type="text"
                            name="medicalConditions"
                            value={formData.medicalConditions}
                            onChange={handleChange}
                            placeholder="e.g., PCOS, Endometriosis"
                            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition"
                        />
                    </div>

                    {/* Primary Button */}
                    <Link
                        to="/dashboard"
                        className="block w-full h-12 bg-primary-pink text-white font-bold rounded-lg hover:bg-pink-600 transition shadow-md flex items-center justify-center"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-center text-sm mt-8">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/login" className="text-primary-pink font-bold hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HealthDetails;
