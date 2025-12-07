import React, { useState } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '../animations/ScrollAnimations';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'Is SaathiCare really free?',
            answer: 'Yes! All core features including period tracking, pregnancy companion, AI insights, and doctor consultations are completely free. We believe healthcare should be accessible to everyone.'
        },
        {
            question: 'Is my health data secure?',
            answer: 'Absolutely. We use bank-level encryption to protect your data. Your personal health information is never shared with third parties without your explicit consent.'
        },
        {
            question: 'Do I need medical knowledge to use this app?',
            answer: 'Not at all! SaathiCare is designed to be simple and intuitive. We provide easy-to-understand explanations and guidance for all features.'
        },
        {
            question: 'Can I use SaathiCare in Nepali?',
            answer: 'Yes! We support both English and Nepali languages. You can switch between languages in your profile settings.'
        },
        {
            question: 'How accurate are the AI predictions?',
            answer: 'Our AI analyzes your personal health data and patterns to provide predictions. Accuracy improves as you log more data. However, always consult a healthcare professional for medical decisions.'
        },
        {
            question: 'Can I connect with real doctors?',
            answer: 'Yes! You can browse verified gynecologists and health experts, check their availability, and book appointments directly through the app.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <FadeInUp>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600">
                            Everything you need to know about SaathiCare
                        </p>
                    </div>
                </FadeInUp>

                <StaggerContainer staggerDelay={0.1}>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <StaggerItem key={index}>
                                <motion.div
                                    className="border border-gray-200 rounded-2xl overflow-hidden hover:border-primary-pink transition-colors duration-200"
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-200"
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <span className="font-semibold text-gray-800 pr-8">{faq.question}</span>
                                        <motion.svg
                                            className="w-6 h-6 text-primary-pink flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </motion.svg>
                                    </motion.button>
                                    <AnimatePresence initial={false}>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>

                <FadeInUp delay={0.6}>
                    <div className="mt-12 text-center p-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Still have questions?</h3>
                        <p className="text-gray-600 mb-4">We're here to help! Reach out to our support team.</p>
                        <motion.a
                            href="mailto:support@saathicare.com"
                            className="inline-flex items-center gap-2 text-primary-pink font-semibold hover:underline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Support
                        </motion.a>
                    </div>
                </FadeInUp>
            </div>
        </section>
    );
};

export default FAQSection;
