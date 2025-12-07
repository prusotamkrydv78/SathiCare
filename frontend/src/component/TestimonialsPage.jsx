import React from 'react';
import { Link } from 'react-router-dom';

const TestimonialsPage = () => {
    const testimonials = [
        {
            id: 1,
            name: "Sita Sharma",
            location: "Kathmandu",
            role: "Mother of two",
            quote: "Saathi has been a game-changer for me. The period tracker is so accurate, and I love the health tips! It feels like a personal assistant for my health.",
            avatar: "S"
        },
        {
            id: 2,
            name: "Rita K.C.",
            location: "Pokhara",
            role: "Expecting Mother",
            quote: "I used the pregnancy companion throughout my journey. It felt like having a friend by my side. The weekly updates were exactly what I needed.",
            avatar: "R"
        },
        {
            id: 3,
            name: "Anita Gurung",
            location: "Lalitpur",
            role: "Student",
            quote: "Finding a gynecologist was always awkward for me until I found Saathi. The facility finder is amazing and helped me find a great doctor nearby.",
            avatar: "A"
        },
        {
            id: 4,
            name: "Manju Shrestha",
            location: "Biratnagar",
            role: "Teacher",
            quote: "The educational content in the library is top-notch. I've learned so much about my body and health that I never knew before. Highly recommended!",
            avatar: "M"
        },
        {
            id: 5,
            name: "Priya Singh",
            location: "Birgunj",
            role: "Nurse",
            quote: "As a healthcare professional, I appreciate the accuracy of the information provided. It's a great resource for my patients as well.",
            avatar: "P"
        },
        {
            id: 6,
            name: "Gita Thapa",
            location: "Dhangadhi",
            role: "Entrepreneur",
            quote: "The Emergency SOS feature gives me peace of mind when I travel alone for work. Saathi truly cares about women's safety.",
            avatar: "G"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24">

            {/* Header */}
            <div className="bg-white p-6 sticky top-0 z-20 shadow-sm border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-gray-500 hover:text-gray-700 transition">← Back to Home</Link>
                    <h1 className="text-xl font-bold text-gray-800">Success Stories</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Loved by Women Across Nepal</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of women who trust Saathi for their health and wellness journey. Here's what they have to say.</p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-pink-100 text-primary-pink rounded-full flex items-center justify-center font-bold text-xl mr-4">
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{t.name}</h4>
                                    <p className="text-xs text-gray-500">{t.role} • {t.location}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic leading-relaxed">"{t.quote}"</p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="bg-primary-pink/10 rounded-3xl p-10 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Have your own story?</h3>
                    <p className="text-gray-600 mb-6">We'd love to hear how Saathi has helped you. Share your experience with us.</p>
                    <button className="px-8 py-3 bg-primary-pink text-white rounded-full font-bold shadow-lg hover:bg-pink-600 transition">Share Your Story</button>
                </div>
            </div>

        </div>
    );
};

export default TestimonialsPage;
