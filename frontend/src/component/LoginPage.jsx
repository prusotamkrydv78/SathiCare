import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 font-sans text-text-dark">
            <div className="bg-white w-full max-w-[400px] p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-primary-pink">Saathi</h1>
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-bold text-center mb-8">Welcome Back</h2>

                {/* Phone Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                    <div className="flex">
                        <select className="h-11 border border-gray-300 rounded-l-lg px-3 bg-gray-50 text-gray-700 focus:outline-none focus:border-primary-pink">
                            <option>+977</option>
                        </select>
                        <input
                            type="tel"
                            placeholder="9800000000"
                            className="h-11 w-full border border-l-0 border-gray-300 rounded-r-lg px-4 focus:outline-none focus:border-primary-pink focus:ring-1 focus:ring-primary-pink transition"
                        />
                    </div>
                </div>

                {/* Send OTP Button */}
                <button className="w-full h-12 bg-primary-pink text-white font-bold rounded-lg hover:bg-pink-600 transition shadow-md mb-6">
                    Send OTP
                </button>

                {/* Divider */}
                <div className="flex items-center mb-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="px-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Google Button */}
                <button className="w-full h-12 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center mb-8">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
                    Continue with Google
                </button>

                {/* Sign Up Link */}
                <div className="text-center text-sm">
                    <span className="text-gray-600">New user? </span>
                    <Link to="/signup" className="text-primary-pink font-bold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
            {/* Background Illustration Placeholder */}
            <div className="fixed bottom-0 right-0 p-10 opacity-10 pointer-events-none hidden md:block">
                <div className="text-9xl text-primary-pink">🌸</div>
            </div>
        </div>
    );
};

export default LoginPage;
