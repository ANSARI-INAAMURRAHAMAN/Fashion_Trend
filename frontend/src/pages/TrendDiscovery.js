import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Map, Clock, Package } from 'lucide-react';
import '../styles/TrendDiscovery.css';

const TrendDiscovery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const trendData = [
    {
      id: 1,
      name: "Neo-Cyberpunk Fusion",
      score: 89,
      image: "/api/placeholder/400/300",
      category: "streetwear",
      region: "Global",
      priceRange: "$80-150",
      growth: "+65%",
      season: "SS24"
    },
    {
      id: 2,
      name: "Sustainable Luxe",
      score: 92,
      image: "/api/placeholder/400/300",
      category: "luxury",
      region: "Europe",
      priceRange: "$200-500",
      growth: "+48%",
      season: "FW24"
    },
    {
      id: 3,
      name: "Digital Nomad Wear",
      score: 85,
      image: "/api/placeholder/400/300",
      category: "casual",
      region: "Global",
      priceRange: "$60-120",
      growth: "+72%",
      season: "SS24"
    },
    {
      id: 4,
      name: "Bio-Tech Athleisure",
      score: 88,
      image: "/api/placeholder/400/300",
      category: "activewear",
      region: "Americas",
      priceRange: "$90-180",
      growth: "+53%",
      season: "SS24"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Trends', icon: <TrendingUp /> },
    { id: 'streetwear', name: 'Street Wear', icon: <Package /> },
    { id: 'luxury', name: 'Luxury', icon: <Package /> },
    { id: 'casual', name: 'Casual', icon: <Package /> },
    { id: 'activewear', name: 'Active Wear', icon: <Package /> }
  ];

  const filteredTrends = selectedCategory === 'all' 
    ? trendData 
    : trendData.filter(trend => trend.category === selectedCategory);

  return (
    <div className="trend-discovery-container">
      <div className="trend-header">
        <h1 className="gradient-title">Trend Discovery</h1>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search trends, styles, or categories..."
            className="search-input"
          />
          <button className="filter-button">
            <Filter className="filter-icon" />
            Filters
          </button>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      <div className="trends-grid">
        {filteredTrends.map(trend => (
          <div key={trend.id} className="trend-card">
            <div className="trend-image-container">
              <img src={trend.image} alt={trend.name} className="trend-image" />
              <div className="trend-score">
                <TrendingUp className="score-icon" />
                <span>{trend.score}</span>
              </div>
            </div>
            <div className="trend-content">
              <h3 className="trend-name">{trend.name}</h3>
              <div className="trend-details">
                <div className="detail-item">
                  <Map className="detail-icon" />
                  <span>{trend.region}</span>
                </div>
                <div className="detail-item">
                  <Clock className="detail-icon" />
                  <span>{trend.season}</span>
                </div>
              </div>
              <div className="trend-metrics">
                <div className="metric">
                  <span className="metric-label">Growth</span>
                  <span className="metric-value">{trend.growth}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Price Range</span>
                  <span className="metric-value">{trend.priceRange}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendDiscovery;