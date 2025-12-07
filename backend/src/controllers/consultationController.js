import ConsultationChat from '../models/consultationChatModel.js';
import Appointment from '../models/appointmentModel.js';
import { getIO } from '../socket/consultationSocket.js';

// @desc    Upload media to consultation
// @route   POST /api/consultations/:appointmentId/upload
// @access  Private
export const uploadMedia = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { senderType } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Verify appointment exists
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Verify user is part of this consultation
        const isAuthorized = senderType === 'doctor'
            ? appointment.doctorId.toString() === req.user._id.toString()
            : appointment.userId.toString() === req.user._id.toString();

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Get consultation chat
        let consultation = await ConsultationChat.findOne({ appointmentId });

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: 'Consultation not found'
            });
        }

        // Determine message type
        const messageType = req.file.mimetype.startsWith('image/') ? 'image' : 'document';

        // Add message with file
        const newMessage = {
            senderId: req.user._id,
            senderType,
            messageType,
            fileUrl: req.file.path, // Cloudinary URL
            fileName: req.file.originalname,
            fileSize: req.file.size,
            timestamp: new Date(),
            read: false
        };

        consultation.messages.push(newMessage);
        consultation.lastActivity = new Date();
        await consultation.save();

        // Get the saved message
        const savedMessage = consultation.messages[consultation.messages.length - 1];

        // Emit via Socket.IO
        try {
            const io = getIO();
            io.to(appointmentId).emit('message-received', {
                message: savedMessage,
                appointmentId
            });
        } catch (socketError) {
            console.log('Socket.IO not available, message saved to DB');
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                message: savedMessage,
                fileUrl: req.file.path
            }
        });

    } catch (error) {
        console.error('Upload Media Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file',
            error: error.message
        });
    }
};

// @desc    Get consultation messages
// @route   GET /api/consultations/:appointmentId/messages
// @access  Private
export const getMessages = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        // Verify appointment exists
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Verify user is part of this consultation
        const isAuthorized =
            appointment.doctorId.toString() === req.user._id.toString() ||
            appointment.userId.toString() === req.user._id.toString();

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const consultation = await ConsultationChat.findOne({ appointmentId });

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: 'No messages found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                messages: consultation.messages,
                isActive: consultation.isActive
            }
        });

    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get messages',
            error: error.message
        });
    }
};

// @desc    Get active consultations
// @route   GET /api/consultations/active
// @access  Private
export const getActiveConsultations = async (req, res) => {
    try {
        const consultations = await ConsultationChat.find({
            userId: req.user._id,
            isActive: true
        })
            .populate('appointmentId')
            .populate('doctorId', 'name specialization profileImage')
            .sort({ lastActivity: -1 });

        res.status(200).json({
            success: true,
            data: { consultations }
        });

    } catch (error) {
        console.error('Get Active Consultations Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get consultations',
            error: error.message
        });
    }
};
