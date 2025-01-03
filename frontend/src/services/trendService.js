// services/trendService.js
import api from './api';
import axios from './api';

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
  },

  getTrendingCategories: async () => {
    try {
      // Mock data until backend is ready
      return [
        { id: 1, name: 'Sustainable Fashion', count: 156 },
        { id: 2, name: 'Vintage Revival', count: 98 },
        { id: 3, name: 'Tech Wear', count: 142 },
        { id: 4, name: 'Minimalist', count: 87 }
      ];
      // Uncomment when backend is ready
      // const response = await axios.get('/api/trends/categories');
      // return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  getRecentTrends: async () => {
    try {
      // Mock data until backend is ready
      return {
        trends: [
          { id: 1, title: 'Eco Fashion', growth: 65 },
          { id: 2, title: 'Smart Textiles', growth: 48 },
          { id: 3, title: 'Vintage Mix', growth: 72 },
        ]
      };
      // Uncomment when backend is ready
      // const response = await axios.get('/api/trends/recent');
      // return response.data;
    } catch (error) {
      console.error('Error fetching recent trends:', error);
      return { trends: [] };
    }
  }
};

export default trendService;