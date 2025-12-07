import Appointment from '../models/appointmentModel.js';
import ConsultationChat from '../models/consultationChatModel.js';

/**
 * Auto-approve appointments after 10 seconds
 * This simulates doctor approval since we don't have a doctor portal yet
 */
export const autoApproveAppointment = async (appointmentId) => {
    try {
        // Wait 10 seconds
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Get appointment
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            console.log(`Appointment ${appointmentId} not found`);
            return;
        }

        // Only auto-approve if still pending
        if (appointment.status !== 'pending') {
            console.log(`Appointment ${appointmentId} is no longer pending (${appointment.status})`);
            return;
        }

        // Update to accepted
        appointment.status = 'accepted';
        appointment.acceptedAt = new Date();
        await appointment.save();

        // Create consultation chat room
        const existingChat = await ConsultationChat.findOne({ appointmentId });

        if (!existingChat) {
            await ConsultationChat.create({
                appointmentId: appointment._id,
                userId: appointment.userId,
                doctorId: appointment.doctorId,
                messages: [],
                isActive: false // Will activate when user joins
            });
        }

        console.log(`✅ Appointment ${appointmentId} auto-approved after 10 seconds`);

        return appointment;
    } catch (error) {
        console.error(`Auto-approve error for appointment ${appointmentId}:`, error);
    }
};

export default { autoApproveAppointment };
