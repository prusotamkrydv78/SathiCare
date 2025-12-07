import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DoctorFilters from './DoctorFilters';
import DoctorList from './DoctorList';
import ConsultationHistory from './ConsultationHistory';

const DoctorConsultations = () => {
    const [activeTab, setActiveTab] = useState('Find Doctors');
    const [notification, setNotification] = useState(null);

    const handleBookAppointment = (doctor) => {
        // Simulate API Booking
        setNotification({
            type: 'success',
            message: `Appointment booked successfully with ${doctor.name}!`
        });

        // Clear notification after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const doctors = [
        {
            id: 1,
            name: 'Dr. Anjali Sharma',
            specialty: 'Gynecologist',
            experience: '12 Years',
            rating: 4.9,
            price: '₹500',
            image: '👩‍⚕️',
            availability: 'Available Today',
            languages: ['English', 'Hindi']
        },
        {
            id: 2,
            name: 'Dr. Priya Desai',
            specialty: 'Obstetrician',
            experience: '8 Years',
            rating: 4.7,
            price: '₹400',
            image: '👩‍⚕️',
            availability: 'Next Available: Tomorrow',
            languages: ['English', 'Marathi']
        },
        {
            id: 3,
            name: 'Dr. Rajesh Kumar',
            specialty: 'Fertility Specialist',
            experience: '15 Years',
            rating: 4.8,
            price: '₹800',
            image: '👨‍⚕️',
            availability: 'Available Today',
            languages: ['English', 'Hindi', 'Gujarati']
        }
    ];

    const pastConsultations = [
        { id: 101, doctor: 'Dr. Anjali Sharma', date: 'Oct 24, 2024', status: 'Completed', notes: 'Routine checkup, BP normal.' },
        { id: 102, doctor: 'Dr. Priya Desai', date: 'Sep 10, 2024', status: 'Completed', notes: 'Discussed diet plan.' }
    ];

    return (
        <div className="font-sans text-gray-800 pb-12 relative">

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in-down">
                    <span className="text-2xl">✅</span>
                    <div>
                        <h4 className="font-bold">Success!</h4>
                        <p className="text-sm">{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-4 text-white hover:text-green-100">✕</button>
                </div>
            )}

            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition">Dashboard</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-600 font-medium">Consultations</span>
                    </div>
                    <h1 className="text-2xl font-bold">Doctor Consultations</h1>
                    <p className="text-gray-500 text-sm">Connect with top specialists for expert advice.</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    {['Find Doctors', 'My Consultations'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${activeTab === tab ? 'bg-primary-pink text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {activeTab === 'Find Doctors' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <DoctorFilters />
                    <DoctorList doctors={doctors} onBook={handleBookAppointment} />
                </div>
            )}

            {activeTab === 'My Consultations' && (
                <ConsultationHistory consultations={pastConsultations} />
            )}

        </div>
    );
};

export default DoctorConsultations;
