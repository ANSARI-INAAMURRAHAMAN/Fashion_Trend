// components/Filters.js
import React, { useState } from 'react';
import './Filters.css';

const Filters = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const categories = [
    { id: 'all', label: 'All Trends' },
    { id: 'sustainable', label: 'Sustainable' },
    { id: 'athleisure', label: 'Athleisure' },
    { id: 'vintage', label: 'Vintage' }
  ];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>Filter Trends</h3>
        <button className="clear-filters">Clear All</button>
      </div>

      <div className="filter-groups">
        <div className="filter-group">
          <h4>Categories</h4>
          <div className="filter-options">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Time Range</h4>
          <div className="date-range">
            <input type="date" className="date-input" />
            <span>to</span>
            <input type="date" className="date-input" />
          </div>
        </div>

        <div className="filter-group">
          <h4>Growth Rate</h4>
          <div className="range-slider">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="50"
              className="slider"
            />
            <div className="range-labels">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;