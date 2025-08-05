const axios = require('axios');

class NewsAPIService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.baseURL = 'https://newsapi.org/v2';
  }

  async getSustainableFashionNews() {
    try {
      if (!this.apiKey) {
        console.warn('News API key not found, using mock data');
        return this.getMockSustainabilityData();
      }

      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          q: 'sustainable fashion OR eco-friendly clothing OR circular fashion OR fashion sustainability',
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 20,
          apiKey: this.apiKey
        }
      });

      return this.processFashionNews(response.data.articles);
    } catch (error) {
      console.error('News API error:', error);
      return this.getMockSustainabilityData();
    }
  }

  processFashionNews(articles) {
    const validArticles = articles.filter(article => 
      article.title && 
      article.description && 
      !article.title.includes('[Removed]')
    );

    return {
      carbonFootprint: this.calculateCarbonMetrics(validArticles),
      wasteReduced: this.calculateWasteMetrics(validArticles),
      sustainableTrends: this.extractTrends(validArticles.slice(0, 6)),
      recommendations: this.generateRecommendations(validArticles)
    };
  }

  extractTrends(articles) {
    return articles.map(article => ({
      title: this.cleanTitle(article.title),
      description: article.description || 'Sustainable fashion innovation gaining momentum in the industry.',
      imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
      sustainableMaterials: this.extractMaterials(article.content || article.description)
    }));
  }

  cleanTitle(title) {
    // Remove common news prefixes and make it trend-focused
    return title
      .replace(/^.*?:/, '')
      .replace(/\s*-\s*.*$/, '')
      .trim()
      .substring(0, 50) + (title.length > 50 ? '...' : '');
  }

  extractMaterials(content) {
    const sustainableMaterials = [
      'Organic Cotton', 'Recycled Polyester', 'Hemp', 'Bamboo', 'Tencel',
      'Cork', 'Mushroom Leather', 'Ocean Plastic', 'Recycled Nylon',
      'Biodegradable', 'Eco-Friendly', 'Sustainable', 'Circular Design'
    ];

    const foundMaterials = sustainableMaterials.filter(material =>
      content && content.toLowerCase().includes(material.toLowerCase())
    );

    // If no materials found in content, return random selection
    if (foundMaterials.length === 0) {
      return sustainableMaterials
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    }

    return foundMaterials.slice(0, 3);
  }

  generateRecommendations(articles) {
    const baseRecommendations = [
      {
        title: "Stay Updated on Sustainable Fashion",
        description: `Recent news highlights innovative approaches to eco-friendly fashion. Follow industry publications to stay informed.`
      },
      {
        title: "Support Featured Sustainable Brands",
        description: "Research brands mentioned in sustainability news and consider supporting companies leading environmental initiatives."
      },
      {
        title: "Adopt Latest Eco-Practices",
        description: "Implement new sustainable practices as they emerge in the fashion industry news."
      }
    ];

    // Add news-based recommendations
    if (articles.length > 0) {
      baseRecommendations.push({
        title: "Follow Current Sustainability Trends",
        description: `Based on recent coverage from ${articles[0]?.source?.name || 'industry sources'}, focus on transparent supply chains and innovative materials.`
      });
    }

    return baseRecommendations;
  }

  calculateCarbonMetrics(articles) {
    // Simulate carbon footprint based on news volume and sentiment
    const baseCarbon = 1500;
    const newsImpact = articles.length * 50; // More news = more awareness = more action
    return Math.floor(baseCarbon + newsImpact + (Math.random() * 1000));
  }

  calculateWasteMetrics(articles) {
    // Simulate waste reduction based on sustainability news
    const baseWaste = 800;
    const newsImpact = articles.length * 30;
    return Math.floor(baseWaste + newsImpact + (Math.random() * 500));
  }

  getMockSustainabilityData() {
    return {
      carbonFootprint: 2847,
      wasteReduced: 1523,
      sustainableTrends: [
        {
          title: "Regenerative Agriculture in Fashion",
          description: "Brands are partnering with farms to grow cotton using methods that restore soil health and capture carbon.",
          imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=300&h=200&fit=crop",
          sustainableMaterials: ["Regenerative Cotton", "Carbon Sequestration", "Soil Health"]
        },
        {
          title: "Blockchain Supply Chain Transparency",
          description: "Fashion brands using blockchain technology to provide complete transparency from farm to closet.",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop",
          sustainableMaterials: ["Blockchain Tracking", "Supply Chain", "Transparency"]
        },
        {
          title: "Waterless Dyeing Technologies",
          description: "Revolutionary dyeing processes that eliminate water usage while creating vibrant, long-lasting colors.",
          imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
          sustainableMaterials: ["Waterless Dyeing", "Color Innovation", "Resource Efficiency"]
        },
        {
          title: "3D Printed Fashion",
          description: "On-demand manufacturing using 3D printing reduces waste and enables customization without excess inventory.",
          imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop",
          sustainableMaterials: ["3D Printing", "On-Demand", "Zero Waste"]
        }
      ],
      recommendations: [
        {
          title: "Choose Quality Over Quantity",
          description: "Invest in well-made pieces that last longer. One quality garment can replace 5-10 fast fashion items."
        },
        {
          title: "Support Transparent Brands",
          description: "Look for brands that openly share their sustainability practices and supply chain information."
        },
        {
          title: "Embrace Second-Hand Shopping",
          description: "Thrift stores and online resale platforms offer unique pieces while reducing demand for new production."
        },
        {
          title: "Care for Your Clothes Properly",
          description: "Proper care can extend garment lifespan by 200%. Wash in cold water and air dry when possible."
        }
      ]
    };
  }
}

module.exports = new NewsAPIService();
