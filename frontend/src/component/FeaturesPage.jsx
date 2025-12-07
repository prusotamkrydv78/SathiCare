import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
    const features = [
        {
            title: 'Facility Finder',
            description: 'Locate hospitals, clinics, and pharmacies near you with our interactive map.',
            icon: '🏥',
            link: '/find-facility',
            color: 'bg-blue-50 text-blue-600 border-blue-100'
        },
        {
            title: 'AI Health Assistant',
            description: 'Get instant answers to your health questions from our smart AI companion.',
            icon: '🤖',
            link: '/ai-chat',
            color: 'bg-purple-50 text-purple-600 border-purple-100'
        },
        {
            title: 'Period Tracker',
            description: 'Track your menstrual cycle, predict ovulation, and monitor symptoms.',
            icon: '📅',
            link: '/track',
            color: 'bg-pink-50 text-primary-pink border-pink-100'
        },
        {
            title: 'Content Library',
            description: 'Access a curated collection of articles, videos, and guides on women\'s health.',
            icon: '📚',
            link: '/library',
            color: 'bg-green-50 text-green-600 border-green-100'
        },
        {
            title: 'Health Records',
            description: 'Securely store and manage your prescriptions, lab reports, and X-rays.',
            icon: '📂',
            link: '/records',
            color: 'bg-orange-50 text-orange-600 border-orange-100'
        },
        {
            title: 'Appointments',
            description: 'Schedule and manage your doctor visits and health checkups.',
            icon: '⏰',
            link: '/appointments',
            color: 'bg-teal-50 text-teal-600 border-teal-100'
        },
        {
            title: 'Emergency SOS',
            description: 'Quick access to ambulance and emergency contacts in critical situations.',
            icon: '🆘',
            link: '/emergency',
            color: 'bg-red-50 text-red-600 border-red-100'
        },
        {
            title: 'Profile & Settings',
            description: 'Manage your personal information, preferences, and account security.',
            icon: '⚙️',
            link: '/profile-settings',
            color: 'bg-gray-50 text-gray-600 border-gray-100'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24">

            {/* Header */}
            <div className="bg-white p-6 sticky top-0 z-20 shadow-sm border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-gray-500 hover:text-gray-700 transition">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">Explore Sathi</h1>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-primary-pink/10 p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">All Your Health Needs</h2>
                <p className="text-gray-600 max-w-xs mx-auto">Discover the powerful tools we've built to support your health journey.</p>
            </div>

            {/* Features Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 -mt-6">
                {features.map((feature, index) => (
                    <Link
                        to={feature.link}
                        key={index}
                        className={`p-5 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 flex items-start gap-4 bg-white ${feature.color.split(' ')[2]}`} // using border color class
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${feature.color.split(' ').slice(0, 2).join(' ')}`}>
                            {feature.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer CTA */}
            <div className="text-center mt-8 px-6">
                <p className="text-gray-400 text-sm">More features coming soon!</p>
            </div>

        </div>
    );
};

export default FeaturesPage;
