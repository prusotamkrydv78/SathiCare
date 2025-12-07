import Doctor from '../models/doctorModel.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = async (req, res) => {
    try {
        const {
            specialization,
            city,
            minRating,
            maxFee,
            search,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter
        const filter = { isActive: true };

        if (specialization) {
            filter.specialization = specialization;
        }

        if (city) {
            filter['address.city'] = city;
        }

        if (minRating) {
            filter.rating = { $gte: parseFloat(minRating) };
        }

        if (maxFee) {
            filter.consultationFee = { $lte: parseInt(maxFee) };
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { hospital: { $regex: search, $options: 'i' } },
                { specialization: { $regex: search, $options: 'i' } }
            ];
        }

        const doctors = await Doctor.find(filter)
            .select('-password')
            .sort({ rating: -1, totalConsultations: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Doctor.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                doctors,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get All Doctors Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctors',
            error: error.message
        });
    }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findById(id).select('-password');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { doctor }
        });
    } catch (error) {
        console.error('Get Doctor Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctor',
            error: error.message
        });
    }
};

// @desc    Get doctor's availability
// @route   GET /api/doctors/:id/availability
// @access  Public
export const getDoctorAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        const doctor = await Doctor.findById(id).select('availability');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // If date provided, get availability for that specific day
        if (date) {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            const dayAvailability = doctor.availability.find(a => a.day === dayName);

            return res.status(200).json({
                success: true,
                data: {
                    day: dayName,
                    slots: dayAvailability?.slots || []
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                availability: doctor.availability
            }
        });
    } catch (error) {
        console.error('Get Availability Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get availability',
            error: error.message
        });
    }
};

// @desc    Search doctors
// @route   GET /api/doctors/search
// @access  Public
export const searchDoctors = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const doctors = await Doctor.find({
            isActive: true,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { specialization: { $regex: q, $options: 'i' } },
                { hospital: { $regex: q, $options: 'i' } },
                { 'address.city': { $regex: q, $options: 'i' } }
            ]
        })
            .select('-password')
            .limit(20);

        res.status(200).json({
            success: true,
            data: { doctors }
        });
    } catch (error) {
        console.error('Search Doctors Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search doctors',
            error: error.message
        });
    }
};

// @desc    Get specializations
// @route   GET /api/doctors/specializations
// @access  Public
export const getSpecializations = async (req, res) => {
    try {
        const specializations = await Doctor.distinct('specialization', { isActive: true });

        res.status(200).json({
            success: true,
            data: { specializations }
        });
    } catch (error) {
        console.error('Get Specializations Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get specializations',
            error: error.message
        });
    }
};
