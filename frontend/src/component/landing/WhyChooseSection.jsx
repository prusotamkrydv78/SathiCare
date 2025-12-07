import React from 'react';

const WhyChooseSection = () => {
    const reasons = [
        {
            icon: '🔒',
            title: 'Privacy First',
            description: 'Your health data is encrypted and secure. We never share your personal information.',
            color: 'blue'
        },
        {
            icon: '🤖',
            title: 'AI-Powered Insights',
            description: 'Advanced AI analyzes your data to provide personalized predictions and recommendations.',
            color: 'purple'
        },
        {
            icon: '🇳🇵',
            title: 'Made for Nepal',
            description: 'Culturally sensitive, localized content in Nepali and English for women across Nepal.',
            color: 'green'
        },
        {
            icon: '👩‍⚕️',
            title: 'Expert Verified',
            description: 'All health information is reviewed and verified by certified medical professionals.',
            color: 'pink'
        },
        {
            icon: '📱',
            title: 'Easy to Use',
            description: 'Simple, intuitive interface designed for women of all ages and tech backgrounds.',
            color: 'indigo'
        },
        {
            icon: '🆓',
            title: 'Completely Free',
            description: 'All core features are free forever. No hidden costs or premium subscriptions.',
            color: 'teal'
        }
    ];

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        Why Choose SaathiCare?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We're committed to providing the best health companion for women in Nepal
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                            <div className="text-5xl mb-4">{reason.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">{reason.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
