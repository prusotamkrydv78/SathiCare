import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DoctorConsultations = () => {
    const [activeTab, setActiveTab] = useState('Find Doctors');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

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
        <div className="font-sans text-gray-800 pb-12">

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

                    {/* Filters (Sidebar) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Specialty</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-pink">
                                        <option>All Specialties</option>
                                        <option>Gynecologist</option>
                                        <option>Obstetrician</option>
                                        <option>Fertility Specialist</option>
                                        <option>Nutritionist</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Languages</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['English', 'Hindi', 'Marathi', 'Gujarati'].map(lang => (
                                            <button key={lang} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium hover:bg-pink-50 hover:border-pink-200">
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                            <h3 className="font-bold text-blue-800 mb-2">Need urgent help?</h3>
                            <p className="text-sm text-blue-700 mb-4">Our AI attendant can triage your symptoms instantly.</p>
                            <Link to="/ai-chat" className="block w-full py-2 bg-blue-500 text-white rounded-xl font-bold text-center text-sm shadow-md hover:bg-blue-600 transition">
                                Start AI Triage
                            </Link>
                        </div>
                    </div>

                    {/* Doctor List */}
                    <div className="lg:col-span-2 space-y-4">
                        {doctors.map(doctor => (
                            <div key={doctor.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
                                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl border border-gray-200 shrink-0">
                                    {doctor.image}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">{doctor.name}</h3>
                                            <p className="text-primary-pink font-medium text-sm">{doctor.specialty}</p>
                                            <p className="text-gray-500 text-xs mt-1">{doctor.experience} experience • {doctor.languages.join(', ')}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 justify-end text-yellow-500 font-bold text-sm">
                                                <span>⭐</span> {doctor.rating}
                                            </div>
                                            <p className="text-gray-800 font-bold mt-1">{doctor.price} <span className="text-gray-400 text-xs font-normal">/ session</span></p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${doctor.availability.includes('Today') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {doctor.availability}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-50 rounded-xl transition">
                                                View Profile
                                            </button>
                                            <button className="px-6 py-2 bg-primary-pink text-white font-bold text-sm rounded-xl shadow-md hover:bg-pink-600 transition">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'My Consultations' && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Past Consultations</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 font-bold">Doctor</th>
                                    <th className="py-3 font-bold">Date</th>
                                    <th className="py-3 font-bold">Status</th>
                                    <th className="py-3 font-bold">Notes</th>
                                    <th className="py-3 font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600">
                                {pastConsultations.map(consult => (
                                    <tr key={consult.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                        <td className="py-4 font-bold text-gray-800">{consult.doctor}</td>
                                        <td className="py-4">{consult.date}</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">{consult.status}</span>
                                        </td>
                                        <td className="py-4 text-gray-500 italic">"{consult.notes}"</td>
                                        <td className="py-4">
                                            <button className="text-primary-pink font-bold hover:underline">View Receipt</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DoctorConsultations;
