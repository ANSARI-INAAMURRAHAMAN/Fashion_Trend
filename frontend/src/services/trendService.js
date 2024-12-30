// services/trendService.js
import axios from 'axios';

const API_URL = '/api/trends';

const trendService = {
  searchTrends: async (query, page = 1) => {
    const response = await axios.get(`${API_URL}/search`, {
      params: { q: query, page }
    });
    return response.data;
  },

  filterTrends: async (filters) => {
    const response = await axios.post(`${API_URL}/filter`, filters);
    return response.data;
  },

  getTrendById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createTrend: async (trendData) => {
    const response = await axios.post(API_URL, trendData);
    return response.data;
  },

  updateTrend: async (id, trendData) => {
    const response = await axios.put(`${API_URL}/${id}`, trendData);
    return response.data;
  },

  deleteTrend: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default trendService;