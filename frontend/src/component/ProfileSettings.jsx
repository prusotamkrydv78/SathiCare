import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfileSettings = () => {
    // Mock User Data
    const [user, setUser] = useState({
        name: 'Sita Sharma',
        email: 'sita.sharma@example.com',
        phone: '+977 9800000000',
        location: 'Kathmandu, Nepal',
        dob: '1995-08-15',
        bloodType: 'O+',
        language: 'English',
        notifications: true,
        darkMode: false,
        anonymousMode: false
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleToggle = (field) => {
        setUser(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-text-dark pb-32">
            {/* Header / Profile Photo */}
            <div className="bg-white p-6 pb-10 rounded-b-[40px] shadow-sm text-center relative z-10 border-b border-gray-50">
                <div className="absolute top-4 left-4">
                    <Link to="/dashboard" className="text-gray-500 hover:text-gray-800 transition">← Back</Link>
                </div>

                <div className="relative inline-block mt-4 mb-4">
                    <div className="w-32 h-32 rounded-full p-1 border-4 border-white shadow-lg bg-gray-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition">
                        📷
                    </button>
                    <div className="absolute inset-0 rounded-full bg-black/10 hover:bg-black/20 transition cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="text-white font-bold text-xs bg-black/50 px-2 py-1 rounded">Change</span>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            <div className="px-4 -mt-6 relative z-20 space-y-6 max-w-2xl mx-auto">

                {/* Personal Information */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
                        <h2 className="font-bold text-gray-800 text-lg">Personal Information</h2>
                        <button className="text-gray-400 hover:text-primary-pink">✎</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Full Name</span>
                            <span className="font-medium text-gray-700">{user.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Date of Birth</span>
                            <span className="font-medium text-gray-700">{user.dob}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Phone</span>
                            <span className="font-medium text-gray-700">{user.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Blood Type</span>
                            <span className="font-medium text-gray-700">{user.bloodType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Location</span>
                            <span className="font-medium text-gray-700">{user.location}</span>
                        </div>
                    </div>
                </div>

                {/* Health Profile */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
                        <h2 className="font-bold text-gray-800 text-lg">Health Profile</h2>
                        <button className="text-gray-400 hover:text-primary-pink">✎</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Pregnancy Status</span>
                            <span className="bg-pink-100 text-primary-pink text-xs font-bold px-3 py-1 rounded-full">Not Pregnant</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Last Period</span>
                            <span className="font-medium text-gray-700">Oct 24, 2025</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Average Cycle</span>
                            <span className="font-medium text-gray-700">28 Days</span>
                        </div>
                    </div>
                </div>

                {/* Account & Security */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-800 text-lg mb-4 border-b border-gray-50 pb-2">Account & Settings</h2>

                    <div className="space-y-5">
                        {/* Toggle Row */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                                <p className="text-xs text-gray-400">Receive health tips and reminders</p>
                            </div>
                            <button
                                onClick={() => handleToggle('notifications')}
                                className={`w-12 h-6 rounded-full p-1 transition duration-300 ${user.notifications ? 'bg-primary-pink' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition duration-300 ${user.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        {/* Toggle Row */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Dark Mode</h3>
                                <p className="text-xs text-gray-400">Reduce eye strain at night</p>
                            </div>
                            <button
                                onClick={() => handleToggle('darkMode')}
                                className={`w-12 h-6 rounded-full p-1 transition duration-300 ${user.darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition duration-300 ${user.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        {/* Link Row */}
                        <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition">
                            <span className="text-sm font-medium text-gray-700">Change Password</span>
                            <span className="text-gray-400">›</span>
                        </div>
                        <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition">
                            <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                            <span className="text-gray-400">›</span>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-2xl p-5 border border-red-100 bg-red-50/30">
                    <h2 className="font-bold text-red-600 text-lg mb-2">Danger Zone</h2>
                    <p className="text-xs text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <div className="flex gap-3">
                        <button className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold text-xs py-3 rounded-xl hover:bg-gray-50 transition">
                            Export Data
                        </button>
                        <button className="flex-1 bg-red-500 text-white font-bold text-xs py-3 rounded-xl hover:bg-red-600 shadow-sm transition">
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>

            {/* Save Button Sticky */}
            <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30">
                <button className="w-full bg-primary-pink text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 active:scale-[0.98] transition">
                    Save Changes
                </button>
            </div>

        </div>
    );
};

export default ProfileSettings;
