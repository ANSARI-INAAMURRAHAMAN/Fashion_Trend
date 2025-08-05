const googleTrends = require('google-trends-api');

class GoogleTrendsService {
  constructor() {
    this.fashionKeywords = [
      'sustainable fashion', 'vintage clothing', 'streetwear', 'athleisure',
      'minimalist fashion', 'oversized blazers', 'Y2K fashion', 'cottagecore',
      'dark academia', 'korean fashion', 'fast fashion', 'luxury fashion'
    ];
    
    this.regions = {
      'global': '',
      'na': 'US',
      'eu': 'DE',
      'asia': 'JP',
      'latam': 'BR'
    };
  }

  async getTrendData(keyword, timeframe = 'today 3-m', region = '') {
    try {
      const results = await googleTrends.interestOverTime({
        keyword: keyword,
        startTime: this.getStartTime(timeframe),
        geo: region,
        granularTimeResolution: true
      });

      return JSON.parse(results);
    } catch (error) {
      console.error(`Error fetching trends for ${keyword}:`, error);
      return null;
    }
  }

  async getMultipleKeywords(keywords, timeframe = 'today 3-m', region = '') {
    try {
      const results = await googleTrends.interestOverTime({
        keyword: keywords,
        startTime: this.getStartTime(timeframe),
        geo: region
      });

      return JSON.parse(results);
    } catch (error) {
      console.error('Error fetching multiple trends:', error);
      return null;
    }
  }

  async getRelatedQueries(keyword, region = '') {
    try {
      const results = await googleTrends.relatedQueries({
        keyword: keyword,
        geo: region
      });

      return JSON.parse(results);
    } catch (error) {
      console.error('Error fetching related queries:', error);
      return null;
    }
  }

  async getRegionalInterest(keyword, timeframe = 'today 3-m') {
    try {
      const results = await googleTrends.interestByRegion({
        keyword: keyword,
        startTime: this.getStartTime(timeframe),
        resolution: 'COUNTRY'
      });

      return JSON.parse(results);
    } catch (error) {
      console.error('Error fetching regional interest:', error);
      return null;
    }
  }

  // Convert timeframe to start time
  getStartTime(timeframe) {
    const now = new Date();
    switch (timeframe) {
      case '1M': return new Date(now.setMonth(now.getMonth() - 1));
      case '3M': return new Date(now.setMonth(now.getMonth() - 3));
      case '6M': return new Date(now.setMonth(now.getMonth() - 6));
      default: return new Date(now.setMonth(now.getMonth() - 3));
    }
  }

  // Process and normalize Google Trends data to your format
  async getFashionTrendAnalysis(timeframe = '3M', selectedRegions = ['global']) {
    try {
      const trendPromises = [];
      
      // Get data for each region
      for (const region of selectedRegions) {
        const geoCode = this.regions[region];
        
        // Get trends for top fashion keywords
        const fashionTrends = await this.getMultipleKeywords(
          this.fashionKeywords.slice(0, 5), // Limit to avoid rate limiting
          timeframe,
          geoCode
        );
        
        trendPromises.push({
          region,
          data: fashionTrends
        });
      }

      return this.processGoogleTrendsData(await Promise.all(trendPromises), timeframe);
    } catch (error) {
      console.error('Error in getFashionTrendAnalysis:', error);
      return null;
    }
  }

  // Convert Google Trends data to your dashboard format
  processGoogleTrendsData(trendsData, timeframe) {
    const processedData = [];
    
    trendsData.forEach(({ region, data }) => {
      if (data && data.default && data.default.timelineData) {
        data.default.timelineData.forEach((point, index) => {
          const dayData = {
            day: index + 1,
            region: region,
            popularity: point.value[0] || 0, // Google Trends interest score
            engagement: this.calculateEngagement(point.value),
            retention: this.calculateRetention(point.value, index),
            growth: this.calculateGrowth(point.value, index),
            revenue: this.estimateRevenue(point.value[0]),
            users: this.estimateUsers(point.value[0])
          };
          
          processedData.push(dayData);
        });
      }
    });

    return {
      current: this.groupByRegion(processedData),
      strengthIndicators: this.calculateStrengthIndicators(processedData),
      demographics: this.getDemographics(trendsData),
      businessImpact: this.calculateBusinessImpact(processedData)
    };
  }

  // Helper methods for data processing
  calculateEngagement(values) {
    const avg = values.reduce((sum, val) => sum + (val || 0), 0) / values.length;
    return Math.min(100, avg * 1.2); // Simulate engagement rate
  }

  calculateRetention(values, index) {
    if (index === 0) return 85; // Starting retention
    const current = values[0] || 0;
    const retention = Math.max(50, 85 - (index * 0.5) + (current * 0.2));
    return Math.min(100, retention);
  }

  calculateGrowth(values, index) {
    if (index === 0) return 0;
    const current = values[0] || 0;
    const growth = (current - 50) * 2; // Simulate growth rate
    return Math.max(-50, Math.min(100, growth));
  }

  estimateRevenue(popularityScore) {
    // Simple revenue estimation based on popularity
    return (popularityScore || 0) * 10 + Math.random() * 200;
  }

  estimateUsers(popularityScore) {
    // Estimate active users based on popularity
    return Math.floor((popularityScore || 0) * 100 + Math.random() * 500);
  }

  groupByRegion(data) {
    return data.reduce((acc, item) => {
      if (!acc[item.region]) acc[item.region] = [];
      acc[item.region].push(item);
      return acc;
    }, {});
  }

  calculateStrengthIndicators(data) {
    const avgPopularity = data.reduce((sum, item) => sum + item.popularity, 0) / data.length;
    const avgEngagement = data.reduce((sum, item) => sum + item.engagement, 0) / data.length;
    const avgGrowth = data.reduce((sum, item) => sum + item.growth, 0) / data.length;

    return {
      'Market Penetration': Math.min(100, avgPopularity),
      'Engagement Rate': Math.min(100, avgEngagement),
      'Growth Momentum': Math.min(100, Math.max(0, avgGrowth + 50)),
      'Trend Velocity': Math.min(100, (avgPopularity + avgEngagement) / 2)
    };
  }

  getDemographics(trendsData) {
    // Simulate demographics based on regional data
    const regions = trendsData.map(trend => ({
      name: trend.region.toUpperCase(),
      value: Math.random() * 100
    }));

    const ageGroups = [
      { group: '18-24', percentage: 25 + Math.random() * 10 },
      { group: '25-34', percentage: 35 + Math.random() * 10 },
      { group: '35-44', percentage: 20 + Math.random() * 10 },
      { group: '45-54', percentage: 15 + Math.random() * 5 },
      { group: '55+', percentage: 5 + Math.random() * 5 }
    ];

    return { regions, ageGroups };
  }

  calculateBusinessImpact(data) {
    const avgRevenue = data.reduce((sum, item) => sum + item.revenue, 0) / data.length;
    const totalRevenue = avgRevenue * data.length * 1000; // Scale up

    const riskLevel = avgRevenue < 300 ? 'high' : avgRevenue < 600 ? 'medium' : 'low';

    return {
      predictedSales: totalRevenue,
      markdownRisk: riskLevel
    };
  }
}

module.exports = new GoogleTrendsService();
