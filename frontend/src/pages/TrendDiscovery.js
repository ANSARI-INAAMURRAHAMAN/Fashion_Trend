// src/pages/TrendDiscovery.js
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, TrendingUp, Package, Plus } from 'lucide-react';
import { fetchTrends, setTrendFilters } from '../redux/actions/trendActions';
import TrendCard from '../components/TrendCard';
import CreateTrendModal from '../components/CreateTrendModal';
import '../styles/TrendDiscovery.css';

const TrendDiscovery = () => {
  const dispatch = useDispatch();
  const { trends = [], loading, filters } = useSelector(state => state.trends); // Set default empty array
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6; // Changed from 10 to 6 cards initially
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrends, setFilteredTrends] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const categories = [
    { id: 'all', name: 'All Trends', icon: <TrendingUp /> },
    { id: 'Apparel', name: 'Apparel', icon: <Package /> },
    { id: 'Accessories', name: 'Accessories', icon: <Package /> },
    { id: 'Footwear', name: 'Footwear', icon: <Package /> },
    { id: 'Beauty', name: 'Beauty', icon: <Package /> },
    { id: 'Lifestyle', name: 'Lifestyle', icon: <Package /> }
  ];

  // Filter trends without triggering re-renders
  const filterTrends = useCallback(() => {
    console.log('Filtering trends:', trends);
    if (!Array.isArray(trends) || trends.length === 0) return [];
    
    return trends.filter(trend => {
      const matchesSearch = !searchTerm || 
        trend.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trend.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trend.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = activeCategory === 'all' || 
        trend.category?.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [trends, searchTerm, activeCategory]);

  // Add console logs to debug
  useEffect(() => {
    console.log('Current trends:', trends);
    console.log('Filtered trends:', filteredTrends);
    console.log('Active category:', activeCategory);
    console.log('Search term:', searchTerm);
  }, [trends, filteredTrends, activeCategory, searchTerm]);

  // Initial load and pagination
  useEffect(() => {
    if (isInitialLoad || page > 1) {
      console.log('Fetching trends - Page:', page, 'Initial load:', isInitialLoad);
      dispatch(fetchTrends({
        ...filters,
        page,
        limit
      })).then(response => {
        console.log('Fetch response:', response);
        if (Array.isArray(response) && response.length < limit) {
          setHasMore(false);
        }
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      });
    }
  }, [dispatch, filters, page, limit, isInitialLoad]);

  // Update filtered results
  useEffect(() => {
    setFilteredTrends(filterTrends());
  }, [filterTrends]);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setHasMore(true);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  if (loading && isInitialLoad) {
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
            value={searchTerm}
          />
          <button className="filter-button">
            <Filter className="filter-icon" />
            Filters ({activeCategory !== 'all' ? '1' : '0'})
          </button>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {filteredTrends.length === 0 ? (
        <div className="no-results">
          No trends found matching your criteria
        </div>
      ) : (
        <div className="trends-grid">
          {filteredTrends.map((trend, index) => (
            <TrendCard 
              key={trend._id} 
              trend={trend}
              style={{ '--index': index }} 
            />
          ))}
        </div>
      )}

      {hasMore && (
        <button className="load-more-btn" onClick={loadMore}>
          Load More
        </button>
      )}

      <CreateTrendModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default TrendDiscovery;