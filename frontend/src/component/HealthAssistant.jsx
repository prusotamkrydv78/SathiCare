import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Stethoscope, ArrowRight, Sparkles, Calendar } from 'lucide-react';

const HealthAssistant = () => {
    const navigate = useNavigate();

    const options = [
        {
            id: 'ai',
            title: 'AI Health Assistant',
            subtitle: 'Instant AI-powered guidance',
            description: 'Get immediate answers to your health questions with our intelligent AI assistant powered by advanced medical knowledge.',
            icon: Bot,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
            route: '/ai-chat',
            features: [
                '24/7 Availability',
                'Instant Responses',
                'Personalized Advice',
                'Symptom Analysis'
            ],
            emoji: '🤖'
        },
        {
            id: 'doctor',
            title: 'Doctor Consultation',
            subtitle: 'Connect with real doctors',
            description: 'Book appointments with certified gynecologists, obstetricians, and fertility specialists for professional medical care.',
            icon: Stethoscope,
            gradient: 'from-blue-500 to-teal-500',
            bgGradient: 'from-blue-50 to-teal-50',
            route: '/consultations',
            features: [
                'Certified Doctors',
                'Video Consultations',
                'Prescription Support',
                'Follow-up Care'
            ],
            emoji: '👩‍⚕️'
        }
    ];

    return (
        <div className="font-sans text-gray-800 pb-12">
            {/* Header */}
            <motion.header
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition text-sm">
                        Dashboard
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-600 font-medium text-sm">Health Assistant</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Assistant</h1>
                <p className="text-gray-500">Choose how you'd like to get health guidance today</p>
            </motion.header>

            {/* Info Banner */}
            <motion.div
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Your Health, Your Choice</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Whether you need quick AI-powered answers or want to consult with a certified doctor,
                            we've got you covered. Choose the option that best fits your needs.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {options.map((option, index) => {
                    const Icon = option.icon;
                    return (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="group"
                        >
                            <div className={`bg-gradient-to-br ${option.bgGradient} rounded-3xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}>
                                {/* Icon & Title */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{option.title}</h2>
                                            <p className="text-sm text-gray-500">{option.subtitle}</p>
                                        </div>
                                    </div>
                                    <span className="text-4xl">{option.emoji}</span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {option.description}
                                </p>

                                {/* Features */}
                                <div className="mb-6 flex-1">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        Key Features
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {option.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 text-sm text-gray-700"
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.gradient}`}></div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link to={option.route}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full py-4 bg-gradient-to-r ${option.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group`}
                                    >
                                        <span>Get Started</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Info */}
            <motion.div
                className="mt-8 bg-white rounded-2xl p-6 border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-1">Need Both?</h4>
                        <p className="text-sm text-gray-600">
                            You can use both services! Start with AI for quick answers, then book a doctor consultation
                            if you need professional medical advice. Your health data is shared across both for personalized care.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HealthAssistant;
