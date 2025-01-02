// src/pages/TrendDiscovery.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, TrendingUp, Package, Plus } from 'lucide-react';
import { fetchTrends, setTrendFilters } from '../redux/actions/trendActions';
import TrendCard from '../components/TrendCard';
import CreateTrendModal from '../components/CreateTrendModal';
import '../styles/TrendDiscovery.css';

const TrendDiscovery = () => {
  const dispatch = useDispatch();
  const { trends, loading, filters } = useSelector(state => state.trends);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const categories = [
    { id: 'all', name: 'All Trends', icon: <TrendingUp /> },
    { id: 'Apparel', name: 'Apparel', icon: <Package /> },
    { id: 'Accessories', name: 'Accessories', icon: <Package /> },
    { id: 'Footwear', name: 'Footwear', icon: <Package /> },
    { id: 'Beauty', name: 'Beauty', icon: <Package /> },
    { id: 'Lifestyle', name: 'Lifestyle', icon: <Package /> }
  ];

  useEffect(() => {
    dispatch(fetchTrends({
      ...filters,
      page,
      limit
    }));
  }, [dispatch, filters, page]);

  const handleCategoryChange = (category) => {
    dispatch(setTrendFilters({ 
      ...filters, 
      category: category === 'all' ? '' : category 
    }));
  };

  const handleSearch = (e) => {
    dispatch(setTrendFilters({ 
      ...filters, 
      search: e.target.value 
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="trend-discovery-container">
      <div className="trend-header">
        <h1 className="gradient-title">Trend Discovery</h1>
        <button 
          className="create-trend-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} />
          Create Trend
        </button>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search trends, styles, or categories..."
            className="search-input"
            onChange={handleSearch}
            value={filters.search}
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
            className={`category-tab ${filters.category === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      <div className="trends-grid">
        {trends.map(trend => (
          <TrendCard key={trend._id} trend={trend} />
        ))}
      </div>

      <button onClick={() => setPage(prev => prev + 1)}>
        Load More
      </button>

      <CreateTrendModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default TrendDiscovery;