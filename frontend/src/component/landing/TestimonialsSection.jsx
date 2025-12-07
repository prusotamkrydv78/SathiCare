import React from 'react';
import { Link } from 'react-router-dom';

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
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        Loved by Women Across Nepal
                    </h2>
                    <p className="text-gray-600">
                        Join thousands of women who trust SaathiCare
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 p-8 rounded-3xl shadow-sm hover:shadow-md transition">
                            <div className="flex items-center mb-6">
                                <div className={`w-14 h-14 bg-${testimonial.color}-100 text-${testimonial.color}-600 rounded-full flex items-center justify-center font-bold text-xl mr-4`}>
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic leading-relaxed mb-4">
                                "{testimonial.text}"
                            </p>
                            <div className="flex gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/testimonials"
                        className="inline-flex items-center gap-2 text-primary-pink font-semibold hover:underline"
                    >
                        Read more stories →
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
