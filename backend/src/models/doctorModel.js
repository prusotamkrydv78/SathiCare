import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Doctor name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false
        },
        specialization: {
            type: String,
            required: [true, 'Specialization is required'],
            enum: ['Gynecologist', 'Obstetrician', 'General Physician', 'Pediatrician',
                'Psychiatrist', 'Nutritionist', 'Dermatologist', 'Other']
        },
        qualifications: [{
            type: String
        }],
        experience: {
            type: Number,
            required: [true, 'Experience is required'],
            min: 0
        },
        hospital: {
            type: String,
            required: [true, 'Hospital/Clinic name is required']
        },
        address: {
            city: String,
            area: String,
            fullAddress: String
        },
        consultationFee: {
            type: Number,
            required: [true, 'Consultation fee is required'],
            min: 0
        },
        availability: [{
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            slots: [{
                type: String // Format: "09:00-10:00"
            }]
        }],
        languages: [{
            type: String,
            enum: ['Nepali', 'English', 'Hindi', 'Maithili']
        }],
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalRatings: {
            type: Number,
            default: 0
        },
        totalConsultations: {
            type: Number,
            default: 0
        },
        profileImage: String,
        bio: String,
        isActive: {
            type: Boolean,
            default: true
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Indexes
doctorSchema.index({ specialization: 1, isActive: 1 });
doctorSchema.index({ 'address.city': 1 });
doctorSchema.index({ rating: -1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
