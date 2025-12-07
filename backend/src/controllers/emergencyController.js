import EmergencyContact from '../models/emergencyContactModel.js';
import SOSAlert from '../models/sosAlertModel.js';
import { sendEmergencySMS } from '../services/smsService.js';

// @desc    Add/Update emergency contacts
// @route   POST /api/emergency/contacts
// @access  Private
export const addEmergencyContacts = async (req, res) => {
    try {
        const { contacts, sosSettings } = req.body;

        let emergencyContact = await EmergencyContact.findOne({ userId: req.user._id });

        if (emergencyContact) {
            // Update existing
            emergencyContact.contacts = contacts;
            if (sosSettings) {
                emergencyContact.sosSettings = { ...emergencyContact.sosSettings, ...sosSettings };
            }
        } else {
            // Create new
            emergencyContact = await EmergencyContact.create({
                userId: req.user._id,
                contacts,
                sosSettings: sosSettings || {}
            });
        }

        // Identify carrier for each contact
        emergencyContact.contacts.forEach(contact => {
            contact.carrier = emergencyContact.identifyCarrier(contact.phoneNumber);
        });

        await emergencyContact.save();

        res.status(200).json({
            success: true,
            message: 'Emergency contacts saved successfully',
            data: { emergencyContact }
        });
    } catch (error) {
        console.error('Add Emergency Contacts Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save emergency contacts',
            error: error.message
        });
    }
};

// @desc    Get emergency contacts
// @route   GET /api/emergency/contacts
// @access  Private
export const getEmergencyContacts = async (req, res) => {
    try {
        const emergencyContact = await EmergencyContact.findOne({ userId: req.user._id });

        if (!emergencyContact) {
            return res.status(200).json({
                success: true,
                data: { contacts: [], sosSettings: {} }
            });
        }

        res.status(200).json({
            success: true,
            data: emergencyContact
        });
    } catch (error) {
        console.error('Get Emergency Contacts Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get emergency contacts',
            error: error.message
        });
    }
};

// @desc    Trigger SOS Alert
// @route   POST /api/emergency/sos
// @access  Private
export const triggerSOS = async (req, res) => {
    try {
        const { location, message } = req.body;

        if (!location || !location.latitude || !location.longitude) {
            return res.status(400).json({
                success: false,
                message: 'Location is required'
            });
        }

        // Get emergency contacts
        const emergencyContact = await EmergencyContact.findOne({ userId: req.user._id });

        if (!emergencyContact || emergencyContact.contacts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No emergency contacts configured. Please add contacts first.'
            });
        }

        // Create SOS alert
        const sosAlert = await SOSAlert.create({
            userId: req.user._id,
            location,
            message: message || emergencyContact.sosSettings.customMessage,
            status: 'active'
        });

        // Send SMS to all contacts
        const contactsToNotify = emergencyContact.sosSettings.sendToAll
            ? emergencyContact.contacts
            : emergencyContact.contacts.filter(c => c.isPrimary);

        const notificationResults = [];

        for (const contact of contactsToNotify) {
            const smsResult = await sendEmergencySMS(
                contact.phoneNumber,
                req.user.name,
                location
            );

            notificationResults.push({
                contactId: contact._id,
                name: contact.name,
                phoneNumber: contact.phoneNumber,
                smsSent: smsResult.success,
                smsStatus: smsResult.status || 'failed',
                messageSid: smsResult.messageSid,
                sentAt: new Date()
            });
        }

        // Update SOS alert with notification results
        sosAlert.contactsNotified = notificationResults;
        await sosAlert.save();

        const successCount = notificationResults.filter(r => r.smsSent).length;

        res.status(200).json({
            success: true,
            message: `SOS alert sent to ${successCount}/${contactsToNotify.length} contacts`,
            data: {
                alertId: sosAlert._id,
                contactsNotified: successCount,
                totalContacts: contactsToNotify.length,
                results: notificationResults
            }
        });

    } catch (error) {
        console.error('Trigger SOS Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to trigger SOS alert',
            error: error.message
        });
    }
};

// @desc    Get SOS alert history
// @route   GET /api/emergency/alerts
// @access  Private
export const getSOSAlerts = async (req, res) => {
    try {
        const { status, limit = 20, page = 1 } = req.query;

        const filter = { userId: req.user._id };
        if (status) {
            filter.status = status;
        }

        const alerts = await SOSAlert.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await SOSAlert.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                alerts,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get SOS Alerts Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get SOS alerts',
            error: error.message
        });
    }
};

// @desc    Resolve SOS alert
// @route   PUT /api/emergency/alerts/:id/resolve
// @access  Private
export const resolveSOSAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, resolvedBy } = req.body;

        const alert = await SOSAlert.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        alert.status = 'resolved';
        alert.resolvedAt = new Date();
        alert.resolvedBy = resolvedBy || 'User';
        alert.notes = notes;

        await alert.save();

        res.status(200).json({
            success: true,
            message: 'Alert resolved successfully',
            data: { alert }
        });
    } catch (error) {
        console.error('Resolve SOS Alert Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resolve alert',
            error: error.message
        });
    }
};

// @desc    Delete emergency contact
// @route   DELETE /api/emergency/contacts/:contactId
// @access  Private
export const deleteEmergencyContact = async (req, res) => {
    try {
        const { contactId } = req.params;

        const emergencyContact = await EmergencyContact.findOne({ userId: req.user._id });

        if (!emergencyContact) {
            return res.status(404).json({
                success: false,
                message: 'No emergency contacts found'
            });
        }

        emergencyContact.contacts = emergencyContact.contacts.filter(
            c => c._id.toString() !== contactId
        );

        await emergencyContact.save();

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
            data: { emergencyContact }
        });
    } catch (error) {
        console.error('Delete Contact Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact',
            error: error.message
        });
    }
};
