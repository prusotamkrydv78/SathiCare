import React from 'react';

const StatsSection = () => {
    const stats = [
        { number: '10,000+', label: 'Active Users', icon: '👥' },
        { number: '50,000+', label: 'Cycles Tracked', icon: '📊' },
        { number: '5,000+', label: 'Doctor Consultations', icon: '👩‍⚕️' },
        { number: '98%', label: 'Satisfaction Rate', icon: '⭐' }
    ];

    return (
        <section className="py-16 px-6 bg-gradient-to-r from-pink-600 to-purple-600">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center text-white">
                            <div className="text-5xl mb-3">{stat.icon}</div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                            <div className="text-pink-100 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
