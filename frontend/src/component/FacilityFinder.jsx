import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const createCustomIcon = (color, label) => L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${label}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const hospitalIcon = createCustomIcon('#EF4444', '+'); // Red
const clinicIcon = createCustomIcon('#3B82F6', 'C'); // Blue
const pharmacyIcon = createCustomIcon('#10B981', 'Rx'); // Green

const FacilityFinder = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
    const [selectedFacility, setSelectedFacility] = useState(null);

    const filters = ['All', 'Hospitals', 'Clinics', 'Pharmacies', 'Labs', 'Female Doctors'];

    // Mock Data centered around Kathmandu (or generic location)
    const facilities = [
        { id: 1, name: 'City Hospital', type: 'Hospital', distance: '1.2 km', rating: 4.5, isOpen: true, lat: 27.7172, lng: 85.3240, icon: hospitalIcon },
        { id: 2, name: 'Care Clinic', type: 'Clinic', distance: '0.8 km', rating: 4.2, isOpen: true, lat: 27.7200, lng: 85.3200, icon: clinicIcon },
        { id: 3, name: 'MediPlus Pharmacy', type: 'Pharmacy', distance: '0.5 km', rating: 4.8, isOpen: true, lat: 27.7150, lng: 85.3100, icon: pharmacyIcon },
        { id: 4, name: 'Women\'s Health Center', type: 'Clinic', distance: '2.5 km', rating: 4.9, isOpen: false, lat: 27.7100, lng: 85.3300, icon: clinicIcon },
    ];

    const filteredFacilities = activeFilter === 'All'
        ? facilities
        : facilities.filter(f => f.type.includes(activeFilter) || (activeFilter === 'Female Doctors' && f.type === 'Clinic')); // Simplified logic

    const handleFacilityClick = (facility) => {
        setSelectedFacility(facility);
    };

    const handleNavigate = (id) => {
        navigate(`/facility/${id}`);
    };

    return (
        <div className="h-screen bg-gray-100 font-sans text-text-dark flex flex-col overflow-hidden relative">

            {/* Top Bar - Absolute on Map */}
            <div className="absolute top-0 left-0 w-full z-[1000] p-4 space-y-4 pointer-events-none">
                <div className="pointer-events-auto">
                    {/* Search Bar */}
                    <div className="bg-white rounded-full shadow-lg flex items-center px-4 h-12 mb-3">
                        <Link to="/dashboard" className="mr-3 text-gray-500 hover:text-gray-700">←</Link>
                        <span className="text-gray-400 mr-2">🔍</span>
                        <input
                            type="text"
                            placeholder="Search hospitals, clinics..."
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                        />
                        <button
                            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                            className="ml-2 text-xs font-bold text-white bg-primary-pink px-4 py-1.5 rounded-full shadow-md hover:bg-pink-500 transition"
                        >
                            {viewMode === 'map' ? 'List' : 'Map'}
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-all border ${activeFilter === filter
                                    ? 'bg-primary-pink text-white border-primary-pink'
                                    : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative z-0">
                {viewMode === 'map' ? (
                    <MapContainer center={[27.7172, 85.3240]} zoom={14} scrollWheelZoom={true} className="h-full w-full z-0">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {filteredFacilities.map(facility => (
                            <Marker
                                key={facility.id}
                                position={[facility.lat, facility.lng]}
                                icon={facility.icon}
                                eventHandlers={{
                                    click: () => handleFacilityClick(facility),
                                }}
                            />
                        ))}
                    </MapContainer>
                ) : (
                    <div className="h-full overflow-y-auto pt-40 px-4 pb-24 bg-gray-50">
                        <div className="space-y-4">
                            {filteredFacilities.map(facility => (
                                <div key={facility.id} onClick={() => handleNavigate(facility.id)} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:shadow-md transition">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{facility.name}</h3>
                                        <p className="text-xs text-gray-500 mb-1">{facility.type} • {facility.distance}</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-yellow-400 text-xs">★ {facility.rating}</span>
                                            {facility.isOpen && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Open Now</span>}
                                        </div>
                                    </div>
                                    <div className="text-primary-pink text-2xl">›</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Sheet Detail Preview (Map View) */}
            {viewMode === 'map' && selectedFacility && (
                <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-[1100] p-5 pb-8 animate-slide-up">
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" onClick={() => setSelectedFacility(null)}></div>

                    <div className="flex justify-between items-start mb-4" onClick={() => handleNavigate(selectedFacility.id)}>
                        <div>
                            <h2 className="font-bold text-xl text-gray-800">{selectedFacility.name}</h2>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className="mr-2">{selectedFacility.type}</span>
                                <span>• {selectedFacility.distance}</span>
                            </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                ${selectedFacility.type === 'Hospital' ? 'bg-red-500' : ''}
                                ${selectedFacility.type === 'Clinic' ? 'bg-blue-500' : ''}
                                ${selectedFacility.type === 'Pharmacy' ? 'bg-green-500' : ''}
                            `}>
                            {selectedFacility.type === 'Hospital' ? '+' : selectedFacility.type === 'Clinic' ? 'C' : 'Rx'}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button onClick={() => handleNavigate(selectedFacility.id)} className="flex-1 bg-primary-pink text-white py-3 rounded-xl font-bold shadow-md hover:bg-pink-500 transition">
                            View Details
                        </button>
                        <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                            Directions
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacilityFinder;
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
