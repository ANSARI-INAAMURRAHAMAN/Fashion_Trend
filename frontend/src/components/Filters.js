// components/Filters.js
import React from 'react';
import { X } from 'lucide-react';
import '../styles/Filters.css';

const Filters = ({ 
  filters, 
  setFilters, 
  isOpen, 
  onClose 
}) => {
  const categories = ['streetwear', 'luxury', 'casual', 'activewear'];
  const regions = ['Global', 'Americas', 'Europe', 'Asia', 'Africa'];
  const seasons = ['SS24', 'FW24', 'SS25', 'FW25'];

  const handleChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="filters-modal">
      <div className="filters-content">
        <div className="filters-header">
          <h2>Filters</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="filters-section">
          <h3>Categories</h3>
          <div className="filters-grid">
            {categories.map(category => (
              <label key={category} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleChange('categories', category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filters-section">
          <h3>Regions</h3>
          <div className="filters-grid">
            {regions.map(region => (
              <label key={region} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.regions.includes(region)}
                  onChange={() => handleChange('regions', region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filters-section">
          <h3>Seasons</h3>
          <div className="filters-grid">
            {seasons.map(season => (
              <label key={season} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.seasons.includes(season)}
                  onChange={() => handleChange('seasons', season)}
                />
                <span>{season}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filters-section">
          <h3>Price Range</h3>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, min: e.target.value }
              }))}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, max: e.target.value }
              }))}
            />
          </div>
        </div>

        <div className="filters-actions">
          <button 
            className="reset-button"
            onClick={() => setFilters({
              categories: [],
              regions: [],
              seasons: [],
              priceRange: { min: '', max: '' }
            })}
          >
            Reset Filters
          </button>
          <button className="apply-button" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;