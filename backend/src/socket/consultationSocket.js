import { Server } from 'socket.io';
import ConsultationChat from '../models/consultationChatModel.js';
import Appointment from '../models/appointmentModel.js';

let io;

// Initialize Socket.IO
export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: true, // Allow all origins in development
            credentials: true
        }
    });

    // Store active users
    const activeUsers = new Map(); // userId -> socketId
    const activeDoctors = new Map(); // doctorId -> socketId

    io.on('connection', (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);

        // User joins as patient or doctor
        socket.on('user-online', ({ userId, userType }) => {
            if (userType === 'doctor') {
                activeDoctors.set(userId, socket.id);
                console.log(`👨‍⚕️ Doctor ${userId} online`);
            } else {
                activeUsers.set(userId, socket.id);
                console.log(`👤 User ${userId} online`);
            }
        });

        // Join consultation room
        socket.on('join-consultation', async ({ appointmentId, userId, userType }) => {
            try {
                // Verify appointment exists
                const appointment = await Appointment.findById(appointmentId);
                if (!appointment) {
                    socket.emit('error', { message: 'Appointment not found' });
                    return;
                }

                // Verify user is part of this consultation
                const isAuthorized = userType === 'doctor'
                    ? appointment.doctorId.toString() === userId
                    : appointment.userId.toString() === userId;

                if (!isAuthorized) {
                    socket.emit('error', { message: 'Not authorized' });
                    return;
                }

                // Join room
                socket.join(appointmentId);
                console.log(`📞 ${userType} ${userId} joined consultation ${appointmentId}`);

                // Get or create consultation chat
                let consultation = await ConsultationChat.findOne({ appointmentId });

                if (!consultation) {
                    consultation = await ConsultationChat.create({
                        appointmentId,
                        userId: appointment.userId,
                        doctorId: appointment.doctorId,
                        messages: [],
                        isActive: true,
                        startedAt: new Date()
                    });
                } else if (!consultation.isActive) {
                    consultation.isActive = true;
                    consultation.startedAt = new Date();
                    await consultation.save();
                }

                // Send chat history
                socket.emit('consultation-joined', {
                    appointmentId,
                    messages: consultation.messages,
                    isActive: consultation.isActive
                });

                // Notify other party
                socket.to(appointmentId).emit('user-joined', {
                    userType,
                    userId
                });

            } catch (error) {
                console.error('Join Consultation Error:', error);
                socket.emit('error', { message: 'Failed to join consultation' });
            }
        });

        // Send message
        socket.on('send-message', async ({ appointmentId, senderId, senderType, message }) => {
            try {
                const consultation = await ConsultationChat.findOne({ appointmentId });

                if (!consultation) {
                    socket.emit('error', { message: 'Consultation not found' });
                    return;
                }

                if (!consultation.isActive) {
                    socket.emit('error', { message: 'Consultation is not active' });
                    return;
                }

                // Add message
                const newMessage = {
                    senderId,
                    senderType,
                    messageType: message.type || 'text',
                    content: message.content,
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileSize: message.fileSize,
                    timestamp: new Date(),
                    read: false
                };

                consultation.messages.push(newMessage);
                consultation.lastActivity = new Date();
                await consultation.save();

                // Get the saved message with ID
                const savedMessage = consultation.messages[consultation.messages.length - 1];

                // Broadcast to room
                io.to(appointmentId).emit('message-received', {
                    message: savedMessage,
                    appointmentId
                });

                console.log(`💬 Message sent in consultation ${appointmentId}`);

            } catch (error) {
                console.error('Send Message Error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', ({ appointmentId, userId, userType }) => {
            socket.to(appointmentId).emit('user-typing', {
                userId,
                userType,
                isTyping: true
            });
        });

        socket.on('stop-typing', ({ appointmentId, userId, userType }) => {
            socket.to(appointmentId).emit('user-typing', {
                userId,
                userType,
                isTyping: false
            });
        });

        // Mark messages as read
        socket.on('mark-read', async ({ appointmentId, userId }) => {
            try {
                const consultation = await ConsultationChat.findOne({ appointmentId });

                if (consultation) {
                    await consultation.markAsRead(userId);
                    socket.to(appointmentId).emit('messages-read', { appointmentId, userId });
                }
            } catch (error) {
                console.error('Mark Read Error:', error);
            }
        });

        // Leave consultation
        socket.on('leave-consultation', ({ appointmentId, userId, userType }) => {
            socket.leave(appointmentId);
            socket.to(appointmentId).emit('user-left', {
                userId,
                userType
            });
            console.log(`👋 ${userType} ${userId} left consultation ${appointmentId}`);
        });

        // End consultation
        socket.on('end-consultation', async ({ appointmentId }) => {
            try {
                const consultation = await ConsultationChat.findOne({ appointmentId });

                if (consultation) {
                    consultation.isActive = false;
                    consultation.endedAt = new Date();
                    await consultation.save();

                    io.to(appointmentId).emit('consultation-ended', { appointmentId });
                    console.log(`🔚 Consultation ${appointmentId} ended`);
                }
            } catch (error) {
                console.error('End Consultation Error:', error);
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            // Remove from active users
            for (const [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    activeUsers.delete(userId);
                    console.log(`👤 User ${userId} offline`);
                    break;
                }
            }

            for (const [doctorId, socketId] of activeDoctors.entries()) {
                if (socketId === socket.id) {
                    activeDoctors.delete(doctorId);
                    console.log(`👨‍⚕️ Doctor ${doctorId} offline`);
                    break;
                }
            }

            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Get Socket.IO instance
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
};

export default { initializeSocket, getIO };
