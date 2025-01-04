import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TrendDiscovery = () => {
  const [filteredTrends, setFilteredTrends] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const trends = useSelector(state => state.trends.trends);

  useEffect(() => {
    const filterTrends = () => {
      let filtered = [...trends];
      
      // Category filter
      if (activeCategory !== 'all') {
        filtered = filtered.filter(trend => trend.category === activeCategory);
      }

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(trend => 
          trend.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trend.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredTrends(filtered);
    };

    filterTrends();
  }, [trends, activeCategory, searchTerm]);

  // ...rest of the component code...
};

export default TrendDiscovery;
