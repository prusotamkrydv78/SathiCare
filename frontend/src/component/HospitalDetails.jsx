import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import hospitalsData from '../data/hospitals.json';

const hospitals = hospitalsData.hospitals;

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// Icon components
const StarIcon = ({ size = 16, filled }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "#e2e8f0"} stroke={filled ? "#f59e0b" : "#e2e8f0"} strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const NavigationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
    </svg>
);

const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const MapPinIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const ClockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"></path>
    </svg>
);

const GlobeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#ff6b9c" : "none"} stroke={filled ? "#ff6b9c" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
);

const Share2Icon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
);

const Building2Icon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
        <circle cx="20" cy="10" r="2"></circle>
    </svg>
);

const PillIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
        <path d="m8.5 8.5 7 7"></path>
    </svg>
);

const TestTubeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const MessageSquareIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
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

const getTypeColor = (type) => {
    switch (type) {
        case 'Hospital': return '#ef4444';
        case 'Clinic': return '#3b82f6';
        case 'Pharmacy': return '#22c55e';
        case 'Lab': return '#8b5cf6';
        default: return '#64748b';
    }
};

const HospitalDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const found = hospitals.find(h => h.id === id);
        if (found) {
            setHospital(found);
            setReviews(found.userReviews || []);
        }
    }, [id]);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!reviewName.trim() || !reviewComment.trim() || reviewRating === 0) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const newReview = {
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment
            };

            setReviews([newReview, ...reviews]);
            setReviewName('');
            setReviewRating(0);
            setReviewComment('');
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setShowReviewForm(false);

            setTimeout(() => setSubmitSuccess(false), 3000);
        }, 500);
    };

    if (!hospital) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
                <p>Hospital not found</p>
            </div>
        );
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#faf8f9',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
            {/* Back Button */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'white',
                padding: '12px 20px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <button
                    onClick={() => navigate('/find-care')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#475569'
                    }}
                >
                    <ChevronLeftIcon />
                    Back to Search
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => {
                            navigator.share?.({
                                title: hospital.name,
                                text: hospital.description,
                                url: window.location.href
                            });
                        }}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: '1px solid #e2e8f0',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Share2Icon />
                    </button>
                    <button
                        onClick={() => setIsSaved(!isSaved)}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: '1px solid #e2e8f0',
                            backgroundColor: isSaved ? '#fff5f8' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <HeartIcon filled={isSaved} />
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px', paddingBottom: 60 }}>
                {/* Two Column Layout for Desktop */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: 32,
                    alignItems: 'start'
                }}>
                    {/* Left Column - Main Info */}
                    <div>
                        {/* Image Carousel */}
                        <div style={{
                            position: 'relative',
                            borderRadius: 20,
                            overflow: 'hidden',
                            marginBottom: 24,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                            <img
                                src={hospital.images[currentImageIndex]}
                                alt={hospital.name}
                                style={{
                                    width: '100%',
                                    height: 320,
                                    objectFit: 'cover'
                                }}
                            />
                            {hospital.images.length > 1 && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: 8
                                }}>
                                    {hospital.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                border: 'none',
                                                backgroundColor: currentImageIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hospital Name & Rating */}
                        <h1 style={{
                            margin: '0 0 12px',
                            fontSize: 32,
                            fontWeight: 700,
                            color: '#1e293b'
                        }}>
                            {hospital.name}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        size={18}
                                        filled={i < Math.floor(hospital.rating)}
                                    />
                                ))}
                                <span style={{ marginLeft: 6, fontSize: 16, fontWeight: 700, color: '#334155' }}>
                                    {hospital.rating}
                                </span>
                                <span style={{ fontSize: 14, color: '#94a3b8' }}>
                                    ({reviews.length} Reviews)
                                </span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 16px',
                                borderRadius: 24,
                                backgroundColor: getTypeColor(hospital.type) + '15',
                                color: getTypeColor(hospital.type),
                                fontSize: 14,
                                fontWeight: 600
                            }}>
                                {getFacilityIcon(hospital.type)}
                                {hospital.type}
                            </span>
                            {hospital.hasFemaleDoctor && (
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '8px 16px',
                                    borderRadius: 24,
                                    backgroundColor: '#ff6b9c15',
                                    color: '#ff6b9c',
                                    fontSize: 14,
                                    fontWeight: 600
                                }}>
                                    <UserCheckIcon />
                                    Female doctors available
                                </span>
                            )}
                            <span style={{
                                padding: '8px 16px',
                                borderRadius: 24,
                                backgroundColor: hospital.isOpen ? '#dcfce7' : '#fee2e2',
                                color: hospital.isOpen ? '#15803d' : '#dc2626',
                                fontSize: 14,
                                fontWeight: 600
                            }}>
                                {hospital.isOpen ? 'Open Now' : 'Closed'}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                            <button
                                onClick={() => window.open(`tel:${hospital.phone}`, '_self')}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    padding: '16px',
                                    borderRadius: 14,
                                    border: '2px solid #ff6b9c',
                                    backgroundColor: 'white',
                                    color: '#ff6b9c',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <PhoneIcon />
                                Call
                            </button>
                            <button
                                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`, '_blank')}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    padding: '16px',
                                    borderRadius: 14,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #ff6b9c 0%, #ff8fb3 100%)',
                                    color: 'white',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(255,107,156,0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <NavigationIcon />
                                Directions
                            </button>
                            <button
                                onClick={() => setIsSaved(!isSaved)}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    padding: '16px',
                                    borderRadius: 14,
                                    border: '2px solid #e2e8f0',
                                    backgroundColor: isSaved ? '#fff5f8' : 'white',
                                    color: isSaved ? '#ff6b9c' : '#64748b',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <HeartIcon filled={isSaved} />
                                Save
                            </button>
                        </div>

                        {/* Description */}
                        <p style={{
                            fontSize: 16,
                            lineHeight: 1.7,
                            color: '#475569',
                            marginBottom: 28
                        }}>
                            {hospital.description}
                        </p>

                        {/* Address Card with Map */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 24,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                            border: '1px solid #f1f5f9',
                            marginBottom: 20
                        }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                                Location
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                                <span style={{ marginTop: 2, flexShrink: 0, color: '#ff6b9c' }}><MapPinIcon size={18} /></span>
                                <p style={{ margin: 0, fontSize: 15, color: '#475569', lineHeight: 1.5 }}>
                                    {hospital.address}
                                </p>
                            </div>
                            <div style={{ borderRadius: 16, overflow: 'hidden', height: 220 }}>
                                <Map
                                    initialViewState={{
                                        longitude: hospital.longitude,
                                        latitude: hospital.latitude,
                                        zoom: 14
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                    mapStyle={MAP_STYLE}
                                    interactive={false}
                                >
                                    <Marker longitude={hospital.longitude} latitude={hospital.latitude}>
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            backgroundColor: '#ff6b9c',
                                            borderRadius: '50% 50% 50% 0',
                                            transform: 'rotate(-45deg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 3px 10px rgba(255,107,156,0.4)'
                                        }}>
                                            <span style={{ transform: 'rotate(45deg)', color: 'white' }}><MapPinIcon size={16} /></span>
                                        </div>
                                    </Marker>
                                </Map>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>


                        {/* Operating Hours Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            padding: 20,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: '#ff6b9c' }}><ClockIcon /></span>
                                Operating Hours
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {days.map(day => (
                                    <div
                                        key={day}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: day === today ? '8px 12px' : '0',
                                            backgroundColor: day === today ? '#fff5f8' : 'transparent',
                                            borderRadius: 8
                                        }}
                                    >
                                        <span style={{
                                            fontSize: 14,
                                            color: day === today ? '#ff6b9c' : '#64748b',
                                            fontWeight: day === today ? 600 : 400
                                        }}>
                                            {day} {day === today && '(Today)'}
                                        </span>
                                        <span style={{
                                            fontSize: 14,
                                            color: hospital.operatingHours[day] === 'Closed' ? '#dc2626' : day === today ? '#ff6b9c' : '#334155',
                                            fontWeight: day === today ? 600 : 500
                                        }}>
                                            {hospital.operatingHours[day]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Services Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            padding: 20,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                                Services Offered
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {hospital.services.map((service, idx) => (
                                    <span key={idx} style={{
                                        padding: '8px 16px',
                                        borderRadius: 20,
                                        backgroundColor: '#f8fafc',
                                        color: '#475569',
                                        fontSize: 13,
                                        fontWeight: 500,
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            padding: 20,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                                Contact Information
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <a href={`tel:${hospital.phone}`} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    textDecoration: 'none',
                                    color: '#475569',
                                    fontSize: 14
                                }}>
                                    <span style={{ color: '#ff6b9c' }}><PhoneIcon /></span>
                                    {hospital.phone}
                                </a>
                                {hospital.email && (
                                    <a href={`mailto:${hospital.email}`} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        textDecoration: 'none',
                                        color: '#475569',
                                        fontSize: 14
                                    }}>
                                        <span style={{ color: '#ff6b9c' }}><MailIcon /></span>
                                        {hospital.email}
                                    </a>
                                )}
                                {hospital.website && (
                                    <a href={`https://${hospital.website}`} target="_blank" rel="noopener noreferrer" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        textDecoration: 'none',
                                        color: '#475569',
                                        fontSize: 14
                                    }}>
                                        <span style={{ color: '#ff6b9c' }}><GlobeIcon /></span>
                                        {hospital.website}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Write a Review Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            padding: 20,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            border: '1px solid #f1f5f9'
                        }}>
                            {/* Header with Toggle Button */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: showReviewForm ? 16 : 0
                            }}>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#ff6b9c' }}><MessageSquareIcon /></span>
                                    Write a Review
                                </h3>
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '8px 16px',
                                        borderRadius: 20,
                                        border: 'none',
                                        background: showReviewForm ? '#f1f5f9' : 'linear-gradient(135deg, #ff6b9c 0%, #ff8fb3 100%)',
                                        color: showReviewForm ? '#64748b' : 'white',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        boxShadow: showReviewForm ? 'none' : '0 2px 8px rgba(255,107,156,0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {showReviewForm ? (
                                        <>
                                            <XIcon />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <PlusIcon />
                                            Add Review
                                        </>
                                    )}
                                </button>
                            </div>

                            {submitSuccess && (
                                <div style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#dcfce7',
                                    borderRadius: 10,
                                    marginBottom: 16,
                                    marginTop: 16,
                                    color: '#15803d',
                                    fontSize: 14,
                                    fontWeight: 500
                                }}>
                                    ✓ Thank you! Your review has been submitted.
                                </div>
                            )}

                            {/* Review Form - Collapsible */}
                            {showReviewForm && (
                                <form onSubmit={handleSubmitReview} style={{ marginTop: 16 }}>
                                    {/* Name Input */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            value={reviewName}
                                            onChange={(e) => setReviewName(e.target.value)}
                                            placeholder="Enter your name"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 10,
                                                border: '2px solid #e2e8f0',
                                                fontSize: 14,
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#ff6b9c'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                    </div>

                                    {/* Rating Stars */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                                            Your Rating
                                        </label>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 4,
                                                        transition: 'transform 0.1s'
                                                    }}
                                                >
                                                    <StarIcon
                                                        size={28}
                                                        filled={(hoverRating || reviewRating) >= star}
                                                    />
                                                </button>
                                            ))}
                                            {reviewRating > 0 && (
                                                <span style={{ marginLeft: 8, fontSize: 14, color: '#64748b', alignSelf: 'center' }}>
                                                    {reviewRating === 1 && 'Poor'}
                                                    {reviewRating === 2 && 'Fair'}
                                                    {reviewRating === 3 && 'Good'}
                                                    {reviewRating === 4 && 'Very Good'}
                                                    {reviewRating === 5 && 'Excellent'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Comment Textarea */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                                            Your Experience
                                        </label>
                                        <textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Share your experience with this healthcare facility..."
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 10,
                                                border: '2px solid #e2e8f0',
                                                fontSize: 14,
                                                outline: 'none',
                                                resize: 'vertical',
                                                fontFamily: 'inherit',
                                                transition: 'border-color 0.2s',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#ff6b9c'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !reviewName.trim() || !reviewComment.trim() || reviewRating === 0}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: 12,
                                            border: 'none',
                                            background: (!reviewName.trim() || !reviewComment.trim() || reviewRating === 0)
                                                ? '#e2e8f0'
                                                : 'linear-gradient(135deg, #ff6b9c 0%, #ff8fb3 100%)',
                                            color: (!reviewName.trim() || !reviewComment.trim() || reviewRating === 0) ? '#94a3b8' : 'white',
                                            fontSize: 14,
                                            fontWeight: 700,
                                            cursor: (!reviewName.trim() || !reviewComment.trim() || reviewRating === 0) ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            boxShadow: (!reviewName.trim() || !reviewComment.trim() || reviewRating === 0)
                                                ? 'none'
                                                : '0 4px 14px rgba(255,107,156,0.3)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <SendIcon />
                                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Reviews Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            padding: 20,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                                Reviews ({reviews.length})
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {reviews.map((review, idx) => (
                                    <div key={idx} style={{
                                        paddingBottom: idx < reviews.length - 1 ? 16 : 0,
                                        borderBottom: idx < reviews.length - 1 ? '1px solid #f1f5f9' : 'none'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #ff6b9c 0%, #ff8fb3 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: 16
                                            }}>
                                                {review.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                                                    {review.name}
                                                </p>
                                                <div style={{ display: 'flex', gap: 2 }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            size={12}
                                                            filled={i < review.rating}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
                                            "{review.comment}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDetails;

