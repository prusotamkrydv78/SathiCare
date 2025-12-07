import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
        fullName: '',
        dob: '',
        language: 'Nepali',
        isPregnant: false,
        lastPeriodDate: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 font-sans text-text-dark">
            <div className="bg-white w-full max-w-[500px] p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">

                {/* Progress Indicator */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
                    <div className={`absolute top-1/2 left-0 h-1 bg-primary-pink -z-10 transition-all duration-300`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary-pink text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-center mb-6">
                    {step === 1 ? 'Create Account' : step === 2 ? 'Personal Details' : 'Health Profile'}
                </h2>

                {/* Step 1: Phone & OTP */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                            <div className="flex">
                                <select className="h-11 border border-gray-300 rounded-l-lg px-3 bg-gray-50 text-gray-700 focus:outline-none focus:border-primary-pink">
                                    <option>+977</option>
                                </select>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="9800000000"
                                    className="h-11 w-full border border-l-0 border-gray-300 rounded-r-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition"
                                />
                            </div>
                        </div>
                        {formData.phone.length >= 10 && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">OTP Code</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit OTP"
                                    className="h-11 w-full border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition"
                                />
                                <p className="text-xs text-gray-500 mt-2">OTP sent to your mobile number.</p>
                            </div>
                        )}
                        <button
                            onClick={nextStep}
                            disabled={!formData.phone || (formData.phone.length >= 10 && !formData.otp)}
                            className="w-full h-12 bg-primary-pink text-white font-bold rounded-lg hover:bg-pink-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Verify & Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Personal Details */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="h-11 w-full border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="h-11 w-full border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Language Preference</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="h-11 w-full border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition bg-white"
                            >
                                <option value="Nepali">Nepali</option>
                                <option value="English">English</option>
                                <option value="Maithili">Maithili</option>
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={prevStep}
                                className="w-1/3 h-12 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={!formData.fullName || !formData.dob}
                                className="w-2/3 h-12 bg-primary-pink text-white font-bold rounded-lg hover:bg-pink-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Health Profile */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <span className="font-medium text-gray-700">Are you currently pregnant?</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isPregnant"
                                    checked={formData.isPregnant}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-pink"></div>
                            </label>
                        </div>

                        {!formData.isPregnant && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Last Period Date</label>
                                <input
                                    type="date"
                                    name="lastPeriodDate"
                                    value={formData.lastPeriodDate}
                                    onChange={handleChange}
                                    className="h-11 w-full border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition"
                                />
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                onClick={prevStep}
                                className="w-1/3 h-12 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                            <Link
                                to="/dashboard"
                                className="w-2/3 h-12 bg-primary-pink text-white font-bold rounded-lg hover:bg-pink-600 transition shadow-md flex items-center justify-center"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}

                {/* Login Link */}
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

export default SignupPage;
