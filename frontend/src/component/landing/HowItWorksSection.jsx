import React from 'react';

const HowItWorksSection = () => {
    const steps = [
        {
            number: '01',
            title: 'Sign Up Free',
            description: 'Create your account in seconds. No credit card required.',
            icon: '✍️'
        },
        {
            number: '02',
            title: 'Complete Your Profile',
            description: 'Add your health information for personalized recommendations.',
            icon: '👤'
        },
        {
            number: '03',
            title: 'Start Tracking',
            description: 'Log your cycles, symptoms, and health data effortlessly.',
            icon: '📱'
        },
        {
            number: '04',
            title: 'Get AI Insights',
            description: 'Receive personalized predictions and health tips powered by AI.',
            icon: '🤖'
        }
    ];

    return (
        <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        How It Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Get started with SaathiCare in just 4 simple steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-pink-300 to-purple-300 -translate-x-1/2 z-0"></div>
                            )}

                            <div className="relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
                                    {step.icon}
                                </div>
                                <div className="text-center mb-4">
                                    <span className="text-6xl font-bold text-gray-100">{step.number}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">{step.title}</h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
