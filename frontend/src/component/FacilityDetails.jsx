import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const FacilityDetails = () => {
    const { id } = useParams();
    // In a real app, fetch data based on ID. Here we use mock data or static for demo.
    const facility = {
        name: 'City Hospital',
        type: 'Hospital',
        rating: 4.5,
        reviews: 120,
        address: '123 Health Ave, Kathmandu',
        distance: '1.2 km',
        hours: 'Open 24 Hours',
        phone: '+977-1-4455667',
        services: ['Emergency', 'Pediatrics', 'Cardiology', 'Neurology', 'Lab Services'],
        images: [
            'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=o9695d3r9v34f5s6t7u8v9w0x1y2z3a4b5c6d7e8',
            'https://media.istockphoto.com/id/1166663582/photo/medical-team-working-on-computer-in-hospital.jpg?s=612x612&w=0&k=20&c=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
            'https://plus.unsplash.com/premium_photo-1673958771804-0985474c6d66?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9zcGl0YWwlMjByb29tfGVufDB8fDB8fHww'
        ]
    };

    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % facility.images.length);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-text-dark flex flex-col pb-24">
            {/* Image Carousel */}
            <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                <img
                    src={facility.images[currentImage]}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {facility.images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${idx === currentImage ? 'bg-white' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
                <button onClick={nextImage} className="absolute inset-0 bg-transparent w-full h-full"></button>

                {/* Back Button */}
                <Link to="/find-facility" className="absolute top-4 left-4 bg-white/80 p-2 rounded-full shadow-sm text-gray-700 hover:bg-white">
                    ←
                </Link>
            </div>

            {/* Header Info */}
            <div className="bg-white p-5 rounded-b-3xl shadow-sm -mt-4 relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{facility.name}</h1>
                        <p className="text-gray-500 text-sm mt-1">{facility.type}</p>
                    </div>
                    <span className="bg-pink-100 text-primary-pink text-xs font-bold px-3 py-1 rounded-full h-fit">
                        Female doctors available
                    </span>
                </div>
                <div className="flex items-center mt-3 space-x-4">
                    <div className="flex items-center">
                        <span className="text-yellow-400 text-lg mr-1">★</span>
                        <span className="font-bold text-gray-800">{facility.rating}</span>
                        <span className="text-gray-400 text-xs ml-1">({facility.reviews} reviews)</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-between mt-6 px-4">
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-500 shadow-sm group-hover:bg-teal-100 transition">
                            📞
                        </div>
                        <span className="text-xs font-medium text-gray-600">Call</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm group-hover:bg-blue-100 transition">
                            🗺️
                        </div>
                        <span className="text-xs font-medium text-gray-600">Map</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-primary-pink shadow-sm group-hover:bg-pink-100 transition">
                            ♡
                        </div>
                        <span className="text-xs font-medium text-gray-600">Save</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shadow-sm group-hover:bg-gray-100 transition">
                            📤
                        </div>
                        <span className="text-xs font-medium text-gray-600">Share</span>
                    </button>
                </div>
            </div>

            {/* Info Sections */}
            <div className="p-5 space-y-4">
                {/* Address */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Address & Hours</h3>
                    <div className="flex items-start mb-3">
                        <span className="text-xl mr-3">📍</span>
                        <div>
                            <p className="text-sm text-gray-600 leading-snug">{facility.address}</p>
                            <p className="text-xs text-cool-gray-400 mt-1">{facility.distance} away</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="text-xl mr-3">🕒</span>
                        <div>
                            <p className="text-sm text-green-600 font-medium">Open Now</p>
                            <p className="text-xs text-gray-500 mt-1">{facility.hours}</p>
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Services</h3>
                    <div className="flex flex-wrap gap-2">
                        {facility.services.map(service => (
                            <span key={service} className="px-3 py-1.5 bg-gray-100/80 rounded-lg text-xs font-medium text-gray-600 border border-gray-200/50">
                                {service}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Reviews Preview */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Reviews</h3>
                        <a href="#" className="text-primary-pink text-xs font-bold">See All</a>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">S</div>
                            <div>
                                <div className="flex justify-between w-full">
                                    <span className="text-xs font-bold text-gray-700">Sita Sharma</span>
                                    <span className="text-[10px] text-gray-400">2 days ago</span>
                                </div>
                                <div className="text-yellow-400 text-xs my-0.5">★★★★★</div>
                                <p className="text-xs text-gray-500 leading-relaxed">Great experience, very clean and professional staff.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Action */}
            <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                <button className="w-full bg-primary-pink text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 active:scale-[0.98] transition">
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default FacilityDetails;
