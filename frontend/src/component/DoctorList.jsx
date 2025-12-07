import React from 'react';

const DoctorList = ({ doctors, onBook }) => {
    return (
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
                                <button onClick={() => onBook(doctor)} className="px-6 py-2 bg-primary-pink text-white font-bold text-sm rounded-xl shadow-md hover:bg-pink-600 transition">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DoctorList;
