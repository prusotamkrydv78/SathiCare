import axios from 'axios';

const API_URL = 'http://localhost:5000/api/community';

const communityService = {
    getPosts: async (params = {}) => {
        try {
            const response = await axios.get(API_URL, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching community posts:', error);
            throw error;
        }
    },

    createPost: async (postData) => {
        try {
            const response = await axios.post(API_URL, postData);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    likePost: async (id) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/like`);
            return response.data;
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    },

    addComment: async (id, commentData) => {
        try {
            const response = await axios.post(`${API_URL}/${id}/comment`, commentData);
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }
};

export default communityService;
