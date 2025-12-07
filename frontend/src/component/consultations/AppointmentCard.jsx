import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MessageSquare } from 'lucide-react';

const AppointmentCard = ({ appointment, onCancel }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'completed':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleJoinChat = () => {
        navigate(`/consultations/${appointment._id}/chat`);
    };

    // Get doctor info from doctorId (populated) or doctor field
    const doctorInfo = appointment.doctorId || appointment.doctor || {};
    const doctorName = doctorInfo.name || 'Dr. Unknown';
    const doctorSpecialty = doctorInfo.specialization || doctorInfo.specialty || 'Specialist';

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-pink to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-md">
                        👨‍⚕️
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{doctorName}</h3>
                        <p className="text-sm text-gray-600">{doctorSpecialty}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appointment.status)}`}>
                                {appointment.status?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(appointment.scheduledDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{appointment.scheduledTime}</span>
                </div>
            </div>

            {appointment.reason && (
                <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl">
                    <strong>Reason:</strong> {appointment.reason}
                </p>
            )}

            <div className="flex gap-2">
                {appointment.status === 'accepted' && (
                    <>
                        <button
                            onClick={handleJoinChat}
                            className="flex-1 bg-gradient-to-r from-primary-pink to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Join Chat
                        </button>
                        <button
                            onClick={() => onCancel(appointment._id)}
                            className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
                        >
                            Cancel
                        </button>
                    </>
                )}
                {appointment.status === 'pending' && (
                    <button
                        onClick={() => onCancel(appointment._id)}
                        className="flex-1 bg-red-50 border border-red-200 text-red-600 py-2 rounded-xl font-semibold hover:bg-red-100 transition"
                    >
                        Cancel Request
                    </button>
                )}
                {appointment.status === 'completed' && (
                    <div className="flex-1 text-center py-2 text-gray-500 text-sm">
                        Consultation completed
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;
