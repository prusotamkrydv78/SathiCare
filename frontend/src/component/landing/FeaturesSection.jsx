import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
    const features = [
        {
            icon: '📅',
            title: 'Period Tracker',
            description: 'AI-powered cycle tracking with accurate predictions and personalized insights',
            color: 'pink',
            link: '/features'
        },
        {
            icon: '🤰',
            title: 'Pregnancy Companion',
            description: 'Week-by-week guidance, health tracking, and AI support throughout your journey',
            color: 'purple',
            link: '/features'
        },
        {
            icon: '👩‍⚕️',
            title: 'Find Doctors',
            description: 'Connect with trusted gynecologists and health experts near you',
            color: 'blue',
            link: '/features'
        }
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        Everything You Need for Your Health
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Comprehensive tools and features designed specifically for women's health needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group p-8 bg-gradient-to-br from-${feature.color}-50 to-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-${feature.color}-100`}
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                {feature.description}
                            </p>
                            <Link
                                to={feature.link}
                                className={`text-${feature.color}-600 font-semibold hover:underline inline-flex items-center gap-2`}
                            >
                                Learn more →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
