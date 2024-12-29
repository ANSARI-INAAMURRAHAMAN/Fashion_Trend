// frontend/src/services/trendService.js
const API_URL = process.env.REACT_APP_API_URL || '';

export const trendService = {
  async getTrendingCategories() {
    try {
      const response = await fetch(`${API_URL}/api/trends/categories`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending categories:', error);
      throw error;
    }
  },

  async getRecentTrends({ page = 1, limit = 10, category, timeframe, minGrowth } = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(category && { category }),
        ...(timeframe && { timeframe }),
        ...(minGrowth && { minGrowth: minGrowth.toString() })
      });

      const response = await fetch(`${API_URL}/api/trends/recent?${params}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch recent trends');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent trends:', error);
      throw error;
    }
  },

  async createTrend(trendData) {
    try {
      const response = await fetch(`${API_URL}/api/trends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(trendData)
      });

      if (!response.ok) throw new Error('Failed to create trend');
      return await response.json();
    } catch (error) {
      console.error('Error creating trend:', error);
      throw error;
    }
  }
};

export default trendService;