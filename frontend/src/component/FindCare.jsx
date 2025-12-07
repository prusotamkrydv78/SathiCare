import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import hospitalsData from '../data/hospitals.json';

const hospitals = hospitalsData.hospitals;

// Map style - using a free beautiful style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// Icon components (inline SVG for better performance)
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
    </svg>
);

const StarIcon = ({ filled }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const NavigationIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
    </svg>
);

const PhoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const MapPinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"></path>
    </svg>
);

const Building2Icon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
        <path d="M10 6h4"></path>
        <path d="M10 10h4"></path>
        <path d="M10 14h4"></path>
        <path d="M10 18h4"></path>
    </svg>
);

const StethoscopeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
        <circle cx="20" cy="10" r="2"></circle>
    </svg>
);

const PillIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
        <path d="m8.5 8.5 7 7"></path>
    </svg>
);

const TestTubeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"></path>
        <path d="M8.5 2h7"></path>
        <path d="M14.5 16h-5"></path>
    </svg>
);

const UserCheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <polyline points="16 11 18 13 22 9"></polyline>
    </svg>
);

const CrosshairIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="22" y1="12" x2="18" y2="12"></line>
        <line x1="6" y1="12" x2="2" y2="12"></line>
        <line x1="12" y1="6" x2="12" y2="2"></line>
        <line x1="12" y1="22" x2="12" y2="18"></line>
    </svg>
);

const LoaderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
);

// Get icon for facility type
const getFacilityIcon = (type) => {
    switch (type) {
        case 'Hospital': return <Building2Icon />;
        case 'Clinic': return <StethoscopeIcon />;
        case 'Pharmacy': return <PillIcon />;
        case 'Lab': return <TestTubeIcon />;
        default: return <Building2Icon />;
    }
};

// Get marker color for facility type
const getMarkerColor = (type, isSelected) => {
    if (isSelected) return '#ff6b9c';
    switch (type) {
        case 'Hospital': return '#ef4444';
        case 'Clinic': return '#3b82f6';
        case 'Pharmacy': return '#22c55e';
        case 'Lab': return '#8b5cf6';
        default: return '#64748b';
    }
};

// Styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#faf8f9',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    },
    header: {
        background: 'linear-gradient(135deg, #fff 0%, #fef7f9 100%)',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 107, 156, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 12px rgba(255, 107, 156, 0.08)',
        zIndex: 10
    },
    searchRow: {
        display: 'flex',
        gap: '12px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        alignItems: 'center'
    },
    searchContainer: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderRadius: '14px',
        padding: '0 18px',
        height: '48px',
        border: '2px solid #f0e8ec',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease'
    },
    searchInput: {
        flex: 1,
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        outline: 'none',
        color: '#2d3748',
        fontWeight: 500
    },
    viewToggle: {
        display: 'flex',
        background: 'white',
        borderRadius: '12px',
        padding: '4px',
        height: '48px',
        border: '2px solid #f0e8ec',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    },
    filterContainer: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
    },
    mapSection: {
        flex: 1,
        position: 'relative',
        height: '100%'
    },
    sidebar: {
        width: '380px',
        minWidth: '380px',
        background: 'linear-gradient(180deg, #ffffff 0%, #fefcfd 100%)',
        borderLeft: '1px solid rgba(255, 107, 156, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
    },
    sidebarHeader: {
        padding: '20px',
        background: 'linear-gradient(135deg, #fff 0%, #fef7f9 100%)',
        borderBottom: '1px solid rgba(255, 107, 156, 0.1)'
    },
    cardList: {
        flex: 1,
        overflowY: 'auto',
        padding: '12px'
    },
    locateButton: {
        position: 'absolute',
        bottom: 180,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'white',
        border: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        transition: 'all 0.2s ease'
    }
};

const FindCare = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('map');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [popupInfo, setPopupInfo] = useState(null);

    // Location state
    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Map state
    const [viewState, setViewState] = useState({
        longitude: 85.324,
        latitude: 27.7172,
        zoom: 13
    });

    const mapRef = useRef(null);
    const cardListRef = useRef(null);

    // Get user location
    const getUserLocation = () => {
        setIsLocating(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Got location:', latitude, longitude);
                setUserLocation([longitude, latitude]);
                setViewState(prev => ({
                    ...prev,
                    longitude,
                    latitude,
                    zoom: 14
                }));
                setLocationError(null);
                setIsLocating(false);
            },
            (error) => {
                console.error('Geolocation error:', error.code, error.message);
                let errorMessage = '';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please allow location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable. Please check your device GPS.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage = `Unable to get location: ${error.message}`;
                }
                setLocationError(errorMessage);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: false,  // Set to false for faster response
                timeout: 30000,  // Increased timeout to 30 seconds
                maximumAge: 60000  // Allow cached position up to 1 minute old
            }
        );
    };

    // Try to get location on mount
    useEffect(() => {
        getUserLocation();
    }, []);

    // Filter logic - only re-filter on search/type changes, not on viewState changes
    useEffect(() => {
        let result = hospitals;

        if (selectedType !== 'All') {
            if (selectedType === 'Female Doctors') {
                result = result.filter(h => h.hasFemaleDoctor);
            } else {
                result = result.filter(h => h.type === selectedType);
            }
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(h =>
                h.name.toLowerCase().includes(query) ||
                h.address.toLowerCase().includes(query) ||
                h.services.some(s => s.toLowerCase().includes(query))
            );
        }

        // Sort by rating (highest first) instead of distance to avoid reordering on map move
        result = [...result].sort((a, b) => b.rating - a.rating);

        setFilteredHospitals(result);
    }, [searchQuery, selectedType]);

    // Fly to hospital when selected
    useEffect(() => {
        if (selectedHospital) {
            // First update the view state
            setViewState(prev => ({
                ...prev,
                longitude: selectedHospital.longitude,
                latitude: selectedHospital.latitude,
                zoom: 15
            }));

            // Delay showing popup to allow map to settle after flying
            const timer = setTimeout(() => {
                setPopupInfo(selectedHospital);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [selectedHospital]);

    const filterTypes = [
        { key: 'All', label: 'All', icon: null },
        { key: 'Hospital', label: 'Hospitals', icon: <Building2Icon /> },
        { key: 'Clinic', label: 'Clinics', icon: <StethoscopeIcon /> },
        { key: 'Pharmacy', label: 'Pharmacies', icon: <PillIcon /> },
        { key: 'Lab', label: 'Labs', icon: <TestTubeIcon /> },
        { key: 'Female Doctors', label: 'Female Doctors', icon: <UserCheckIcon /> }
    ];

    return (
        <div style={styles.container}>

            {/* ===== HEADER ===== */}
            <div style={styles.header}>
                <div style={styles.searchRow}>
                    {/* Search Input */}
                    <div style={styles.searchContainer}>
                        <span style={{ color: '#ff6b9c', marginRight: 12, display: 'flex' }}>
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            placeholder="Search hospitals, clinics, specialties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {/* View Toggle */}
                    <div style={styles.viewToggle}>
                        {['map', 'list'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                style={{
                                    padding: '0 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    backgroundColor: viewMode === mode ? '#ff6b9c' : 'transparent',
                                    color: viewMode === mode ? 'white' : '#64748b',
                                    transition: 'all 0.2s ease',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Chips */}
                <div style={styles.filterContainer}>
                    {filterTypes.map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => setSelectedType(key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: selectedType === key ? '2px solid #ff6b9c' : '2px solid transparent',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 600,
                                backgroundColor: selectedType === key ? '#ff6b9c' : 'white',
                                color: selectedType === key ? 'white' : '#475569',
                                boxShadow: selectedType === key
                                    ? '0 4px 12px rgba(255,107,156,0.3)'
                                    : '0 1px 4px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div style={styles.mainContent}>

                {/* Map Section */}
                <div style={{
                    ...styles.mapSection,
                    display: viewMode === 'list' ? 'none' : 'block'
                }}>
                    <Map
                        ref={mapRef}
                        {...viewState}
                        onMove={evt => setViewState(evt.viewState)}
                        onClick={(e) => {
                            // Only close popup if clicking on empty map (not on a marker)
                            if (!e.originalEvent.defaultPrevented) {
                                setPopupInfo(null);
                                setSelectedHospital(null);
                            }
                        }}
                        style={{ width: '100%', height: '100%' }}
                        mapStyle={MAP_STYLE}
                    >
                        {/* Navigation Controls */}
                        <NavigationControl position="bottom-right" />

                        {/* User Location Marker */}
                        {userLocation && (
                            <Marker
                                longitude={userLocation[0]}
                                latitude={userLocation[1]}
                                anchor="center"
                            >
                                <div style={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: '#4285F4',
                                    border: '3px solid white',
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 10px rgba(66, 133, 244, 0.5)'
                                }} />
                            </Marker>
                        )}

                        {/* Hospital Markers */}
                        {filteredHospitals.map((hospital) => (
                            <Marker
                                key={hospital.id}
                                longitude={hospital.longitude}
                                latitude={hospital.latitude}
                                anchor="bottom"
                                onClick={e => {
                                    e.originalEvent.stopPropagation();
                                    setSelectedHospital(hospital);
                                    setPopupInfo(hospital);
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        backgroundColor: getMarkerColor(hospital.type, selectedHospital?.id === hospital.id),
                                        borderRadius: '50% 50% 50% 0',
                                        transform: 'rotate(-45deg)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: selectedHospital?.id === hospital.id ? '3px solid white' : 'none'
                                    }}
                                >
                                    <div style={{ transform: 'rotate(45deg)', color: 'white' }}>
                                        {getFacilityIcon(hospital.type)}
                                    </div>
                                </div>
                            </Marker>
                        ))}

                        {/* Popup */}
                        {popupInfo && (
                            <Popup
                                longitude={popupInfo.longitude}
                                latitude={popupInfo.latitude}
                                anchor="bottom"
                                onClose={() => setPopupInfo(null)}
                                closeButton={true}
                                closeOnClick={false}
                                offset={40}
                            >
                                <div style={{ padding: '8px 4px', minWidth: 180 }}>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                                        {popupInfo.name}
                                    </h4>
                                    <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#64748b' }}>
                                        {popupInfo.type}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                                        <StarIcon filled />
                                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{popupInfo.rating}</span>
                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>({popupInfo.reviews})</span>
                                    </div>
                                    <button
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${popupInfo.latitude},${popupInfo.longitude}`, '_blank')}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            backgroundColor: '#ff6b9c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <NavigationIcon />
                                        Get Directions
                                    </button>
                                </div>
                            </Popup>
                        )}
                    </Map>

                    {/* Custom Locate Me Button */}
                    <button
                        onClick={getUserLocation}
                        disabled={isLocating}
                        style={{
                            ...styles.locateButton,
                            backgroundColor: isLocating ? '#f0f0f0' : userLocation ? '#e8f4fd' : 'white'
                        }}
                        title="Find my location"
                    >
                        {isLocating ? (
                            <span style={{ color: '#4285F4' }}><LoaderIcon /></span>
                        ) : (
                            <span style={{ color: userLocation ? '#4285F4' : '#666' }}><CrosshairIcon /></span>
                        )}
                    </button>

                    {/* Location Error Toast */}
                    {locationError && (
                        <div style={{
                            position: 'absolute',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            padding: '10px 20px',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 500,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 100,
                            maxWidth: '80%',
                            textAlign: 'center'
                        }}>
                            {locationError}
                        </div>
                    )}
                </div>

                {/* ===== SIDEBAR ===== */}
                <div style={{
                    ...styles.sidebar,
                    width: viewMode === 'list' ? '100%' : '380px',
                    minWidth: viewMode === 'list' ? '100%' : '380px'
                }}>
                    {/* Sidebar Header */}
                    <div style={styles.sidebarHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #ff6b9c 0%, #ff8fb3 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(255,107,156,0.3)',
                                color: 'white'
                            }}>
                                <MapPinIcon />
                            </div>
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    color: '#1e293b'
                                }}>
                                    {filteredHospitals.length} Facilities Found
                                </h3>
                                <p style={{
                                    margin: '2px 0 0',
                                    fontSize: '12px',
                                    color: '#64748b'
                                }}>
                                    {userLocation ? 'Near your location' : 'Sorted by distance'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Cards */}
                    <div style={styles.cardList} ref={cardListRef}>
                        {filteredHospitals.map((hospital) => {
                            const isSelected = selectedHospital?.id === hospital.id;
                            const isHovered = hoveredCard === hospital.id;

                            return (
                                <div
                                    key={hospital.id}
                                    data-hospital-id={hospital.id}
                                    onClick={(e) => {
                                        // Prevent scroll to top by not changing scroll position
                                        const scrollTop = cardListRef.current?.scrollTop;
                                        setSelectedHospital(hospital);
                                        // Restore scroll position after React re-renders
                                        requestAnimationFrame(() => {
                                            if (cardListRef.current && scrollTop !== undefined) {
                                                cardListRef.current.scrollTop = scrollTop;
                                            }
                                        });
                                    }}
                                    onMouseEnter={() => setHoveredCard(hospital.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        padding: '16px',
                                        marginBottom: '10px',
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? '#fff5f8' : 'white',
                                        border: isSelected
                                            ? '2px solid #ff6b9c'
                                            : isHovered
                                                ? '2px solid rgba(255,107,156,0.3)'
                                                : '2px solid #f1f5f9',
                                        boxShadow: isSelected
                                            ? '0 6px 20px rgba(255,107,156,0.15)'
                                            : isHovered
                                                ? '0 4px 16px rgba(0,0,0,0.06)'
                                                : '0 2px 6px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s ease',
                                        transform: isHovered && !isSelected ? 'translateY(-2px)' : 'none'
                                    }}
                                >
                                    {/* Card Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                                            <div style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                backgroundColor: getMarkerColor(hospital.type, false) + '15',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: getMarkerColor(hospital.type, false),
                                                flexShrink: 0
                                            }}>
                                                {getFacilityIcon(hospital.type)}
                                            </div>
                                            <div>
                                                <h4 style={{
                                                    margin: 0,
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: '#1e293b',
                                                    lineHeight: 1.3
                                                }}>
                                                    {hospital.name}
                                                </h4>
                                                <p style={{
                                                    margin: '2px 0 0',
                                                    fontSize: '11px',
                                                    color: '#64748b',
                                                    fontWeight: 500
                                                }}>
                                                    {hospital.type}
                                                </p>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            backgroundColor: hospital.isOpen ? '#dcfce7' : '#fee2e2',
                                            color: hospital.isOpen ? '#15803d' : '#dc2626',
                                            textTransform: 'uppercase'
                                        }}>
                                            {hospital.isOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </div>

                                    {/* Rating */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <StarIcon filled />
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{hospital.rating}</span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>({hospital.reviews} reviews)</span>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isSelected && (
                                        <div style={{
                                            paddingTop: '12px',
                                            borderTop: '1px dashed #e2e8f0',
                                            animation: 'fadeIn 0.25s ease'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                                <span style={{ marginTop: 2, flexShrink: 0, color: '#64748b' }}><MapPinIcon /></span>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                                                    {hospital.address}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                <span style={{ color: '#64748b' }}><ClockIcon /></span>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                                                    {hospital.operatingHours.Monday}
                                                </p>
                                            </div>

                                            {/* Services */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                                                {hospital.services.slice(0, 4).map((service, idx) => (
                                                    <span key={idx} style={{
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#f1f5f9',
                                                        color: '#475569'
                                                    }}>
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`, '_blank');
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        padding: '10px',
                                                        borderRadius: '10px',
                                                        border: 'none',
                                                        background: 'linear-gradient(135deg, #ff6b9c 0%, #ff8fb3 100%)',
                                                        color: 'white',
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        boxShadow: '0 4px 12px rgba(255,107,156,0.3)'
                                                    }}>
                                                    <NavigationIcon />
                                                    Directions
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`tel:${hospital.phone}`, '_self');
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        padding: '10px',
                                                        borderRadius: '10px',
                                                        border: '2px solid #ff6b9c',
                                                        backgroundColor: 'white',
                                                        color: '#ff6b9c',
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        cursor: 'pointer'
                                                    }}>
                                                    <PhoneIcon />
                                                    Call
                                                </button>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/facility/${hospital.id}`);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    padding: '10px',
                                                    borderRadius: '10px',
                                                    border: '1px solid #e2e8f0',
                                                    backgroundColor: '#f8fafc',
                                                    color: '#475569',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}>
                                                View Full Details
                                                <ChevronRightIcon />
                                            </button>
                                        </div>
                                    )}

                                    {/* View Details */}
                                    {!isSelected && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            color: '#ff6b9c',
                                            fontSize: '12px',
                                            fontWeight: 600
                                        }}>
                                            View details
                                            <ChevronRightIcon />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .maplibregl-popup-content {
                    border-radius: 12px !important;
                    padding: 12px !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
                }
                .maplibregl-popup-close-button {
                    font-size: 18px !important;
                    padding: 4px 8px !important;
                }
                .maplibregl-ctrl-group {
                    border-radius: 10px !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                    overflow: hidden !important;
                }
                .maplibregl-ctrl-group button {
                    width: 36px !important;
                    height: 36px !important;
                }
            `}</style>
        </div>
    );
};

export default FindCare;
