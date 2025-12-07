import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Take Control of Your Health?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of women who trust SaathiCare for their health journey
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-10 py-4 bg-white text-primary-pink rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                    >
                        Get Started Free
                    </Link>
                    <p className="mt-6 text-sm opacity-75">
                        No credit card required • Free forever • 2 minute setup
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
