import React from 'react';
import { Link } from 'react-router-dom';
import { FadeInUp, StaggerContainer, StaggerItem, ScaleIn } from './animations/ScrollAnimations';
import { motion } from 'framer-motion';

const TestimonialsPage = () => {
    const stats = [
        { number: '10,000+', label: 'Happy Users', icon: '👥' },
        { number: '4.9/5', label: 'Average Rating', icon: '⭐' },
        { number: '98%', label: 'Satisfaction Rate', icon: '💝' }
    ];

    const testimonials = [
        {
            id: 1,
            name: 'Sita Sharma',
            location: 'Kathmandu',
            avatar: 'S',
            rating: 5,
            text: 'SaathiCare has completely changed how I track my health. The AI predictions are incredibly accurate, and I love getting personalized tips every day!',
            features: ['Period Tracker', 'AI Insights'],
            color: 'pink'
        },
        {
            id: 2,
            name: 'Rita K.C.',
            location: 'Pokhara',
            avatar: 'R',
            rating: 5,
            text: 'The pregnancy companion feature was my best friend during my journey. Week-by-week guidance and the AI assistant answered all my questions instantly.',
            features: ['Pregnancy Tracker', 'AI Assistant'],
            color: 'purple'
        },
        {
            id: 3,
            name: 'Anjali Thapa',
            location: 'Lalitpur',
            avatar: 'A',
            rating: 5,
            text: 'Finding a good gynecologist was so easy with SaathiCare. I could see ratings, availability, and book an appointment in minutes!',
            features: ['Doctor Finder', 'Appointments'],
            color: 'blue'
        },
        {
            id: 4,
            name: 'Kamala Rai',
            location: 'Bhaktapur',
            avatar: 'K',
            rating: 5,
            text: 'I appreciate that everything is in Nepali. It makes me feel more comfortable discussing my health concerns.',
            features: ['Nepali Support', 'Health Library'],
            color: 'green'
        },
        {
            id: 5,
            name: 'Sunita Gurung',
            location: 'Chitwan',
            avatar: 'S',
            rating: 5,
            text: 'The emergency SOS feature gives me peace of mind. Knowing that help is just one tap away is reassuring.',
            features: ['Emergency SOS', 'Location Services'],
            color: 'red'
        },
        {
            id: 6,
            name: 'Mina Shrestha',
            location: 'Biratnagar',
            avatar: 'M',
            rating: 5,
            text: 'As someone who lives in a smaller city, having access to verified health information and AI support has been invaluable.',
            features: ['AI Assistant', 'Health Library'],
            color: 'indigo'
        },
        {
            id: 7,
            name: 'Gita Tamang',
            location: 'Dharan',
            avatar: 'G',
            rating: 5,
            text: 'The symptom checker helped me understand when I needed to see a doctor. It\'s like having a health expert in my pocket!',
            features: ['Symptom Checker', 'AI Insights'],
            color: 'teal'
        },
        {
            id: 8,
            name: 'Laxmi Adhikari',
            location: 'Butwal',
            avatar: 'L',
            rating: 5,
            text: 'I love how the app learns from my data and gives me personalized recommendations. It truly feels made for me.',
            features: ['AI Personalization', 'Period Tracker'],
            color: 'pink'
        },
        {
            id: 9,
            name: 'Radha Poudel',
            location: 'Hetauda',
            avatar: 'R',
            rating: 5,
            text: 'The community forum is amazing! It\'s so helpful to connect with other women and share experiences.',
            features: ['Community Forum', 'Support Groups'],
            color: 'purple'
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
                            Loved by Women Across Nepal
                        </motion.h1>
                        <motion.p
                            className="text-xl opacity-90 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Join thousands of women who trust SaathiCare for their health journey
                        </motion.p>

                        {/* Stats */}
                        <StaggerContainer staggerDelay={0.15}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {stats.map((stat, index) => (
                                    <StaggerItem key={index}>
                                        <ScaleIn delay={index * 0.1}>
                                            <motion.div
                                                className="text-center"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <div className="text-5xl mb-3">{stat.icon}</div>
                                                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                                                <div className="text-pink-100">{stat.label}</div>
                                            </motion.div>
                                        </ScaleIn>
                                    </StaggerItem>
                                ))}
                            </div>
                        </StaggerContainer>
                    </div>
                </div>
            </FadeInUp>

            {/* Testimonials Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <FadeInUp>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Real Stories from Real Women
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Hear what our users have to say about their experience with SaathiCare
                        </p>
                    </div>
                </FadeInUp>

                <StaggerContainer staggerDelay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <StaggerItem key={testimonial.id}>
                                <ScaleIn delay={index * 0.05}>
                                    <motion.div
                                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
                                        whileHover={{ y: -8 }}
                                    >
                                        {/* Header */}
                                        <div className="flex items-center mb-4">
                                            <motion.div
                                                className={`w-12 h-12 bg-${testimonial.color}-100 text-${testimonial.color}-600 rounded-full flex items-center justify-center font-bold text-lg mr-3 shadow-md`}
                                                whileHover={{ rotate: 360, scale: 1.1 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                {testimonial.avatar}
                                            </motion.div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {testimonial.location}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <motion.div
                                            className="flex gap-1 mb-4"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 }}
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
                                                    transition={{ delay: 0.4 + (i * 0.1), type: "spring", stiffness: 300 }}
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </motion.svg>
                                            ))}
                                        </motion.div>

                                        {/* Testimonial Text */}
                                        <p className="text-gray-600 italic leading-relaxed mb-4 flex-grow">
                                            "{testimonial.text}"
                                        </p>

                                        {/* Feature Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {testimonial.features.map((feature, i) => (
                                                <motion.span
                                                    key={i}
                                                    className={`px-3 py-1 bg-${testimonial.color}-50 text-${testimonial.color}-600 text-xs font-semibold rounded-full`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {feature}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                </ScaleIn>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            </div>

            {/* Share Your Story CTA */}
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
                            <h3 className="text-3xl font-bold mb-4">Share Your Story</h3>
                            <p className="text-xl opacity-90 mb-8">
                                Have you had a great experience with SaathiCare? We'd love to hear from you!
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/signup"
                                    className="inline-block px-10 py-4 bg-white text-primary-pink rounded-xl font-bold shadow-xl hover:shadow-2xl transition-shadow duration-200"
                                >
                                    Join SaathiCare
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </FadeInUp>

        </div>
    );
};

export default TestimonialsPage;
