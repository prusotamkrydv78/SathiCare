import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FacilityFinder = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
    const [selectedFacility, setSelectedFacility] = useState(null);

    const filters = ['All', 'Hospitals', 'Clinics', 'Pharmacies', 'Labs', 'Female Doctors'];

    const facilities = [
        { id: 1, name: 'City Hospital', type: 'Hospital', distance: '1.2 km', rating: 4.5, isOpen: true, lat: 30, lng: 40, color: 'red' },
        { id: 2, name: 'Care Clinic', type: 'Clinic', distance: '0.8 km', rating: 4.2, isOpen: true, lat: 50, lng: 60, color: 'blue' },
        { id: 3, name: 'MediPlus Pharmacy', type: 'Pharmacy', distance: '0.5 km', rating: 4.8, isOpen: true, lat: 70, lng: 30, color: 'green' },
        { id: 4, name: 'Women\'s Health Center', type: 'Clinic', distance: '2.5 km', rating: 4.9, isOpen: false, lat: 20, lng: 80, color: 'blue' },
    ];

    const filteredFacilities = activeFilter === 'All'
        ? facilities
        : facilities.filter(f => f.type.includes(activeFilter) || (activeFilter === 'Female Doctors' && f.type === 'Clinic')); // Simplified logic

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-text-dark relative overflow-hidden flex flex-col">

            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full z-20 p-4 space-y-4 bg-gradient-to-b from-white/90 to-transparent pb-8">
                {/* Search Bar */}
                <div className="bg-white rounded-full shadow-md flex items-center px-4 h-12">
                    <Link to="/dashboard" className="mr-3 text-gray-500">←</Link>
                    <span className="text-gray-400 mr-2">🔍</span>
                    <input
                        type="text"
                        placeholder="Search hospitals, clinics..."
                        className="flex-1 outline-none text-sm text-gray-700"
                    />
                    <button
                        onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                        className="text-xs font-bold text-primary-pink bg-pink-50 px-3 py-1 rounded-full"
                    >
                        {viewMode === 'map' ? 'List View' : 'Map View'}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition ${activeFilter === filter
                                    ? 'bg-primary-pink text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative">

                {/* Map View */}
                <div className={`absolute inset-0 bg-[#E5E7EB] transition-opacity duration-300 ${viewMode === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    {/* Simulated Map Background */}
                    <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(#CBD5E0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Markers */}
                    {filteredFacilities.map(facility => (
                        <button
                            key={facility.id}
                            onClick={() => setSelectedFacility(facility)}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition"
                            style={{ top: `${facility.lat}%`, left: `${facility.lng}%` }}
                        >
                            <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold
                                ${facility.color === 'red' ? 'bg-red-500' : ''}
                                ${facility.color === 'blue' ? 'bg-blue-500' : ''}
                                ${facility.color === 'green' ? 'bg-green-500' : ''}
                            `}>
                                {facility.type === 'Hospital' ? '+' : facility.type === 'Clinic' ? 'C' : 'Rx'}
                            </div>
                            <div className="w-2 h-2 bg-black/20 rounded-full mx-auto mt-1 blur-[1px]"></div>
                        </button>
                    ))}
                </div>

                {/* List View */}
                <div className={`absolute inset-0 bg-gray-50 z-10 overflow-y-auto pt-36 px-4 pb-24 transition-opacity duration-300 ${viewMode === 'list' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="space-y-4">
                        {filteredFacilities.map(facility => (
                            <div key={facility.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800">{facility.name}</h3>
                                    <p className="text-xs text-gray-500 mb-1">{facility.type} • {facility.distance}</p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-yellow-400 text-xs">★ {facility.rating}</span>
                                        {facility.isOpen && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Open Now</span>}
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white
                                    ${facility.color === 'red' ? 'bg-red-100 text-red-500' : ''}
                                    ${facility.color === 'blue' ? 'bg-blue-100 text-blue-500' : ''}
                                    ${facility.color === 'green' ? 'bg-green-100 text-green-500' : ''}
                                `}>
                                    ➤
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Sheet (Map View Only) */}
            {viewMode === 'map' && (
                <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-30 transition-transform duration-300 transform translate-y-0">
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4"></div>

                    <div className="px-6 pb-8 overflow-x-auto flex space-x-4 no-scrollbar">
                        {filteredFacilities.map(facility => (
                            <div
                                key={facility.id}
                                onClick={() => setSelectedFacility(facility)}
                                className={`min-w-[280px] bg-white rounded-xl p-4 border transition cursor-pointer ${selectedFacility?.id === facility.id ? 'border-primary-pink shadow-md ring-1 ring-pink-100' : 'border-gray-100 shadow-sm'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{facility.name}</h3>
                                        <p className="text-xs text-gray-500">{facility.type}</p>
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">{facility.distance}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-yellow-400 text-sm">★</span>
                                        <span className="text-xs font-medium text-gray-700">{facility.rating}</span>
                                        <span className="text-xs text-gray-400">(120)</span>
                                    </div>
                                    {facility.isOpen ? (
                                        <span className="text-[10px] font-bold text-green-600">Open Now</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-red-500">Closed</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default FacilityFinder;
