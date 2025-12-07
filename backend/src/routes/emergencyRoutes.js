import express from 'express';
import { body } from 'express-validator';
import {
    addEmergencyContacts,
    getEmergencyContacts,
    triggerSOS,
    getSOSAlerts,
    resolveSOSAlert,
    deleteEmergencyContact
} from '../controllers/emergencyController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const contactValidation = [
    body('contacts').isArray({ min: 1 }).withMessage('At least one contact is required'),
    body('contacts.*.name').trim().notEmpty().withMessage('Contact name is required'),
    body('contacts.*.relationship').notEmpty().withMessage('Relationship is required'),
    body('contacts.*.phoneNumber')
        .matches(/^\+977\d{10}$/)
        .withMessage('Phone number must be in E.164 format (+977xxxxxxxxxx)'),
    validate
];

const sosValidation = [
    body('location.latitude').isFloat().withMessage('Valid latitude is required'),
    body('location.longitude').isFloat().withMessage('Valid longitude is required'),
    validate
];

// Emergency contacts
router.post('/contacts', contactValidation, addEmergencyContacts);
router.get('/contacts', getEmergencyContacts);
router.delete('/contacts/:contactId', deleteEmergencyContact);

// SOS alerts
router.post('/sos', sosValidation, triggerSOS);
router.get('/alerts', getSOSAlerts);
router.put('/alerts/:id/resolve', resolveSOSAlert);

export default router;
