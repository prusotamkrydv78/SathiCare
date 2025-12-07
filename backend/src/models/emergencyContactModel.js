import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        contacts: [{
            name: {
                type: String,
                required: [true, 'Contact name is required'],
                trim: true
            },
            relationship: {
                type: String,
                required: [true, 'Relationship is required'],
            },
            phoneNumber: {
                type: String,
                required: [true, 'Phone number is required'],
                validate: {
                    validator: function (v) {
                        // Nepal phone number validation (E.164 format)
                        return /^\+977\d{10}$/.test(v);
                    },
                    message: 'Phone number must be in E.164 format (+977xxxxxxxxxx)'
                }
            },
            isPrimary: {
                type: Boolean,
                default: false
            },
            carrier: {
                type: String,
                enum: ['Ncell', 'NTC', 'Unknown']
            }
        }],
        sosSettings: {
            autoSendLocation: {
                type: Boolean,
                default: true
            },
            sendToAll: {
                type: Boolean,
                default: true
            },
            customMessage: {
                type: String,
                default: 'Emergency! I need help. Please contact me immediately.'
            }
        }
    },
    {
        timestamps: true
    }
);

// Index
emergencyContactSchema.index({ userId: 1 });

// Method to identify carrier
emergencyContactSchema.methods.identifyCarrier = function (phoneNumber) {
    if (!phoneNumber.startsWith('+977') || phoneNumber.length !== 13) {
        return 'Unknown';
    }
    const prefix = phoneNumber.slice(4, 7);
    const ncellPrefixes = ['970', '971', '980', '981', '982'];
    const ntcPrefixes = ['984', '985', '986'];

    if (ncellPrefixes.includes(prefix)) {
        return 'Ncell';
    } else if (ntcPrefixes.includes(prefix)) {
        return 'NTC';
    }
    return 'Unknown';
};

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

export default EmergencyContact;
