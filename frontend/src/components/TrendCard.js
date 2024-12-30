// components/TrendCard.js
import React, { useState } from 'react';
import { TrendingUp, Map, Clock, Package, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/TrendCard.css';

const TrendCard = ({ trend }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="trend-card">
      <div className="trend-image-container">
        <img 
          src={trend.images[0]?.url || "/api/placeholder/400/300"} 
          alt={trend.name} 
          className="trend-image" 
        />
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
          <div className="detail-item">
            <Package className="detail-icon" />
            <span>{trend.category}</span>
          </div>
        </div>

        <div className="trend-metrics">
          <div className="metric">
            <span className="metric-label">Growth</span>
            <span className="metric-value">+{trend.growth}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Price Range</span>
            <span className="metric-value">
              ${trend.priceRange.min}-{trend.priceRange.max}
            </span>
          </div>
        </div>

        <button 
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>

        {isExpanded && (
          <div className="expanded-content">
            <p className="trend-description">{trend.description}</p>
            <div className="trend-tags">
              {trend.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendCard;