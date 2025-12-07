import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState('All');

    // Mock Data
    const notifications = [
        { id: 1, type: 'alert', title: 'Period Starting Soon', message: 'Your period is predicted to start in 2 days.', time: '2 hours ago', read: false },
        { id: 2, type: 'reminder', title: 'Drink Water', message: 'Time to hydrate! Drink a glass of water.', time: '4 hours ago', read: true },
        { id: 3, type: 'consultation', title: 'Appointment Confirmed', message: 'Your appointment with Dr. Anjali is confirmed for Oct 24.', time: '1 day ago', read: true },
        { id: 4, type: 'community', title: 'New Reply', message: 'Someone replied to your post "Anxiety about labor".', time: '1 day ago', read: false },
        { id: 5, type: 'alert', title: 'Take Vitamin', message: 'Don\'t forget your prenatal vitamins today.', time: 'Yesterday', read: true },
    ];

    const filterOptions = ['All', 'Unread', 'Alerts'];

    const getFilteredNotifications = () => {
        if (activeTab === 'Unread') return notifications.filter(n => !n.read);
        if (activeTab === 'Alerts') return notifications.filter(n => n.type === 'alert');
        return notifications;
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return '⚠️';
            case 'reminder': return '💧';
            case 'consultation': return '📅';
            case 'community': return '💬';
            default: return '🔔';
        }
    };

    return (
        <div className="font-sans text-gray-800 pb-12 max-w-4xl mx-auto">

            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition">Dashboard</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-600 font-medium">Notifications</span>
                    </div>
                    <h1 className="text-2xl font-bold">Alerts & Reminders</h1>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    {filterOptions.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${activeTab === tab ? 'bg-primary-pink text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                {getFilteredNotifications().length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {getFilteredNotifications().map(notif => (
                            <div key={notif.id} className={`p-6 flex gap-4 hover:bg-gray-50 transition ${!notif.read ? 'bg-pink-50/30' : ''}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${!notif.read ? 'bg-pink-100' : 'bg-gray-100'}`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {notif.title}
                                            {!notif.read && <span className="ml-2 w-2 h-2 bg-pink-500 rounded-full inline-block"></span>}
                                        </h3>
                                        <span className="text-xs text-gray-400">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed">{notif.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                        <span className="text-4xl mb-4">🔕</span>
                        <p>No notifications found.</p>
                    </div>
                )}
            </div>

            {/* Settings Link */}
            <div className="mt-6 text-center">
                <Link to="/profile-settings" className="text-primary-pink font-bold text-sm hover:underline">
                    Manage Notification Preferences
                </Link>
            </div>
        </div>
    );
};

export default NotificationsPage;
