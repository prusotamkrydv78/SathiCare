import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Calendar, MessageSquare } from 'lucide-react';

const DoctorCard = ({ doctor, onBook }) => {
    // Handle availability display - check if it's an object or string
    const getAvailability = () => {
        if (!doctor.availability) return 'Available';
        if (typeof doctor.availability === 'string') return doctor.availability;
        if (typeof doctor.availability === 'object') {
            // If availability is an array of slots
            if (Array.isArray(doctor.availability) && doctor.availability.length > 0) {
                return 'Available Today';
            }
            return 'Check Schedule';
        }
        return 'Available';
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary-pink hover:shadow-xl transition cursor-pointer"
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-pink to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                    {doctor.profileImage || doctor.image || '👨‍⚕️'}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{doctor.name}</h3>
                    <p className="text-sm text-primary-pink font-semibold mb-1">
                        {doctor.specialization || doctor.specialty}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{doctor.rating || '4.8'}</span>
                        <span>•</span>
                        <span>{doctor.experience || '10+ years'}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{doctor.hospital || doctor.location || 'Kathmandu, Nepal'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-green-600 font-semibold">{getAvailability()}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onBook(doctor)}
                    className="flex-1 bg-gradient-to-r from-primary-pink to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                    <Calendar className="w-4 h-4" />
                    Book Now
                </button>
                <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <MessageSquare className="w-4 h-4 text-primary-pink" />
                </button>
            </div>
        </motion.div>
    );
};

export default DoctorCard;
