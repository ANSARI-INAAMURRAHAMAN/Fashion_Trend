// services/trendService.js
import api from './api';
const trendService = {
  getAllTrends: async (params) => {
    try {
      const response = await api.get('/api/trends', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  },

  getTrendById: async (id) => {
    const response = await api.get(`/api/trends/${id}`);
    return response.data;
  },

  createTrend: async (trendData) => {
    const response = await api.post('/api/trends', trendData);
    return response.data;
  },

  updateTrend: async (id, trendData) => {
    const response = await api.put(`/api/trends/${id}`, trendData);
    return response.data;
  },

  deleteTrend: async (id) => {
    const response = await api.delete(`/api/trends/${id}`);
    return response.data;
  },

  getTrendAnalytics: async (id) => {
    const response = await api.get(`/api/trends/${id}/analytics`);
    return response.data;
  }
};

export default trendService;