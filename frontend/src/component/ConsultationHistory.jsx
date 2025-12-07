import React from 'react';

const ConsultationHistory = ({ consultations }) => {
    return (
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
                        {consultations.map(consult => (
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
    );
};

export default ConsultationHistory;
