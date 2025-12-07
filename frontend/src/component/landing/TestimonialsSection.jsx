import React from 'react';
import { Link } from 'react-router-dom';
import { StaggerContainer, StaggerItem, FadeInUp } from '../animations/ScrollAnimations';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'Sita Sharma',
            location: 'Kathmandu',
            avatar: 'S',
            rating: 5,
            text: 'SaathiCare has been a game-changer for me. The period tracker is so accurate, and I love the health tips!',
            color: 'pink'
        },
        {
            name: 'Rita K.C.',
            location: 'Pokhara',
            avatar: 'R',
            rating: 5,
            text: 'I used the pregnancy companion throughout my journey. It felt like having a friend by my side.',
            color: 'purple'
        }
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <FadeInUp>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                            Loved by Women Across Nepal
                        </h2>
                        <p className="text-gray-600">
                            Join thousands of women who trust SaathiCare
                        </p>
                    </div>
                </FadeInUp>

                <StaggerContainer staggerDelay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {testimonials.map((testimonial, index) => (
                            <StaggerItem key={index}>
                                <motion.div
                                    className="bg-gray-50 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow h-full"
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center mb-6">
                                        <motion.div
                                            className={`w-14 h-14 bg-${testimonial.color}-100 text-${testimonial.color}-600 rounded-full flex items-center justify-center font-bold text-xl mr-4 shadow-md`}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            {testimonial.avatar}
                                        </motion.div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic leading-relaxed mb-4">
                                        "{testimonial.text}"
                                    </p>
                                    <motion.div
                                        className="flex gap-1"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <motion.svg
                                                key={i}
                                                className="w-5 h-5 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                initial={{ scale: 0, rotate: -180 }}
                                                whileInView={{ scale: 1, rotate: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.6 + (i * 0.1), duration: 0.4 }}
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </motion.svg>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>

                <FadeInUp delay={0.4}>
                    <div className="text-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/testimonials"
                                className="inline-flex items-center gap-2 text-primary-pink font-semibold hover:underline"
                            >
                                Read more stories →
                            </Link>
                        </motion.div>
                    </div>
                </FadeInUp>
            </div>
        </section>
    );
};

export default TestimonialsSection;
