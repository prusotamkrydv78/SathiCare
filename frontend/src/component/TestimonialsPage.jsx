import React from 'react';
import { Link } from 'react-router-dom';

const TestimonialsPage = () => {
    const testimonials = [
        {
            id: 1,
            name: "Sita Sharma",
            location: "Kathmandu",
            role: "Mother of two",
            quote: "SaathiCare has been a game-changer for me. The period tracker is so accurate, and I love the health tips! It feels like a personal assistant for my health. I've recommended it to all my friends.",
            avatar: "S",
            rating: 5,
            color: "pink",
            feature: "Period Tracker"
        },
        {
            id: 2,
            name: "Rita K.C.",
            location: "Pokhara",
            role: "Expecting Mother",
            quote: "I used the pregnancy companion throughout my journey. It felt like having a friend by my side. The weekly updates were exactly what I needed, and the AI tips were incredibly helpful.",
            avatar: "R",
            rating: 5,
            color: "purple",
            feature: "Pregnancy Companion"
        },
        {
            id: 3,
            name: "Anita Gurung",
            location: "Lalitpur",
            role: "Student",
            quote: "Finding a gynecologist was always awkward for me until I found SaathiCare. The facility finder is amazing and helped me find a great doctor nearby. The app is so easy to use!",
            avatar: "A",
            rating: 5,
            color: "blue",
            feature: "Doctor Finder"
        },
        {
            id: 4,
            name: "Manju Shrestha",
            location: "Biratnagar",
            role: "Teacher",
            quote: "The educational content in the library is top-notch. I've learned so much about my body and health that I never knew before. Highly recommended for all women!",
            avatar: "M",
            rating: 5,
            color: "green",
            feature: "Health Library"
        },
        {
            id: 5,
            name: "Priya Singh",
            location: "Birgunj",
            role: "Nurse",
            quote: "As a healthcare professional, I appreciate the accuracy of the information provided. It's a great resource for my patients as well. The AI assistant is surprisingly knowledgeable.",
            avatar: "P",
            rating: 5,
            color: "indigo",
            feature: "AI Assistant"
        },
        {
            id: 6,
            name: "Gita Thapa",
            location: "Dhangadhi",
            role: "Entrepreneur",
            quote: "The Emergency SOS feature gives me peace of mind when I travel alone for work. SaathiCare truly cares about women's safety. It's more than just a health app.",
            avatar: "G",
            rating: 5,
            color: "red",
            feature: "Emergency SOS"
        },
        {
            id: 7,
            name: "Sunita Rai",
            location: "Chitwan",
            role: "Homemaker",
            quote: "I love how everything is in Nepali too! It makes it so much easier for me to understand. The app is very user-friendly and the support team is always helpful.",
            avatar: "S",
            rating: 5,
            color: "pink",
            feature: "Nepali Support"
        },
        {
            id: 8,
            name: "Kamala Adhikari",
            location: "Bhaktapur",
            role: "Doctor",
            quote: "I recommend SaathiCare to all my patients. It helps them track their health better and makes our consultations more productive. The data insights are very useful.",
            avatar: "K",
            rating: 5,
            color: "purple",
            feature: "Health Tracking"
        },
        {
            id: 9,
            name: "Deepa Tamang",
            location: "Janakpur",
            role: "College Student",
            quote: "The symptom checker helped me understand when I needed to see a doctor. It's like having a health advisor in my pocket. Very grateful for this app!",
            avatar: "D",
            rating: 5,
            color: "blue",
            feature: "Symptom Checker"
        }
    ];

    const stats = [
        { number: '10,000+', label: 'Happy Users' },
        { number: '4.9/5', label: 'Average Rating' },
        { number: '50,000+', label: 'Reviews' },
        { number: '98%', label: 'Satisfaction' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans pb-24">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-20 px-6 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Loved by Women Across Nepal
                    </h1>
                    <p className="text-xl opacity-90 mb-8">
                        Join thousands of women who trust SaathiCare for their health and wellness journey
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold mb-1">{stat.number}</div>
                                <div className="text-sm opacity-75">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center mb-6">
                                <div className={`w-16 h-16 bg-${t.color}-100 text-${t.color}-600 rounded-full flex items-center justify-center font-bold text-2xl mr-4 shadow-md`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{t.name}</h4>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {t.location}
                                    </p>
                                </div>
                            </div>

                            {/* Quote */}
                            <p className="text-gray-600 italic leading-relaxed mb-6 flex-grow">
                                "{t.quote}"
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex gap-1">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className={`text-xs px-3 py-1 bg-${t.color}-50 text-${t.color}-600 rounded-full font-semibold`}>
                                    {t.feature}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Share Your Story CTA */}
            <div className="max-w-4xl mx-auto px-6 mt-8">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-12 text-center border border-pink-100">
                    <div className="text-6xl mb-6">💝</div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Have Your Own Story?</h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        We'd love to hear how SaathiCare has helped you. Share your experience and inspire other women on their health journey.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                        Share Your Story
                    </Link>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-4xl mx-auto px-6 mt-16">
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
                    <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
                    <p className="text-xl opacity-90 mb-8">Join our community of empowered women</p>
                    <Link
                        to="/signup"
                        className="inline-block px-10 py-4 bg-white text-primary-pink rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                    >
                        Get Started Free
                    </Link>
                    <p className="mt-6 text-sm opacity-75">No credit card required • Free forever</p>
                </div>
            </div>

        </div>
    );
};

export default TestimonialsPage;
