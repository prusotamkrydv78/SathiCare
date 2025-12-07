import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="font-sans text-text-dark">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
                <div className="text-2xl font-bold text-primary-pink">Saathi</div>
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-primary-pink transition font-medium">Home</Link>
                    <Link to="/features" className="text-gray-600 hover:text-primary-pink transition font-medium">Features</Link>
                    <Link to="/testimonials" className="text-gray-600 hover:text-primary-pink transition font-medium">Testimonials</Link>
                    <Link to="/about" className="text-gray-600 hover:text-primary-pink transition font-medium">About</Link>
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="px-4 py-2 text-primary-pink border border-primary-pink rounded-lg hover:bg-pink-50 inline-block">Login</Link>
                    <Link to="/signup" className="px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-pink-600 shadow-md inline-block">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-gradient-to-b from-soft-pink to-white py-20 px-6 text-center md:text-left relative overflow-hidden">
                {/* Floating Hearts Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute top-[60%] left-[10%] text-2xl animate-float opacity-0" style={{ animationDelay: '0s' }}>🌸</span>
                    <span className="absolute top-[80%] left-[20%] text-3xl animate-float opacity-0" style={{ animationDelay: '2s' }}>💖</span>
                    <span className="absolute top-[50%] left-[80%] text-xl animate-float opacity-0" style={{ animationDelay: '1s' }}>💗</span>
                    <span className="absolute top-[70%] left-[90%] text-4xl animate-float opacity-0" style={{ animationDelay: '3s' }}>🌺</span>
                    <span className="absolute top-[40%] left-[5%] text-2xl animate-float opacity-0" style={{ animationDelay: '4s' }}>💕</span>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center relative z-10">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                            Your Trusted Health Companion <br />
                            <span className="text-primary-pink">तपाईंको स्वास्थ्य साथी</span>
                        </h1>
                        <p className="text-lg mb-8 text-gray-600">
                            Empowering women with personalized health tracking, expert advice, and a supportive community.
                        </p>
                        <div className="space-x-4">
                            <Link to="/signup" className="px-8 py-3 bg-primary-pink text-white rounded-full shadow-lg hover:bg-pink-600 transition transform hover:-translate-y-1 inline-block">Get Started</Link>
                            <Link to="/dashboard" className="px-8 py-3 bg-white text-primary-pink border border-primary-pink rounded-full shadow-lg hover:bg-pink-50 transition transform hover:-translate-y-1 inline-block">Learn More</Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        {/* Placeholder for Illustration - In a real scenario, an image would be here */}
                        <div className="w-full h-96 bg-pink-100 rounded-3xl flex items-center justify-center shadow-xl overflow-hidden relative">
                            <span className="text-6xl absolute top-10 right-10 animate-bounce delay-700 opacity-50">🌸</span>
                            <span className="text-pink-400 text-xl font-semibold">App Interface Illustration</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">Why Choose Saathi?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="p-8 bg-pink-50 rounded-2xl shadow-sm hover:shadow-md transition">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-xl font-bold mb-2">Period Tracker</h3>
                            <p className="text-gray-600">Accurate cycle tracking and predictions to help you stay on top of your health.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-8 bg-pink-50 rounded-2xl shadow-sm hover:shadow-md transition">
                            <div className="text-4xl mb-4">🤰</div>
                            <h3 className="text-xl font-bold mb-2">Pregnancy Companion</h3>
                            <p className="text-gray-600">Weekly updates, health tips, and growth tracking for your pregnancy journey.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-8 bg-pink-50 rounded-2xl shadow-sm hover:shadow-md transition">
                            <div className="text-4xl mb-4">👩‍⚕️</div>
                            <h3 className="text-xl font-bold mb-2">Find Doctors</h3>
                            <p className="text-gray-600">Connect with trusted gynecologists and health experts in your area.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-md text-left">
                            <p className="text-gray-600 italic mb-4">"Saathi has been a game-changer for me. The period tracker is so accurate, and I love the health tips!"</p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                <div>
                                    <h4 className="font-bold">Sita Sharma</h4>
                                    <span className="text-sm text-gray-500">Kathmandu</span>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-md text-left">
                            <p className="text-gray-600 italic mb-4">"I used the pregnancy companion throughout my journey. It felt like having a friend by my side."</p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                <div>
                                    <h4 className="font-bold">Rita K.C.</h4>
                                    <span className="text-sm text-gray-500">Pokhara</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-text-dark text-white py-12 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-primary-pink">Saathi</h3>
                        <p className="text-gray-400">Empowering women, one step at a time.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Home</a></li>
                            <li><a href="#" className="hover:text-white">About Us</a></li>
                            <li><Link to="/features" className="hover:text-white">Features</Link></li>
                            <li><a href="#" className="hover:text-white">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Help Center</a></li>
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Contact</h4>
                        <p className="text-gray-400">info@saathi.com</p>
                        <p className="text-gray-400">+977 9800000000</p>
                        <div className="flex space-x-4 mt-4">
                            {/* Social Icons Placeholder */}
                            <div className="w-8 h-8 bg-gray-600 rounded-full hover:bg-primary-pink cursor-pointer"></div>
                            <div className="w-8 h-8 bg-gray-600 rounded-full hover:bg-primary-pink cursor-pointer"></div>
                            <div className="w-8 h-8 bg-gray-600 rounded-full hover:bg-primary-pink cursor-pointer"></div>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-500 mt-12 pt-8 border-t border-gray-700">
                    &copy; 2025 Saathi. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
