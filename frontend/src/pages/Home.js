import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, FileBarChart, ChevronRight } from 'lucide-react';
import '../styles/Home.css';
import trendService from '../services/trendService';
import { getGoogleDriveImageUrl } from '../utils/driveUtils';
import trend1 from '../assets/images/trends/trend1.jpg';
// import trend2 from '../assets/images/trends/trend2.jpg';
// import trend3 from '../assets/images/trends/trend3.jpg';
// import trend4 from '../assets/images/trends/trend4.jpg';
import { getImageDimensions } from '../utils/imageUtils';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [recentTrends, setRecentTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, trendsData] = await Promise.all([
          trendService.getTrendingCategories(),
          trendService.getRecentTrends()
        ]);

        setCategories(categoriesData);
        setRecentTrends(trendsData.trends);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const marketData = [
    { month: 'Jan', growth: 65 },
    { month: 'Feb', growth: 68 },
    { month: 'Mar', growth: 75 },
    { month: 'Apr', growth: 82 },
    { month: 'May', growth: 85 },
    { month: 'Jun', growth: 89 }
  ];

  const fashionTrends = [
    {
      id: 1,
      title: "Sustainable Street Wear",
      description: "Urban fashion meets eco-consciousness",
      trend: "+65% Growth",
      image: trend1
    },
    {
      id: 2,
      title: "Neo-Vintage Revival",
      description: "Modern takes on classic styles",
      trend: "+48% Growth",
      image: trend1
    },
    {
      id: 3,
      title: "Tech-Integrated Fashion",
      description: "Smart fabrics and wearable tech",
      trend: "+72% Growth",
      image: trend1
    },
    {
      id: 4,
      title: "Minimalist Luxury",
      description: "Sophisticated simplicity in design",
      trend: "+53% Growth",
      image: trend1
    }
  ];

  // Add base64 fallback image
  const fallbackImageBase64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTUwIDEzNUMxNjQuMzU5IDEzNSAxNzYgMTIzLjM1OSAxNzYgMTA5QzE3NiA5NC42NDA2IDE2NC4zNTkgODMgMTUwIDgzQzEzNS42NDEgODMgMTI0IDk0LjY0MDYgMTI0IDEwOUMxMjQgMTIzLjM1OSAxMzUuNjQxIDEzNSAxNTAgMTM1WiIgZmlsbD0iIzk0QTNCNyIvPjxwYXRoIGQ9Ik0xNTYgMTk3SDg3QzgxLjQ3NzIgMTk3IDc3IDE5Mi41MjMgNzcgMTg3VjE4N0M3NyAxNjQuOTEgOTQuOTEgMTQ3IDExNyAxNDdIMTU2QzE3OC4wOSAxNDcgMTk2IDE2NC45MSAxOTYgMTg3VjE4N0MxOTYgMTkyLjUyMyAxOTEuNTIzIDE5NyAxODYgMTk3SDE1NloiIGZpbGw9IiM5NEEzQjciLz48L3N2Zz4=";

  // Enhanced fallback image handling
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  
  const handleImageError = (e, trendId) => {
    console.log('Image failed to load:', e.target.src);
    setImageLoadErrors(prev => ({
      ...prev,
      [trendId]: true
    }));
    if (!e.target.src.startsWith('data:')) {
      e.target.src = fallbackImageBase64;
    }
  };

  const handleImageLoad = async (e, trendId) => {
    const dimensions = await getImageDimensions(e.target.src);
    e.target.classList.remove('loading');
    e.target.classList.add('loaded');
    setLoadedImages(prev => ({
      ...prev,
      [trendId]: dimensions
    }));
  };

  return (
    <div className="home-container" style={{ paddingTop: '64px' }}> {/* Add padding-top for navbar */}
      <div className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Market Style Filters</span>
              <br />
              And Trend Coursing
            </h1>
            <p className="hero-subtitle">
              Discover the Report 2025 Trends Analysis and Market Predictions
            </p>
            <button className="explore-button">
              Explore Trends
              <ChevronRight className="button-icon" />
            </button>
          </div>
          
          <div className="image-container">
            <div className="image-placeholder">
              <span>Trend Image</span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-container purple">
                <TrendingUp className="stat-icon" />
              </div>
              <h3 className="stat-title">Sustainable Fashion Engagement</h3>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill purple-gradient" style={{ width: '45%' }}></div>
              </div>
              <span className="progress-text">45%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-container blue">
                <FileBarChart className="stat-icon" />
              </div>
              <h3 className="stat-title">General Metrics</h3>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill blue-gradient" style={{ width: '85%' }} />
              </div>
              <span className="progress-text">85%</span>
            </div>
          </div>
        </div>

        <div className="fashion-trends-section">
          <h2 className="section-title">Latest Fashion Trends</h2>
          <div className="trends-grid">
            {fashionTrends.map((trend) => (
              <div key={trend.id} className="trend-card">
                <div className="trend-image-container">
                  <img 
                    src={imageLoadErrors[trend.id] ? fallbackImageBase64 : trend.image} 
                    alt={trend.title} 
                    className="trend-image loading"
                    onError={(e) => handleImageError(e, trend.id)}
                    onLoad={(e) => handleImageLoad(e, trend.id)}
                    loading="lazy"
                    style={{
                      objectFit: loadedImages[trend.id]?.aspectRatio < 0.8 ? 'contain' : 'cover'
                    }}
                  />
                  <div className="trend-overlay">
                    <span className="trend-growth">{trend.trend}</span>
                  </div>
                </div>
                <div className="trend-content">
                  <h3 className="trend-title">{trend.title}</h3>
                  <p className="trend-description">{trend.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Market Growth Trends</h3>
          <div className="chart-container">
            <LineChart
              width={800}
              height={300}
              data={marketData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="url(#colorGradient)"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6' }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </LineChart>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;