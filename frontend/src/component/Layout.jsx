import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "bg-pink-50 text-primary-pink border-r-4 border-primary-pink" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800";
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/track', label: 'Period Tracker', icon: '📊' },
        { path: '/pregnancy-tracker', label: 'Pregnancy', icon: '🤰' },
        { path: '/symptom-checker', label: 'Symptom Checker', icon: '🩺' },
        { path: '/features', label: 'All Features', icon: '🧩' },
        { path: '/appointments', label: 'Appointments', icon: '📅' },
        { path: '/consultations', label: 'Find Doctors', icon: '👩‍⚕️' },
        { path: '/forum', label: 'Community', icon: '💬' },
        { path: '/records', label: 'Health Records', icon: '📂' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/profile-settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="flex min-h-screen bg-[#F3F4F6] font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-30">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-pink rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Saathi</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-3 transition-colors duration-200 ${isActive(item.path)}`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-pink-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center text-2xl mb-2 shadow-sm">🆘</div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">Emergency?</h4>
                        <Link to="/emergency" className="text-xs text-primary-pink font-bold hover:underline">Get Help Now</Link>
                    </div>
                </div>

                <div className="p-4">
                    <Link to="/" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-500 transition text-sm font-medium">
                        <span>🚪</span>
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
