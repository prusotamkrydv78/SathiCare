import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AppointmentCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data for Appointments
    const [appointments, setAppointments] = useState([
        { id: 1, day: 24, title: 'Prenatal Checkup', type: 'Checkup', time: '10:00 AM', location: 'City Hospital', color: 'bg-blue-100 text-blue-600', icon: '🩺' },
        { id: 2, day: 24, title: 'Blood Test', type: 'Lab', time: '11:30 AM', location: 'Medicare Lab', color: 'bg-red-100 text-red-600', icon: '🩸' },
        { id: 3, day: 28, title: 'Ultrasound Scan', type: 'Scan', time: '02:00 PM', location: 'Women\'s Clinic', color: 'bg-purple-100 text-purple-600', icon: '🔍' },
        { id: 4, day: 15, title: 'Dentist', type: 'Other', time: '04:00 PM', location: 'Smile Dental', color: 'bg-yellow-100 text-yellow-600', icon: '🦷' },
    ]);

    // Calendar Generation Logic (Simple implementation for current month)
    const daysInMonth = 31; // assuming Oct/Dec etc.
    const startDayOffset = 3; // Starting on a Wednesday for example mock

    const days = [];
    for (let i = 0; i < startDayOffset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    // Get appointments for selected day
    const activeAppointments = appointments.filter(appt => appt.day === selectedDate);

    // Modal Form State
    const [newAppt, setNewAppt] = useState({ title: '', type: 'Checkup', date: '', time: '', location: '', notes: '' });

    const handleSave = () => {
        // Mock save logic setup for demonstration
        console.log("Saving", newAppt);
        setIsModalOpen(false);
        // In real app, would convert date string to 'day' and add to state
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-text-dark pb-24">

            {/* Header */}
            <div className="bg-white p-5 sticky top-0 z-20 shadow-sm border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
                    <h1 className="text-xl font-bold text-gray-800">Calendar</h1>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-pink text-white px-4 py-2 rounded-full font-bold text-sm shadow-md hover:bg-pink-500 transition"
                >
                    + Add
                </button>
            </div>

            <div className="p-4 max-w-2xl mx-auto">
                {/* Calendar Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    {/* Month Header */}
                    <div className="bg-pink-50 p-4 flex justify-between items-center border-b border-pink-100">
                        <button className="text-pink-400 font-bold hover:text-pink-600">‹</button>
                        <h2 className="text-lg font-bold text-gray-800">October 2025</h2>
                        <button className="text-pink-400 font-bold hover:text-pink-600">›</button>
                    </div>

                    {/* Week Days Header */}
                    <div className="grid grid-cols-7 text-center py-3 border-b border-gray-50">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-xs font-bold text-gray-400">{d}</div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 text-center p-2">
                        {days.map((day, index) => {
                            const hasAppt = day && appointments.find(a => a.day === day);
                            const isSelected = day === selectedDate;

                            return (
                                <div key={index} className="p-1">
                                    {day ? (
                                        <button
                                            onClick={() => setSelectedDate(day)}
                                            className={`
                                                w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full flex flex-col items-center justify-center relative transition
                                                ${isSelected ? 'bg-primary-pink text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                                            `}
                                        >
                                            <span className="text-sm font-medium leading-none">{day}</span>
                                            {/* Dots */}
                                            {hasAppt && !isSelected && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary-pink mt-1"></span>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="w-8 h-8"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Day Agenda */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 ml-1">Appointments for Oct {selectedDate}</h3>

                    {activeAppointments.length > 0 ? (
                        activeAppointments.map(appt => (
                            <div key={appt.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-primary-pink border-y border-r border-gray-100 flex justify-between items-start group">
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-full ${appt.color} flex items-center justify-center text-xl shrink-0`}>
                                        {appt.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{appt.title}</h4>
                                        <p className="text-gray-500 text-sm mt-0.5">{appt.time} • {appt.location}</p>

                                        <div className="mt-3 flex items-center gap-2">
                                            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer bg-gray-50 px-2 py-1 rounded-md hover:bg-gray-100 transition">
                                                <input type="checkbox" defaultChecked className="text-primary-pink rounded border-gray-300 focus:ring-primary-pink" />
                                                Reminder On
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 opactiy-100 md:opacity-0 group-hover:opacity-100 transition">
                                    <button className="p-2 text-gray-300 hover:text-blue-500 transition">✎</button>
                                    <button className="p-2 text-gray-300 hover:text-red-500 transition">🗑</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm">No appointments on this day.</p>
                            <button onClick={() => setIsModalOpen(true)} className="text-primary-pink font-bold text-sm mt-2 hover:underline">Add New</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Appointment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-pink-50">
                            <h3 className="font-bold text-gray-800">Add New Appointment</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Type</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-pink/50">
                                    <option>Checkup</option>
                                    <option>Ultrasound</option>
                                    <option>Blood Test</option>
                                    <option>Vaccination</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Date</label>
                                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Time</label>
                                    <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Location</label>
                                <input type="text" placeholder="e.g. City Hospital" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Reminders</label>
                                <div className="flex gap-4 mt-1">
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input type="checkbox" className="text-primary-pink rounded focus:ring-primary-pink" /> 1 Day Before
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input type="checkbox" className="text-primary-pink rounded focus:ring-primary-pink" /> 1 Hour Before
                                    </label>
                                </div>
                            </div>
                            <button className="w-full bg-primary-pink text-white font-bold py-3 mt-4 rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-500 transition">
                                Save Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentCalendar;
