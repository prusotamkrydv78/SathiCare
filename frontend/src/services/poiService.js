import api from './api';

const poiService = {
    /**
     * Get all nearby facilities (hospitals, clinics, pharmacies, organizations)
     * @param {string} category - 'all', 'healthcare', or 'organizations'
     * @param {number} limit - Maximum number of results
     * @param {number} lat - Latitude (optional, defaults to Janakpur center)
     * @param {number} lon - Longitude (optional, defaults to Janakpur center)
     * @param {number} radius - Search radius in meters (optional, default 2000 = 2km)
     * @returns {Promise} API response with facilities data
     */
    getNearbyFacilities: async (category = 'all', limit = 50, lat = null, lon = null, radius = 2000) => {
        try {
            const params = { category, limit, radius };

            // Only add lat/lon if provided
            if (lat !== null && lon !== null) {
                params.lat = lat;
                params.lon = lon;
            }

            const response = await api.get('/poi/nearby', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching nearby facilities:', error);
            throw error;
        }
    },

    /**
     * Get only hospitals
     * @returns {Promise} API response with hospitals data
     */
    getHospitals: async () => {
        try {
            const response = await api.get('/poi/hospitals');
            return response.data;
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            throw error;
        }
    },

    /**
     * Get only organizations
     * @returns {Promise} API response with organizations data
     */
    getOrganizations: async () => {
        try {
            const response = await api.get('/poi/organizations');
            return response.data;
        } catch (error) {
            console.error('Error fetching organizations:', error);
            throw error;
        }
    },

    /**
     * Get all healthcare facilities (hospitals, clinics, pharmacies, doctors)
     * @returns {Promise} API response with healthcare facilities data
     */
    getHealthcareFacilities: async () => {
        try {
            const response = await api.get('/poi/healthcare');
            return response.data;
        } catch (error) {
            console.error('Error fetching healthcare facilities:', error);
            throw error;
        }
    },

    /**
     * Find POIs by type
     * @param {string} type - 'hospitals' or 'organizations'
     * @returns {Promise} API response with POIs data
     */
    findByType: async (type) => {
        try {
            const response = await api.get('/poi/find', {
                params: { type }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            throw error;
        }
    },

    /**
     * Get detailed information about a specific facility
     * @param {string} id - OSM facility ID
     * @returns {Promise} API response with facility details
     */
    getFacilityDetails: async (id) => {
        try {
            const response = await api.get(`/poi/details/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching facility details for ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get reviews for a facility
     * @param {string} hospitalId 
     */
    getReviews: async (hospitalId) => {
        try {
            const response = await api.get(`/reviews/${hospitalId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    /**
     * Submit a new review
     * @param {Object} reviewData { hospitalId, name, rating, comment }
     */
    submitReview: async (reviewData) => {
        try {
            const response = await api.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            console.error('Error submitting review:', error);
            throw error;
        }
    }
};

export default poiService;
