import React from 'react';
import { Link } from 'react-router-dom';
import { FadeInUp, FadeInLeft, FadeInRight, ScaleIn, StaggerContainer, StaggerItem } from './animations/ScrollAnimations';
import { motion } from 'framer-motion';

const AboutPage = () => {
    const values = [
        {
            icon: '🔒',
            title: 'Privacy First',
            description: 'Your health data is sacred. We use bank-level encryption and never share your information without consent.',
            color: 'blue'
        },
        {
            icon: '💝',
            title: 'Women-Centric',
            description: 'Every feature is designed specifically for women\'s health needs, by women who understand the journey.',
            color: 'pink'
        },
        {
            icon: '🌍',
            title: 'Accessibility',
            description: 'Healthcare should be available to everyone, everywhere. That\'s why SaathiCare is completely free.',
            color: 'green'
        }
    ];

    const challenges = [
        'Limited access to gynecologists in rural areas',
        'Lack of reliable health information in local languages',
        'Cultural barriers in discussing women\'s health',
        'No centralized platform for health tracking',
        'Expensive healthcare consultations'
    ];

    const solutions = [
        'AI-powered health assistant available 24/7',
        'Verified content in Nepali and English',
        'Private, judgment-free digital platform',
        'All-in-one health companion app',
        'Completely free core features'
    ];

    const journey = [
        {
            year: '2023',
            title: 'The Idea',
            description: 'Recognized the gap in women\'s healthcare accessibility in Nepal',
            icon: '💡'
        },
        {
            year: '2024',
            title: 'Development',
            description: 'Built AI-powered features with input from healthcare professionals',
            icon: '🚀'
        },
        {
            year: '2024',
            title: 'Beta Launch',
            description: 'Launched beta version with 1,000 early adopters',
            icon: '🎉'
        },
        {
            year: '2025',
            title: 'Growing Strong',
            description: 'Now serving 10,000+ women across Nepal',
            icon: '🌟'
        }
    ];

    const features = [
        { icon: '📱', text: 'Period & Pregnancy Tracking' },
        { icon: '🤖', text: 'AI Health Assistant' },
        { icon: '👩‍⚕️', text: 'Doctor Consultations' },
        { icon: '🏥', text: 'Facility Finder' },
        { icon: '🆘', text: 'Emergency SOS' },
        { icon: '📚', text: 'Health Library' }
    ];

    const team = [
        { name: 'Development Team', icon: '💻', description: 'Building robust, secure features' },
        { name: 'Medical Advisors', icon: '👩‍⚕️', description: 'Ensuring accuracy and safety' },
        { name: 'AI Specialists', icon: '🤖', description: 'Creating intelligent predictions' },
        { name: 'Support Team', icon: '💬', description: 'Helping users 24/7' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans pb-24">

            {/* Hero Section */}
            <FadeInUp>
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-20 px-6 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1
                            className="text-4xl md:text-5xl font-bold mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Empowering Women's Health in Nepal
                        </motion.h1>
                        <motion.p
                            className="text-xl opacity-90"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Your trusted companion for comprehensive women's healthcare
                        </motion.p>
                    </div>
                </div>
            </FadeInUp>

            {/* Mission, Vision, Values */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <FadeInUp>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Our Mission & Values
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We're committed to making quality healthcare accessible to every woman in Nepal
                        </p>
                    </div>
                </FadeInUp>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {values.map((value, index) => (
                        <ScaleIn delay={index * 0.15} key={index}>
                            <motion.div
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 text-center h-full"
                                whileHover={{ y: -10 }}
                            >
                                <motion.div
                                    className="text-6xl mb-4"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {value.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </motion.div>
                        </ScaleIn>
                    ))}
                </div>
            </div>

            {/* The Challenge & Our Solution */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <FadeInUp>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                The Challenge & Our Solution
                            </h2>
                        </div>
                    </FadeInUp>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Challenges */}
                        <FadeInLeft delay={0.2}>
                            <motion.div
                                className="bg-red-50 p-8 rounded-2xl border-l-4 border-red-500"
                                whileHover={{ scale: 1.02 }}
                            >
                                <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
                                    <span>⚠️</span> The Challenges
                                </h3>
                                <StaggerContainer staggerDelay={0.1}>
                                    <ul className="space-y-3">
                                        {challenges.map((challenge, i) => (
                                            <StaggerItem key={i}>
                                                <motion.li
                                                    className="flex items-start gap-3 text-gray-700"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{challenge}</span>
                                                </motion.li>
                                            </StaggerItem>
                                        ))}
                                    </ul>
                                </StaggerContainer>
                            </motion.div>
                        </FadeInLeft>

                        {/* Solutions */}
                        <FadeInRight delay={0.2}>
                            <motion.div
                                className="bg-green-50 p-8 rounded-2xl border-l-4 border-green-500"
                                whileHover={{ scale: 1.02 }}
                            >
                                <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                                    <span>✅</span> Our Solutions
                                </h3>
                                <StaggerContainer staggerDelay={0.1}>
                                    <ul className="space-y-3">
                                        {solutions.map((solution, i) => (
                                            <StaggerItem key={i}>
                                                <motion.li
                                                    className="flex items-start gap-3 text-gray-700"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{solution}</span>
                                                </motion.li>
                                            </StaggerItem>
                                        ))}
                                    </ul>
                                </StaggerContainer>
                            </motion.div>
                        </FadeInRight>
                    </div>
                </div>
            </div>

            {/* Features Highlight */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <FadeInUp>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            What We Offer
                        </h2>
                    </div>
                </FadeInUp>

                <StaggerContainer staggerDelay={0.1}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <StaggerItem key={index}>
                                <ScaleIn delay={index * 0.05}>
                                    <motion.div
                                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center border border-gray-100"
                                        whileHover={{ y: -5, scale: 1.05 }}
                                    >
                                        <motion.div
                                            className="text-4xl mb-3"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <p className="font-semibold text-gray-700 text-sm">{feature.text}</p>
                                    </motion.div>
                                </ScaleIn>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            </div>

            {/* Journey Timeline */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <FadeInUp>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                Our Journey
                            </h2>
                            <p className="text-gray-600">
                                From idea to impact
                            </p>
                        </div>
                    </FadeInUp>

                    <div className="space-y-8">
                        {journey.map((milestone, index) => {
                            const AnimationComponent = index % 2 === 0 ? FadeInLeft : FadeInRight;

                            return (
                                <AnimationComponent delay={index * 0.15} key={index}>
                                    <motion.div
                                        className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                                        whileHover={{ scale: 1.02, x: index % 2 === 0 ? 10 : -10 }}
                                    >
                                        <motion.div
                                            className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-3xl shadow-lg flex-shrink-0"
                                            whileHover={{ rotate: 360, scale: 1.2 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            {milestone.icon}
                                        </motion.div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                                                    {milestone.year}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-800">{milestone.title}</h3>
                                            </div>
                                            <p className="text-gray-600">{milestone.description}</p>
                                        </div>
                                    </motion.div>
                                </AnimationComponent>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Team */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <FadeInUp>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Our Team
                        </h2>
                        <p className="text-gray-600">
                            Dedicated professionals working to serve you better
                        </p>
                    </div>
                </FadeInUp>

                <StaggerContainer staggerDelay={0.15}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <StaggerItem key={index}>
                                <ScaleIn delay={index * 0.1}>
                                    <motion.div
                                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all text-center border border-gray-100"
                                        whileHover={{ y: -10 }}
                                    >
                                        <motion.div
                                            className="text-5xl mb-4"
                                            whileHover={{ scale: 1.3, rotate: 15 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {member.icon}
                                        </motion.div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h3>
                                        <p className="text-sm text-gray-600">{member.description}</p>
                                    </motion.div>
                                </ScaleIn>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            </div>

            {/* CTA */}
            <FadeInUp delay={0.2}>
                <div className="max-w-4xl mx-auto px-6 mt-16">
                    <motion.div
                        className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full"
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            style={{ translateX: '50%', translateY: '-50%' }}
                        />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">Join Our Growing Community</h3>
                            <p className="text-xl opacity-90 mb-8">
                                Be part of the movement to empower women's health in Nepal
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/signup"
                                    className="inline-block px-10 py-4 bg-white text-primary-pink rounded-xl font-bold shadow-xl hover:shadow-2xl transition-shadow duration-200"
                                >
                                    Get Started Free
                                </Link>
                            </motion.div>
                            <p className="mt-6 text-sm opacity-75">Join 10,000+ women already using SaathiCare</p>
                        </div>
                    </motion.div>
                </div>
            </FadeInUp>

        </div>
    );
};

export default AboutPage;
