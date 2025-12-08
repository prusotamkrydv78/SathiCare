import api from './api';

const communityService = {
    getPosts: async (params = {}) => {
        try {
            const response = await api.get('/community', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching community posts:', error);
            throw error;
        }
    },

    createPost: async (postData) => {
        try {
            const response = await api.post('/community', postData);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    likePost: async (id) => {
        try {
            const response = await api.put(`/community/${id}/like`);
            return response.data;
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    },

    addComment: async (id, content) => {
        try {
            const response = await api.post(`/community/${id}/comment`, { content });
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    getPostById: async (id) => {
        try {
            const response = await api.get(`/community/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post details:', error);
            throw error;
        }
    }
};

export default communityService;
