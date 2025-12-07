import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// EmailJS removed - using FormSubmit instead
import hospitalsData from '../data/hospitals.json';
import emergencyData from '../data/emergencyContacts.json';

// ============================================
// SVG ICONS
// ============================================

const AmbulanceIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="1" y="6" width="15" height="10" rx="2" />
        <path d="M16 8h3l3 3v5h-6V8z" />
        <circle cx="5.5" cy="16" r="2.5" />
        <circle cx="18.5" cy="16" r="2.5" />
        <path d="M8 10v4M6 12h4" strokeLinecap="round" />
    </svg>
);

const WomenHelplineIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21v-2a6.5 6.5 0 0113 0v2" />
    </svg>
);

const ContactIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const LocationIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M12 2a8 8 0 018 8c0 5.33-8 12-8 12S4 15.33 4 10a8 8 0 018-8z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
    >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const NavigationIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
);

// ============================================
// FAQ ACCORDION COMPONENT
// ============================================

const FAQAccordion = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${faq.iconBg}`}>
                                {faq.icon}
                            </div>
                            <span className="font-bold text-gray-800 text-sm">{faq.question}</span>
                        </div>
                        <ChevronDownIcon isOpen={openIndex === index} />
                    </button>

                    <AnimatePresence>
                        {openIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 pt-0">
                                    <ul className="space-y-2 text-gray-600 text-sm pl-13">
                                        {faq.answers.map((answer, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary-pink mt-2 flex-shrink-0"></span>
                                                {answer}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

// ============================================
// SOS PAGE - MAIN COMPONENT
// ============================================

const SOSPage = () => {
    // State
    const [location, setLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [sosTriggered, setSosTriggered] = useState(false);
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [emailStatus, setEmailStatus] = useState('idle'); // idle, sending, success, error
    const [alertSentTo, setAlertSentTo] = useState([]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    // FAQ Data
    const faqData = [
        {
            icon: '⚠️',
            iconBg: 'bg-red-100 text-red-500',
            question: 'When to Call for Help?',
            answers: [
                'Severe pain that doesn\'t go away',
                'Heavy bleeding (soaking through a pad per hour)',
                'High fever or chills',
                'Difficulty breathing',
                'Sudden, severe headache'
            ]
        },
        {
            icon: '🩸',
            iconBg: 'bg-red-100 text-red-500',
            question: 'Recognizing Severe Bleeding',
            answers: [
                'Passing large blood clots',
                'Feeling dizzy, weak, or faint',
                'Cold, clammy skin',
                'Racing heart rate',
                'Bleeding that won\'t stop with pressure'
            ]
        },
        {
            icon: '🤰',
            iconBg: 'bg-pink-100 text-pink-500',
            question: 'Signs of Pregnancy Complications',
            answers: [
                'Fluid leaking from the vagina',
                'Decreased fetal movement',
                'Pain or burning during urination',
                'Swelling in face, hands, or feet',
                'Severe abdominal pain or cramping'
            ]
        },
        {
            icon: '🩹',
            iconBg: 'bg-blue-100 text-blue-500',
            question: 'First Aid for Bleeding',
            answers: [
                'Apply direct pressure with a clean cloth',
                'Keep the injured area elevated',
                'Do NOT remove the cloth if blood soaks through',
                'Add more layers on top if needed',
                'Call ambulance if bleeding doesn\'t stop in 10 minutes'
            ]
        },
        {
            icon: '😮‍💨',
            iconBg: 'bg-purple-100 text-purple-500',
            question: 'Breathing Difficulty - What to Do',
            answers: [
                'Help the person sit upright',
                'Loosen any tight clothing around neck and chest',
                'Open windows for fresh air',
                'If they have an inhaler, help them use it',
                'Call 102 immediately if lips turn blue'
            ]
        }
    ];

    // Get location on mount
    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Calculate nearby hospitals when location changes
    useEffect(() => {
        if (location) {
            const sorted = getSortedHospitals(location.latitude, location.longitude);
            setNearbyHospitals(sorted.slice(0, 3)); // Top 3 nearest
        }
    }, [location]);

    const getCurrentLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setIsLocating(false);
                },
                () => {
                    // Fallback to Janakpur coordinates
                    setLocation({ latitude: 26.7288, longitude: 85.9263, isFallback: true });
                    setIsLocating(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setLocation({ latitude: 26.7288, longitude: 85.9263, isFallback: true });
            setIsLocating(false);
        }
    };

    // Haversine formula for distance calculation
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // Sort hospitals by distance from user location
    const getSortedHospitals = (lat, lon) => {
        return hospitalsData.hospitals
            .filter(h => h.type === 'Hospital')
            .map(hospital => ({
                ...hospital,
                distance: calculateDistance(lat, lon, hospital.latitude, hospital.longitude)
            }))
            .sort((a, b) => a.distance - b.distance);
    };

    // Send emails using FormSubmit (No config needed)
    const sendSOSEmails = async () => {
        if (emailStatus === 'sending') return;

        setEmailStatus('sending');
        setSosTriggered(true);

        const mapsLink = location
            ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
            : 'Location Unavailable';

        const contacts = emergencyData.userContacts;
        if (!contacts || contacts.length === 0) {
            alert("No contacts found!");
            setEmailStatus('idle');
            return;
        }

        const emailPromises = contacts.map(contact => {
            // Using FormSubmit.co - Perfect for hackathons (No API Key required)
            // NOTE: The recipient will need to "Activate" the first time they receive an email.
            return fetch(`https://formsubmit.co/ajax/${contact.email}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `🚨 SOS ALERT! Help Needed!`,
                    message: `🚨 EMERGENCY ALERT FROM SATHICARE 🚨\n\nNAME: SathiCare User\n\nI need urgent help! My current location is:\n${mapsLink}\n\nTime: ${new Date().toLocaleString()}\n\nPlease call me or 102 immediately!`,
                    location: mapsLink,
                    _template: 'table',
                    _captcha: 'false'
                })
            });
        });

        try {
            await Promise.all(emailPromises);
            setEmailStatus('success');
            setAlertSentTo(contacts.map(c => c.id));
            console.log('✅ SOS EMAILS SENT VIA FORMSUBMIT');
        } catch (error) {
            console.error('FAILED TO SEND EMAILS:', error);
            setEmailStatus('error');
            alert('Network error. Calling 102 is recommended.');
        }
    };



    // Quick Dial Data - Updated per request
    const quickDials = [
        {
            id: 1,
            title: 'Ambulance',
            number: '102',
            icon: <AmbulanceIcon />,
            color: 'from-red-400 to-red-500'
        },
        {
            id: 2,
            title: 'Women\'s Helpline',
            number: '1145',
            icon: <WomenHelplineIcon />,
            color: 'from-pink-400 to-pink-500'
        },
        // Contact 1 (Call)
        {
            id: 3,
            title: emergencyData.userContacts[0]?.name.split(' - ')[0] || 'Contact 1',
            number: emergencyData.userContacts[0]?.phoneNumber,
            icon: <ContactIcon />,
            color: 'from-blue-400 to-blue-500',
            subtitle: 'Call'
        },
        // Contact 2 (Call)
        {
            id: 4,
            title: emergencyData.userContacts[1]?.name.split(' - ')[0] || 'Contact 2',
            number: emergencyData.userContacts[1]?.phoneNumber,
            icon: <ContactIcon />,
            color: 'from-purple-400 to-purple-500',
            subtitle: 'Call'
        }
    ];

    return (
        <motion.div
            className="space-y-8 pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="px-2">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    Emergency <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-primary-pink">SOS</span>
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Immediate access to critical services and information.</p>
            </motion.div>

            {/* SOS Button Section */}
            <motion.div variants={itemVariants} className="flex flex-col items-center py-8">
                {/* SOS Button */}
                <div className="relative">
                    {!sosTriggered && (
                        <>
                            <div className="absolute inset-[-20px] bg-red-300 rounded-full opacity-20 animate-ping"></div>
                            <div className="absolute inset-[-10px] bg-red-400 rounded-full opacity-15 animate-pulse"></div>
                        </>
                    )}
                    <motion.button
                        onClick={sendSOSEmails}
                        disabled={emailStatus === 'sending'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${emailStatus === 'success'
                            ? 'bg-gradient-to-br from-green-400 to-green-500'
                            : 'bg-gradient-to-br from-primary-pink to-red-500 hover:shadow-red-300/50'
                            }`}
                    >
                        <span className="text-white text-5xl font-black tracking-wide">
                            {emailStatus === 'sending' ? '...' : (emailStatus === 'success' ? '✓' : 'SOS')}
                        </span>
                    </motion.button>
                </div>

                <p className="text-gray-400 text-sm mt-6 font-medium">
                    {emailStatus === 'success' ? 'Alerts sent to all contacts!' :
                        emailStatus === 'sending' ? 'Sending alerts...' :
                            'Tap to email alert all contacts with location'}
                </p>
            </motion.div>

            {/* Quick Dial Section */}
            <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickDials.map((dial) => (
                        <motion.div
                            key={dial.id}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="bg-white rounded-[1.5rem] p-5 shadow-lg border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-all"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${dial.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
                                {dial.icon}
                            </div>
                            <p className="font-bold text-gray-800 text-sm">{dial.title}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{dial.subtitle || dial.number}</p>

                            <a
                                href={`tel:${dial.number}`}
                                className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-primary-pink to-pink-500 text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-1"
                            >
                                <PhoneIcon /> Call
                            </a>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Nearest Hospitals Section */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold text-gray-800">Nearest Hospitals</h2>
                    {location && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            {location.isFallback ? 'Demo location' : 'Live location'}
                        </span>
                    )}
                </div>

                {nearbyHospitals.length > 0 ? (
                    <div className="space-y-3">
                        {nearbyHospitals.map((hospital, index) => (
                            <motion.div
                                key={hospital.id}
                                whileHover={{ scale: 1.01 }}
                                className={`bg-white rounded-2xl p-4 shadow-lg border transition-all ${index === 0
                                    ? 'border-primary-pink/30 ring-2 ring-primary-pink/10'
                                    : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        {index === 0 && (
                                            <span className="inline-block text-xs font-bold text-primary-pink bg-pink-50 px-2 py-0.5 rounded-full mb-2">
                                                NEAREST
                                            </span>
                                        )}
                                        <h3 className="font-bold text-gray-800 text-sm">{hospital.name}</h3>
                                        <p className="text-gray-400 text-xs mt-1">{hospital.address}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                {hospital.distance.toFixed(1)} km
                                            </span>
                                            {hospital.services?.includes('Emergency') && (
                                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    24h Emergency
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <a
                                            href={`tel:${hospital.phone}`}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-pink to-pink-500 text-white text-xs font-bold hover:opacity-90 transition flex items-center gap-1"
                                        >
                                            <PhoneIcon /> Call
                                        </a>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition flex items-center gap-1"
                                        >
                                            <NavigationIcon /> Route
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                        <div className="text-4xl mb-3">📍</div>
                        <p className="text-gray-500 text-sm">Getting your location...</p>
                    </div>
                )}
            </motion.div>

            {/* FAQ Section */}
            <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Emergency Information</h2>
                <FAQAccordion faqs={faqData} />
            </motion.div>
        </motion.div>
    );
};

export default SOSPage;
