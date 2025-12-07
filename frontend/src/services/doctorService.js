import api from './api';

const doctorService = {
    // ============ DOCTORS ============

    // Get all doctors
    getAllDoctors: async (params = {}) => {
        try {
            const response = await api.get('/doctors', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Search doctors
    searchDoctors: async (searchParams) => {
        try {
            const response = await api.get('/doctors/search', { params: searchParams });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get doctor by ID
    getDoctorById: async (doctorId) => {
        try {
            const response = await api.get(`/doctors/${doctorId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get doctor availability
    getDoctorAvailability: async (doctorId) => {
        try {
            const response = await api.get(`/doctors/${doctorId}/availability`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get specializations
    getSpecializations: async () => {
        try {
            const response = await api.get('/doctors/specializations');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ APPOINTMENTS ============

    // Book appointment
    bookAppointment: async (appointmentData) => {
        try {
            const response = await api.post('/appointments/book', appointmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get user appointments
    getUserAppointments: async (params = {}) => {
        try {
            const response = await api.get('/appointments', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get appointment by ID
    getAppointmentById: async (appointmentId) => {
        try {
            const response = await api.get(`/appointments/${appointmentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cancel appointment
    cancelAppointment: async (appointmentId) => {
        try {
            const response = await api.delete(`/appointments/${appointmentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Rate appointment
    rateAppointment: async (appointmentId, rating, review) => {
        try {
            const response = await api.put(`/appointments/${appointmentId}/rate`, {
                rating,
                review
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ============ CONSULTATIONS ============

    // Get active consultations
    getActiveConsultations: async () => {
        try {
            const response = await api.get('/consultations/active');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get consultation messages
    getConsultationMessages: async (appointmentId) => {
        try {
            const response = await api.get(`/consultations/${appointmentId}/messages`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Upload media to consultation
    uploadConsultationMedia: async (appointmentId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(`/consultations/${appointmentId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default doctorService;
