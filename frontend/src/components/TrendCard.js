// components/TrendCard.js
import React from 'react';
import '../styles/TrendCard.css';

const TrendCard = ({ title, growth, color }) => {
  return (
    <div className="trend-card" style={{ borderColor: color }}>
      <div className="trend-card-header">
        <h3>{title}</h3>
        <span className="trend-growth" style={{ backgroundColor: `${color}15`, color }}>
          {growth}
        </span>
      </div>
      
      <div className="trend-metrics">
        <div className="metric">
          <span className="metric-label">Engagement</span>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ 
                width: `${parseInt(growth)}%`,
                backgroundColor: color 
              }}
            />
          </div>
        </div>
        
        <div className="trend-stats">
          <div className="stat">
            <span className="stat-value">2.4k</span>
            <span className="stat-label">Mentions</span>
          </div>
          <div className="stat">
            <span className="stat-value">85%</span>
            <span className="stat-label">Positive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendCard;