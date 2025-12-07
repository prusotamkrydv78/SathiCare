import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Doctor from '../models/doctorModel.js';
import 'dotenv/config';

const dummyDoctors = [
    {
        name: 'Dr. Anjali Sharma',
        email: 'anjali.sharma@sathicare.com',
        phone: '+977-9841234567',
        password: 'doctor123',
        specialization: 'Gynecologist',
        qualifications: ['MBBS', 'MD (Gynecology)', 'Fellowship in Reproductive Medicine'],
        experience: 12,
        hospital: 'Patan Hospital',
        address: {
            city: 'Lalitpur',
            area: 'Lagankhel',
            fullAddress: 'Patan Hospital, Lagankhel, Lalitpur'
        },
        consultationFee: 1500,
        availability: [
            { day: 'Monday', slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
            { day: 'Wednesday', slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00'] },
            { day: 'Friday', slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] }
        ],
        languages: ['Nepali', 'English', 'Hindi'],
        rating: 4.8,
        totalRatings: 156,
        totalConsultations: 342,
        bio: 'Experienced gynecologist specializing in women\'s reproductive health, pregnancy care, and menstrual disorders. Committed to providing compassionate care.',
        isActive: true,
        isVerified: true
    },
    {
        name: 'Dr. Suman Thapa',
        email: 'suman.thapa@sathicare.com',
        phone: '+977-9851234568',
        password: 'doctor123',
        specialization: 'Obstetrician',
        qualifications: ['MBBS', 'MD (Obstetrics)', 'FCPS'],
        experience: 15,
        hospital: 'Grande International Hospital',
        address: {
            city: 'Kathmandu',
            area: 'Dhapasi',
            fullAddress: 'Grande International Hospital, Dhapasi, Kathmandu'
        },
        consultationFee: 2000,
        availability: [
            { day: 'Tuesday', slots: ['10:00-11:00', '11:00-12:00', '16:00-17:00'] },
            { day: 'Thursday', slots: ['10:00-11:00', '11:00-12:00', '16:00-17:00'] },
            { day: 'Saturday', slots: ['09:00-10:00', '10:00-11:00', '11:00-12:00'] }
        ],
        languages: ['Nepali', 'English'],
        rating: 4.9,
        totalRatings: 203,
        totalConsultations: 487,
        bio: 'Specialist in high-risk pregnancies, prenatal care, and delivery. Dedicated to ensuring safe motherhood.',
        isActive: true,
        isVerified: true
    },
    {
        name: 'Dr. Priya Adhikari',
        email: 'priya.adhikari@sathicare.com',
        phone: '+977-9861234569',
        password: 'doctor123',
        specialization: 'General Physician',
        qualifications: ['MBBS', 'MD (Internal Medicine)'],
        experience: 8,
        hospital: 'Mediciti Hospital',
        address: {
            city: 'Lalitpur',
            area: 'Nakhkhu',
            fullAddress: 'Mediciti Hospital, Nakhkhu, Lalitpur'
        },
        consultationFee: 1000,
        availability: [
            { day: 'Monday', slots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '15:00-16:00'] },
            { day: 'Tuesday', slots: ['08:00-09:00', '09:00-10:00', '15:00-16:00'] },
            { day: 'Wednesday', slots: ['08:00-09:00', '09:00-10:00', '10:00-11:00'] },
            { day: 'Friday', slots: ['08:00-09:00', '09:00-10:00', '15:00-16:00'] }
        ],
        languages: ['Nepali', 'English', 'Hindi'],
        rating: 4.6,
        totalRatings: 98,
        totalConsultations: 215,
        bio: 'General physician with expertise in women\'s health, preventive care, and chronic disease management.',
        isActive: true,
        isVerified: true
    },
    {
        name: 'Dr. Kavita Rai',
        email: 'kavita.rai@sathicare.com',
        phone: '+977-9871234570',
        password: 'doctor123',
        specialization: 'Nutritionist',
        qualifications: ['BSc Nutrition', 'MSc Clinical Nutrition', 'Certified Dietitian'],
        experience: 6,
        hospital: 'Nepal Mediciti Hospital',
        address: {
            city: 'Lalitpur',
            area: 'Bhaisepati',
            fullAddress: 'Nepal Mediciti Hospital, Bhaisepati, Lalitpur'
        },
        consultationFee: 800,
        availability: [
            { day: 'Monday', slots: ['11:00-12:00', '14:00-15:00', '15:00-16:00'] },
            { day: 'Wednesday', slots: ['11:00-12:00', '14:00-15:00', '15:00-16:00'] },
            { day: 'Thursday', slots: ['11:00-12:00', '14:00-15:00'] },
            { day: 'Saturday', slots: ['10:00-11:00', '11:00-12:00'] }
        ],
        languages: ['Nepali', 'English', 'Hindi', 'Maithili'],
        rating: 4.7,
        totalRatings: 67,
        totalConsultations: 143,
        bio: 'Specialized in pregnancy nutrition, women\'s health, and dietary management for PCOS and hormonal imbalances.',
        isActive: true,
        isVerified: true
    },
    {
        name: 'Dr. Binita Shrestha',
        email: 'binita.shrestha@sathicare.com',
        phone: '+977-9881234571',
        password: 'doctor123',
        specialization: 'Psychiatrist',
        qualifications: ['MBBS', 'MD (Psychiatry)', 'Certified in Women\'s Mental Health'],
        experience: 10,
        hospital: 'Teaching Hospital',
        address: {
            city: 'Kathmandu',
            area: 'Maharajgunj',
            fullAddress: 'Teaching Hospital, Maharajgunj, Kathmandu'
        },
        consultationFee: 1200,
        availability: [
            { day: 'Tuesday', slots: ['13:00-14:00', '14:00-15:00', '15:00-16:00'] },
            { day: 'Thursday', slots: ['13:00-14:00', '14:00-15:00', '15:00-16:00'] },
            { day: 'Saturday', slots: ['14:00-15:00', '15:00-16:00'] }
        ],
        languages: ['Nepali', 'English'],
        rating: 4.9,
        totalRatings: 124,
        totalConsultations: 267,
        bio: 'Expert in postpartum depression, anxiety disorders, and mental health issues affecting women.',
        isActive: true,
        isVerified: true
    }
];

const seedDoctors = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📊 Connected to MongoDB');

        // Clear existing doctors
        await Doctor.deleteMany({});
        console.log('🗑️  Cleared existing doctors');

        // Hash passwords and create doctors
        for (const doctorData of dummyDoctors) {
            const hashedPassword = await bcrypt.hash(doctorData.password, 10);
            await Doctor.create({
                ...doctorData,
                password: hashedPassword
            });
        }

        console.log('✅ Successfully seeded 5 dummy doctors');
        console.log('\n📋 Doctors created:');
        dummyDoctors.forEach((doc, index) => {
            console.log(`${index + 1}. ${doc.name} - ${doc.specialization} at ${doc.hospital}`);
        });
        console.log('\n🔑 Default password for all doctors: doctor123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding doctors:', error);
        process.exit(1);
    }
};

seedDoctors();
