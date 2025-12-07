import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 text-gray-800">

            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Hero / Mission */}
                <div className="text-center mb-16 space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-pink to-purple-600">
                        Empowering Women, <br /> One Step at a Time.
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Saathi is more than just an app; it's a digital companion designed to bridge the gap in women's healthcare access in Nepal.
                    </p>
                </div>

                {/* Our Story / Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-50">
                        <span className="text-5xl mb-4 block">🕉️</span>
                        <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We envision a Nepal where every woman, regardless of her location or background, has instant access to trusted health information, medical facilities, and a supportive community.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Why Saathi?</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Navigating healthcare can be overwhelming. From tracking menstrual cycles to finding the right reliable doctor, the journey is often filled with uncertainty.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Saathi ("Friend" in Nepali) was built to be that reliable guide. By combining technology with local healthcare data, we provide a localized, culturally sensitive solution for Nepali women.
                        </p>
                    </div>
                </div>

                {/* Team (Generic Placeholder) */}
                <div className="mb-20">
                    <h3 className="text-2xl font-bold text-center mb-10">Meet the Team</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((member) => (
                            <div key={member} className="text-center group">
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-md group-hover:border-primary-pink transition duration-300">
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-3xl text-gray-400">👤</div>
                                </div>
                                <h4 className="font-bold text-gray-800">Team Member</h4>
                                <p className="text-xs text-primary-pink font-bold uppercase tracking-wide">Developer</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-center text-white shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Join us on this journey</h3>
                    <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                        Whether you are a user, a healthcare professional, or just someone who cares, there is a place for you in the Saathi community.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-primary-pink text-white rounded-full font-bold hover:bg-pink-600 transition">Download App</button>
                        <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition">Contact Us</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
