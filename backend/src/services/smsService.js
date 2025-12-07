import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const senderId = process.env.TWILIO_SENDER_ID || 'SaathiCare';

/**
 * Identify carrier based on Nepal phone prefix
 */
export const identifyCarrier = (phoneNumber) => {
    if (!phoneNumber.startsWith('+977') || phoneNumber.length !== 13) {
        throw new Error('Invalid Nepal phone number format. Use E.164: +977xxxxxxxxxx');
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

/**
 * Send SMS via Twilio
 */
export const sendSMS = async (to, message) => {
    try {
        const carrier = identifyCarrier(to);
        console.log(`📱 Sending SMS to ${to} on ${carrier} carrier`);

        const twilioMessage = await client.messages.create({
            body: message,
            to: to,
            from: senderId
        });

        return {
            success: true,
            messageSid: twilioMessage.sid,
            carrier: carrier,
            status: twilioMessage.status
        };
    } catch (error) {
        console.error('❌ SMS Error:', error.message);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
};

/**
 * Send Emergency SOS SMS
 */
export const sendEmergencySMS = async (to, userName, location) => {
    const googleMapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

    const message = `🚨 EMERGENCY ALERT 🚨
${userName} needs help!

Location: ${googleMapsLink}
${location.address ? `Address: ${location.address}` : ''}

Please contact them immediately or call emergency services.

- SaathiCare Emergency System`;

    return await sendSMS(to, message);
};

/**
 * Send bulk SMS to multiple contacts
 */
export const sendBulkSMS = async (contacts, message) => {
    const results = [];

    for (const contact of contacts) {
        const result = await sendSMS(contact.phoneNumber, message);
        results.push({
            contact: contact.name,
            phoneNumber: contact.phoneNumber,
            ...result
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
};

/**
 * Get SMS delivery status
 */
export const getSMSStatus = async (messageSid) => {
    try {
        const message = await client.messages(messageSid).fetch();
        return {
            success: true,
            status: message.status,
            errorCode: message.errorCode,
            errorMessage: message.errorMessage
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

export default {
    sendSMS,
    sendEmergencySMS,
    sendBulkSMS,
    getSMSStatus,
    identifyCarrier
};
