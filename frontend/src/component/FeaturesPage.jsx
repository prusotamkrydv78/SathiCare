import React from 'react';
import { Link } from 'react-router-dom';
import { FadeInUp, HoverScale, StaggerContainer, StaggerItem } from './animations/ScrollAnimations';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
    const detailedFeatures = [
        {
            title: "Period Tracker with AI Insights",
            icon: "🌸",
            color: "pink",
            workflow: [
                "User Logs Data (Cycle, Symptoms, Mood)",
                "Database Saves Securely with Encryption",
                "AI Analyzes Trends & Predicts Next Phase",
                "System Triggers Personalized Alerts & Reminders",
                "User Sees Smart Calendar with Daily Tips",
                "Option to Consult Doctor if Issues Detected"
            ],
            link: "/signup",
            btnText: "Start Tracking",
            benefits: [
                "Accurate cycle predictions",
                "Symptom pattern recognition",
                "Personalized health insights",
                "Early warning system"
            ]
        },
        {
            title: "Pregnancy Companion with AI Support",
            icon: "🤰",
            color: "purple",
            workflow: [
                "User Enters Pregnancy Week & Health Info",
                "AI Analyzes Development Weekly",
                "App Provides Tailored Safety Tips & Alerts",
                "User Tracks Week-by-Week Baby Progress",
                "AI Answers Maternal Health Queries Instantly",
                "Contraction Timer & Hospital Bag Checklist"
            ],
            link: "/signup",
            btnText: "Start Journey",
            benefits: [
                "Week-by-week guidance",
                "AI-powered health tips",
                "Contraction tracking",
                "Appointment reminders"
            ]
        },
        {
            title: "Find Healthcare Services",
            icon: "🏥",
            color: "blue",
            workflow: [
                "App Detects User Location Automatically",
                "Fetches Nearby Hospitals, Clinics, Pharmacies",
                "User Filters by Specialty or Rating",
                "View Interactive Map & Facility List",
                "Click for Details / One-Tap Call / Directions",
                "Book Appointments Directly Through App"
            ],
            link: "/signup",
            btnText: "Find Facilities",
            benefits: [
                "Location-based search",
                "Verified facilities",
                "Real-time availability",
                "Direct booking"
            ]
        },
        {
            title: "AI Health Assistant + Doctor Consultations",
            icon: "🤖",
            color: "indigo",
            workflow: [
                "User Chooses: Ask AI or Book Doctor",
                "AI Analyzes Symptoms & Advises Immediately",
                "OR Doctor Provides Professional Consultation",
                "User Receives Actionable Guidance",
                "AI Logs Data for Future Personalization",
                "Chat History Saved for Reference"
            ],
            link: "/signup",
            btnText: "Ask AI Now",
            benefits: [
                "24/7 AI availability",
                "Expert doctor network",
                "Instant responses",
                "Personalized advice"
            ]
        },
        {
            title: "Emergency SOS",
            icon: "🆘",
            color: "red",
            workflow: [
                "User Presses Big SOS Button",
                "App Sends Immediate Location + SMS Alerts",
                "Nearby Hospitals & Emergency Contacts Notified",
                "AI Provides Real-Time First-Aid Tips",
                "Voice Call Feature Connects to Ambulance (102)",
                "Alert History Tracked for Safety"
            ],
            link: "/signup",
            btnText: "Learn More",
            benefits: [
                "One-tap emergency alert",
                "GPS location sharing",
                "SMS to contacts",
                "First-aid guidance"
            ]
        },
        {
            title: "Health Library & Education",
            icon: "📚",
            color: "green",
            workflow: [
                "User Opens Health Library",
                "App Fetches Curated, Verified Content",
                "AI Recommends Personalized Articles",
                "User Reads & Interacts (Saves/Likes)",
                "Optional AI Q&A for Specific Topics",
                "Content Available in Nepali & English"
            ],
            link: "/signup",
            btnText: "Browse Library",
            benefits: [
                "Expert-verified content",
                "Bilingual support",
                "Personalized recommendations",
                "Bookmark favorites"
            ]
        }
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
                            Powerful Features for Your Health
                        </motion.h1>
                        <motion.p
                            className="text-xl opacity-90 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Explore comprehensive tools designed specifically for women's health needs in Nepal
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <HoverScale scale={1.1}>
                                <Link
                                    to="/signup"
                                    className="inline-block px-8 py-4 bg-white text-primary-pink rounded-xl font-bold shadow-xl hover:shadow-2xl transition-shadow duration-200"
                                >
                                    Get Started Free
                                </Link>
                            </HoverScale>
                        </motion.div>
                    </div>
                </div>
            </FadeInUp>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
                {detailedFeatures.map((feature, index) => (
                    <FadeInUp delay={index * 0.1} key={index}>
                        <HoverScale scale={1.01}>
                            <div
                                className={`bg-white rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-l-8 border-${feature.color}-500`}
                            >
                                <div className="flex flex-col lg:flex-row gap-8">

                                    {/* Left Side - Icon, Title, Benefits */}
                                    <motion.div
                                        className="lg:w-2/5 flex flex-col"
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <motion.div
                                            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl bg-${feature.color}-50 mb-6 shadow-lg`}
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <h3 className="text-3xl font-bold text-gray-800 mb-6">{feature.title}</h3>

                                        {/* Benefits */}
                                        <div className="mb-6">
                                            <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Key Benefits</h4>
                                            <StaggerContainer staggerDelay={0.1}>
                                                <ul className="space-y-2">
                                                    {feature.benefits.map((benefit, i) => (
                                                        <StaggerItem key={i}>
                                                            <li className="flex items-center gap-2 text-gray-600">
                                                                <motion.svg
                                                                    className="w-5 h-5 text-green-500 flex-shrink-0"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    initial={{ scale: 0 }}
                                                                    whileInView={{ scale: 1 }}
                                                                    viewport={{ once: true }}
                                                                    transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                                                                >
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </motion.svg>
                                                                <span className="text-sm">{benefit}</span>
                                                            </li>
                                                        </StaggerItem>
                                                    ))}
                                                </ul>
                                            </StaggerContainer>
                                        </div>

                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link
                                                to={feature.link}
                                                className={`mt-auto px-6 py-3 rounded-xl font-bold text-white text-center bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 hover:shadow-lg transition-shadow duration-200 block`}
                                            >
                                                {feature.btnText} →
                                            </Link>
                                        </motion.div>
                                    </motion.div>

                                    {/* Right Side - Workflow Steps */}
                                    <motion.div
                                        className="lg:w-3/5 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-8 pt-6 lg:pt-0"
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                        <h4 className="font-bold text-gray-700 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                            How It Works
                                        </h4>
                                        <StaggerContainer staggerDelay={0.1}>
                                            <ul className="space-y-4">
                                                {feature.workflow.map((step, i) => (
                                                    <StaggerItem key={i}>
                                                        <motion.li
                                                            className="flex gap-4 group"
                                                            whileHover={{ x: 5 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <motion.div
                                                                className={`mt-1 w-8 h-8 rounded-full bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md`}
                                                                whileHover={{ scale: 1.2, rotate: 360 }}
                                                                transition={{ duration: 0.4 }}
                                                            >
                                                                {i + 1}
                                                            </motion.div>
                                                            <span className="leading-relaxed text-gray-700 pt-1">{step}</span>
                                                        </motion.li>
                                                    </StaggerItem>
                                                ))}
                                            </ul>
                                        </StaggerContainer>
                                    </motion.div>

                                </div>
                            </div>
                        </HoverScale>
                    </FadeInUp>
                ))}
            </div>

            {/* Bottom CTA */}
            <FadeInUp delay={0.2}>
                <div className="max-w-4xl mx-auto px-6 mt-16">
                    <motion.div
                        className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h3>
                        <p className="text-xl opacity-90 mb-8">Join thousands of women who trust SaathiCare</p>
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
                        <p className="mt-6 text-sm opacity-75">No credit card required • Free forever</p>
                    </motion.div>
                </div>
            </FadeInUp>

        </div>
    );
};

export default FeaturesPage;
