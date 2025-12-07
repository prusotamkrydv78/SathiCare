import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HealthRecords = () => {
    const [isLocked, setIsLocked] = useState(true);
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const filters = ['All', 'Prescriptions', 'Lab Reports', 'X-rays', 'Ultrasounds', 'Other'];

    // Mock Data
    const records = [
        { id: 1, title: 'Blood Test Results', date: 'Oct 24, 2025', type: 'Lab Report', color: 'bg-blue-100 text-blue-600', format: 'pdf' },
        { id: 2, title: 'Antibiotics Prescription', date: 'Sep 12, 2025', type: 'Prescription', color: 'bg-green-100 text-green-600', format: 'img' },
        { id: 3, title: 'Chest X-Ray', date: 'Aug 05, 2025', type: 'X-rays', color: 'bg-gray-200 text-gray-700', format: 'img' },
        { id: 4, title: 'Annual Checkup', date: 'Jul 20, 2025', type: 'Other', color: 'bg-purple-100 text-purple-600', format: 'pdf' },
        { id: 5, title: 'Ultrasound Scan', date: 'Jun 15, 2025', type: 'Ultrasounds', color: 'bg-pink-100 text-pink-600', format: 'img' },
    ];

    const handlePinChange = (index, value) => {
        if (value.length > 1) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            document.getElementById(`pin-${index + 1}`).focus();
        }

        // Check PIN when filled
        if (index === 3 && value) {
            const enteredPin = newPin.join('');
            // Mock PIN check (Default 1234)
            if (enteredPin === '1234') {
                setIsLocked(false);
            } else {
                setError('Incorrect PIN. Try 1234.');
                setPin(['', '', '', '']);
                document.getElementById('pin-0').focus();
            }
        }
    };

    const filteredRecords = activeFilter === 'All'
        ? records
        : records.filter(r => r.type === activeFilter);

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] font-sans text-gray-800">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-sm w-full">
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                        🔒
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Secure Records</h2>
                    <p className="text-gray-500 text-sm mb-8">Enter your 4-digit PIN to access your health data.</p>

                    <div className="flex justify-center gap-3 mb-6">
                        {pin.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`pin-${idx}`}
                                type="password"
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handlePinChange(idx, e.target.value)}
                                className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:border-primary-pink focus:outline-none transition"
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-sm font-bold mb-4 animate-shake">{error}</p>}

                    <button className="text-xs text-gray-400 hover:text-primary-pink font-medium">Forgot PIN?</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-text-dark pb-24">
            {/* Header */}
            <div className="bg-white p-5 sticky top-0 z-20 shadow-sm border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
                        <h1 className="text-xl font-bold text-gray-800">My Records</h1>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-pink' : 'text-gray-400'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-pink' : 'text-gray-400'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Upload Button */}
                <button className="w-full bg-primary-pink text-white font-bold py-3 rounded-xl shadow-md hover:bg-pink-500 transition flex justify-center items-center gap-2 mb-4">
                    <span className="text-lg">+</span> Upload New Record
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white sticky top-[156px] z-10 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)]">
                <div className="flex overflow-x-auto no-scrollbar px-4 space-x-4 border-b border-gray-100 py-3">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border
                                ${activeFilter === filter
                                    ? 'bg-gray-800 text-white border-gray-800'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}
                            `}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4">
                {filteredRecords.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl text-gray-300">📂</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-700">No records found</h3>
                        <p className="text-gray-400 text-sm mt-1 max-w-xs">Upload your prescriptions, reports, and scans to keep them organized.</p>
                    </div>
                ) : (
                    // Records List/Grid
                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-3'}>
                        {filteredRecords.map(record => (
                            <div key={record.id} className={`bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-md transition relative flex ${viewMode === 'list' ? 'flex-row p-3 items-center' : 'flex-col'}`}>

                                {/* Thumbnail */}
                                <div className={`${viewMode === 'list' ? 'w-16 h-16 mr-4 rounded-lg' : 'h-32 w-full'} bg-gray-50 flex items-center justify-center relative overflow-hidden`}>
                                    {record.format === 'pdf' ? (
                                        <span className="text-3xl">📄</span>
                                    ) : (
                                        <span className="text-3xl">🖼️</span>
                                    )}
                                    {/* Type Badge (Grid only) */}
                                    {viewMode === 'grid' && (
                                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${record.color} shadow-sm`}>
                                            {record.type}
                                        </span>
                                    )}
                                </div>

                                {/* Details */}
                                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-3'}`}>
                                    <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1 truncate">{record.title}</h3>
                                    <p className="text-xs text-gray-400">{record.date}</p>

                                    {/* Type Badge (List only) */}
                                    {viewMode === 'list' && (
                                        <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${record.color}`}>
                                            {record.type}
                                        </span>
                                    )}
                                </div>

                                {/* Menu Action */}
                                <button className={`text-gray-400 hover:text-gray-600 p-2 ${viewMode === 'list' ? '' : 'absolute top-1 right-1'}`}>
                                    ⋮
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthRecords;
