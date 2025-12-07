import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const team = [
        { name: 'Development Team', role: 'Full Stack Developers', icon: '👨‍💻' },
        { name: 'Medical Advisors', role: 'Healthcare Professionals', icon: '👩‍⚕️' },
        { name: 'AI Engineers', role: 'Machine Learning Experts', icon: '🤖' },
        { name: 'Design Team', role: 'UX/UI Designers', icon: '🎨' }
    ];

    const values = [
        {
            icon: '🎯',
            title: 'Our Mission',
            description: 'To empower every woman in Nepal with accessible, accurate, and personalized health information and care.'
        },
        {
            icon: '👁️',
            title: 'Our Vision',
            description: 'A Nepal where every woman has instant access to trusted health information, regardless of location or background.'
        },
        {
            icon: '💝',
            title: 'Our Values',
            description: 'Privacy, accuracy, accessibility, and cultural sensitivity guide everything we do.'
        }
    ];

    const milestones = [
        { year: '2024', event: 'SaathiCare Founded', description: 'Started with a vision to transform women\'s healthcare in Nepal' },
        { year: '2024', event: '1,000 Users', description: 'Reached our first thousand users within 3 months' },
        { year: '2024', event: 'AI Integration', description: 'Launched advanced AI-powered health insights' },
        { year: '2025', event: '10,000+ Users', description: 'Growing community of empowered women across Nepal' }
    ];

    const features = [
        { icon: '🔒', title: 'Privacy First', desc: 'Bank-level encryption for your data' },
        { icon: '🇳🇵', title: 'Made for Nepal', desc: 'Culturally sensitive & localized' },
        { icon: '🤖', title: 'AI-Powered', desc: 'Advanced machine learning insights' },
        { icon: '👩‍⚕️', title: 'Expert Verified', desc: 'Medical professionals review content' },
        { icon: '📱', title: 'Easy to Use', desc: 'Intuitive design for all ages' },
        { icon: '🆓', title: 'Free Forever', desc: 'No hidden costs or subscriptions' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans pb-24">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-20 px-6 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Empowering Women,
                        <br />
                        One Step at a Time
                    </h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        SaathiCare is more than just an app; it's a digital companion designed to bridge the gap in women's healthcare access in Nepal.
                    </p>
                </div>
            </div>

            {/* Mission, Vision, Values */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 text-center"
                        >
                            <div className="text-6xl mb-4">{value.icon}</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">{value.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why SaathiCare Section */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                            Why SaathiCare?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We understand the unique challenges women face in accessing healthcare
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-3xl shadow-sm">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">The Challenge</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1">❌</span>
                                    <span>Limited access to healthcare in rural areas</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1">❌</span>
                                    <span>Cultural barriers in discussing women's health</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1">❌</span>
                                    <span>Lack of personalized health information</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1">❌</span>
                                    <span>Difficulty finding trusted healthcare providers</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Solution</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Healthcare accessible from anywhere via mobile</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Private, safe space for health information</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>AI-powered personalized recommendations</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Verified network of healthcare professionals</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-2xl text-center hover:shadow-md transition-all duration-300"
                            >
                                <div className="text-4xl mb-2">{feature.icon}</div>
                                <h4 className="font-bold text-sm mb-1 text-gray-800">{feature.title}</h4>
                                <p className="text-xs text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Journey / Milestones */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        Our Journey
                    </h2>
                    <p className="text-gray-600">
                        Building a healthier future for women in Nepal
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-300 to-purple-300 hidden md:block"></div>

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className="md:w-1/2 text-center md:text-right">
                                    <div className={`inline-block bg-white p-6 rounded-3xl shadow-lg ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                                        <div className="text-4xl font-bold text-primary-pink mb-2">{milestone.year}</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.event}</h3>
                                        <p className="text-gray-600">{milestone.description}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                                <div className="md:w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-white py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                            Meet the Team
                        </h2>
                        <p className="text-gray-600">
                            Passionate professionals dedicated to women's health
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="text-center group"
                            >
                                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    {member.icon}
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">{member.name}</h4>
                                <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto px-6 mt-16">
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">Join Us on This Journey</h3>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Whether you are a user, a healthcare professional, or just someone who cares, there is a place for you in the SaathiCare community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="inline-block px-8 py-4 bg-white text-primary-pink rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                            >
                                Get Started Free
                            </Link>
                            <a
                                href="mailto:contact@saathicare.com"
                                className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all duration-200"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AboutPage;
