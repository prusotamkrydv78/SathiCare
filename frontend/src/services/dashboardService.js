import api from './api';

export const dashboardService = {
    // Get comprehensive dashboard data
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Dashboard data fetch error:', error);
            throw error;
        }
    }
};

export default dashboardService;
