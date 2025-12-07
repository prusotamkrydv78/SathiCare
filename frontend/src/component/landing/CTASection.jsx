import React from 'react';
import { Link } from 'react-router-dom';
import { ScaleIn, HoverScale } from '../animations/ScrollAnimations';
import { motion } from 'framer-motion';

const CTASection = () => {
    return (
        <section className="py-20 px-6">
            <ScaleIn>
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    {/* Decorative Elements */}
                    <motion.div
                        className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        style={{ translateX: '50%', translateY: '-50%' }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full"
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        style={{ translateX: '-50%', translateY: '50%' }}
                    />

                    <div className="relative z-10">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            Ready to Take Control of Your Health?
                        </motion.h2>
                        <motion.p
                            className="text-xl mb-8 opacity-90"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Join thousands of women who trust SaathiCare for their health journey
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <HoverScale scale={1.1}>
                                <Link
                                    to="/signup"
                                    className="inline-block px-10 py-4 bg-white text-primary-pink rounded-xl font-bold shadow-xl hover:shadow-2xl transition-shadow duration-200"
                                >
                                    Get Started Free
                                </Link>
                            </HoverScale>
                        </motion.div>
                        <motion.p
                            className="mt-6 text-sm opacity-75"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.75 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            No credit card required • Free forever • 2 minute setup
                        </motion.p>
                    </div>
                </div>
            </ScaleIn>
        </section>
    );
};

export default CTASection;
