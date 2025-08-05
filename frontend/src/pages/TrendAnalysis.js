import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { trendAnalysisService } from '../services/api';
import { 
  LineChart, Line, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Scatter, ComposedChart, PieChart, Pie, Cell
} from 'recharts';
import { Gauge } from '../components/Gauge';
import '../styles/TrendAnalysis.css';

// Add COLORS constant
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TrendAnalysisDashboard = () => {
  // Enhanced state management
  const [timeRange, setTimeRange] = useState('1M');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState(['popularity']);
  const [chartType, setChartType] = useState('composed');
  const [dateFilter, setDateFilter] = useState('all');
  const [threshold, setThreshold] = useState(50);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState(['global']);
  const [isLoading, setIsLoading] = useState(false);

  // Add new state for trend analysis data
  const [trendData, setTrendData] = useState({
    strengthIndicators: {},
    demographics: { 
      regions: [], 
      ageGroups: [] 
    },
    businessImpact: { 
      predictedSales: 0, 
      markdownRisk: 'low' 
    }
  });

  // Add state for storing API data
  const [apiData, setApiData] = useState({
    current: { global: [] },
    previous: { global: [] }
  });

  // Add useEffect to fetch trend analysis data
  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setIsLoading(true);
        const fetchedData = await trendAnalysisService.getTrendAnalysis(timeRange, selectedRegions);
        setTrendData(fetchedData);
        
        // Update the data state with real Google Trends data
        setApiData({
          current: fetchedData.current,
          previous: fetchedData.current // You can add previous period logic
        });
        
      } catch (error) {
        console.error('Failed to fetch trend analysis:', error);
        // Fallback to mock data if API fails
        setTrendData({
          strengthIndicators: {},
          demographics: { regions: [], ageGroups: [] },
          businessImpact: { predictedSales: 0, markdownRisk: 'low' }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendData();
  }, [timeRange, selectedRegions]);

  // Mock data generator with enhanced data points
  const generateMockData = (period, baseline = 100, region = 'global') => {
    const dataPoints = period === '1M' ? 30 : period === '3M' ? 90 : 180;
    return Array.from({ length: dataPoints }, (_, i) => ({
      day: i + 1,
      popularity: baseline - Math.random() * 20,
      engagement: (baseline - 10) - Math.random() * 15,
      retention: (baseline - 15) - Math.random() * 25,
      growth: (baseline - 5) - Math.random() * 18,
      revenue: Math.random() * 1000,
      users: Math.floor(Math.random() * 1000),
      region: region
    }));
  };

  const metrics = useMemo(() => [
    { id: 'popularity', color: '#8884d8', label: 'Popularity Score' },
    { id: 'engagement', color: '#82ca9d', label: 'Engagement Rate' },
    { id: 'retention', color: '#ffc658', label: 'Retention Rate' },
    { id: 'growth', color: '#ff7c43', label: 'Growth Rate' },
    { id: 'revenue', color: '#4CAF50', label: 'Revenue' },
    { id: 'users', color: '#E91E63', label: 'Active Users' }
  ], []);

  const regions = useMemo(() => ['global', 'na', 'eu', 'asia', 'latam'], []);

  // Generate data for all regions
  const data = useMemo(() => {
    const generateRegionalData = () => {
      return regions.reduce((acc, region) => {
        acc[region] = generateMockData(timeRange, 100, region);
        return acc;
      }, {});
    };

    return {
      current: generateRegionalData(),
      previous: generateRegionalData()
    };
  }, [timeRange, regions]);

  // Filter and process data based on selected options
  const processedData = useMemo(() => {
    // Use API data if available, otherwise use mock data
    const currentData = Object.keys(apiData.current).length > 0 && apiData.current.global.length > 0 
      ? apiData.current 
      : data.current;
    
    let filteredData = [];
    
    // Ensure we have valid data structure
    if (!currentData || typeof currentData !== 'object') {
      return [];
    }
    
    selectedRegions.forEach(region => {
      if (currentData[region] && Array.isArray(currentData[region])) {
        // Filter out any invalid data points
        const validData = currentData[region].filter(item => 
          item && typeof item === 'object' && 
          selectedMetrics.every(metric => typeof item[metric] === 'number')
        );
        filteredData = [...filteredData, ...validData];
      }
    });

    if (dateFilter !== 'all') {
      const days = dateFilter === 'week' ? 7 : dateFilter === 'month' ? 30 : 90;
      filteredData = filteredData.slice(-days);
    }

    if (threshold > 0) {
      filteredData = filteredData.filter(item => 
        selectedMetrics.some(metric => item[metric] && item[metric] > threshold)
      );
    }

    return filteredData;
  }, [apiData, data, selectedRegions, dateFilter, threshold, selectedMetrics]);

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">Day {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-entry">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="tooltip-value">
              {entry.name === 'revenue' ? `$${entry.value.toFixed(2)}` : entry.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Enhanced chart renderer with multiple chart types
  const renderChart = useCallback(() => {
    // Safety check: ensure we have valid data before rendering charts
    if (!processedData || processedData.length === 0) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '300px',
          color: '#9ca3af'
        }}>
          <p>No data available for the selected filters</p>
        </div>
      );
    }
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map(metricId => {
              const metric = metrics.find(m => m.id === metricId);
              return (
                <Line
                  key={metricId}
                  type="monotone"
                  dataKey={metricId}
                  stroke={metric.color}
                  dot={false}
                />
              );
            })}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map(metricId => {
              const metric = metrics.find(m => m.id === metricId);
              return (
                <Bar
                  key={metricId}
                  dataKey={metricId}
                  fill={metric.color}
                />
              );
            })}
          </BarChart>
        );

      case 'radar':
        return (
          <RadarChart outerRadius={150} data={processedData.slice(-1)}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="day" stroke="#94a3b8" />
            <PolarRadiusAxis stroke="#94a3b8" />
            {selectedMetrics.map(metricId => {
              const metric = metrics.find(m => m.id === metricId);
              return (
                <Radar
                  key={metricId}
                  name={metric.label}
                  dataKey={metricId}
                  stroke={metric.color}
                  fill={metric.color}
                  fillOpacity={0.6}
                />
              );
            })}
            <Legend />
          </RadarChart>
        );

      case 'composed':
      default:
        return (
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map(metricId => {
              const metric = metrics.find(m => m.id === metricId);
              return (
                <React.Fragment key={metricId}>
                  <Area
                    type="monotone"
                    dataKey={metricId}
                    fill={`${metric.color}33`}
                    stroke={metric.color}
                    strokeWidth={2}
                  />
                  {comparisonMode && (
                    <Line
                      type="monotone"
                      dataKey={`${metricId}Prev`}
                      stroke={metric.color}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                  <Scatter dataKey={metricId} fill={metric.color} />
                </React.Fragment>
              );
            })}
          </ComposedChart>
        );
    }
  }, [chartType, comparisonMode, selectedMetrics, processedData, metrics]);

  // Additional interactive features
  const addAnnotation = (event) => {
    if (!showAnnotations) return;
    // Implementation for adding annotations
  };

  // Update renderStrengthIndicators to use trendData
  const renderStrengthIndicators = () => (
    <div className="strength-indicators">
      <h2>Trend Strength Indicators</h2>
      <div className="indicators-grid">
        {Object.entries(trendData.strengthIndicators || {}).map(([key, value]) => (
          <div key={key} className="indicator-card">
            <Gauge value={value} title={key} />
          </div>
        ))}
      </div>
    </div>
  );

  // Update renderDemographicAnalysis to use trendData
  const renderDemographicAnalysis = () => (
    <div className="demographic-analysis">
      <h2>Demographic Analysis</h2>
      <div className="demographics-grid">
        <div className="chart-container">
          <h3>Regional Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trendData.demographics?.regions || []}
                dataKey="value"
                nameKey="name"
                label
              >
                {(trendData.demographics?.regions || []).map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Age Group Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData.demographics?.ageGroups || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Update renderBusinessImpact to use trendData
  const renderBusinessImpact = () => (
    <div className="business-impact">
      <h2>Business Impact</h2>
      <div className="impact-metrics">
        <div className="metric-card">
          <h3>Predicted Sales</h3>
          <p className="metric-value">
            ${(trendData.businessImpact.predictedSales / 1000000).toFixed(1)}M
          </p>
          <p className="metric-label">Expected Revenue</p>
        </div>
        <div className="metric-card">
          <h3>Markdown Risk</h3>
          <p className={`metric-value risk-${trendData.businessImpact.markdownRisk}`}>
            {trendData.businessImpact.markdownRisk.toUpperCase()}
          </p>
          <p className="metric-label">Risk Level</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">Loading Google Trends data...</div>
          </div>
        )}
        
        <div className="header">
          <div className="header-title">
            <h1>Trend Analysis</h1>
            <p>Real-time insights and metrics powered by Google Trends</p>
          </div>
          <div className="header-controls">
            <button 
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`control-button ${comparisonMode ? 'active' : ''}`}
            >
              Compare
            </button>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="control-select"
            >
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
            </select>
            <button 
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`control-button ${showAnnotations ? 'active' : ''}`}
            >
              Annotations
            </button>
          </div>
        </div>

        <div className="controls-panel">
          <div className="chart-controls">
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="control-select"
            >
              <option value="composed">Composed</option>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="radar">Radar</option>
            </select>
            
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="control-select"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>

            <div className="threshold-control">
              <label>Threshold: {threshold}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="threshold-slider"
              />
            </div>
          </div>

          <div className="region-controls">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegions(prev => 
                    prev.includes(region)
                      ? prev.filter(r => r !== region)
                      : [...prev, region]
                  );
                }}
                className={`region-button ${selectedRegions.includes(region) ? 'active' : ''}`}
              >
                {region.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="metrics-toggle">
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => {
                setSelectedMetrics(prev => 
                  prev.includes(metric.id)
                    ? prev.filter(id => id !== metric.id)
                    : [...prev, metric.id]
                );
              }}
              className={`metric-button ${selectedMetrics.includes(metric.id) ? 'active' : ''}`}
              style={{ 
                borderColor: selectedMetrics.includes(metric.id) ? metric.color : undefined 
              }}
            >
              {metric.label}
            </button>
          ))}
        </div>

        <div className="chart-container" onClick={addAnnotation}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        <div className="metrics-grid">
          {selectedMetrics.map(metricId => {
            const metric = metrics.find(m => m.id === metricId);
            
            // Add safety checks for data access
            if (!processedData || processedData.length === 0) {
              return (
                <div key={metricId} className="metric-card">
                  <h3>{metric?.label || 'Loading...'}</h3>
                  <div className="metric-value">
                    <p style={{ color: metric?.color || '#8884d8' }}>
                      Loading...
                    </p>
                  </div>
                </div>
              );
            }

            const lastDataPoint = processedData[processedData.length - 1];
            const firstDataPoint = processedData[0];
            
            // Ensure data points exist and have the required properties
            if (!lastDataPoint || !firstDataPoint || 
                lastDataPoint[metricId] === undefined || 
                firstDataPoint[metricId] === undefined) {
              return (
                <div key={metricId} className="metric-card">
                  <h3>{metric?.label || 'Unknown'}</h3>
                  <div className="metric-value">
                    <p style={{ color: metric?.color || '#8884d8' }}>
                      No data
                    </p>
                  </div>
                </div>
              );
            }

            const currentValue = lastDataPoint[metricId];
            const previousValue = firstDataPoint[metricId];
            const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue * 100).toFixed(1) : '0.0';

            return (
              <div key={metricId} className="metric-card">
                <h3>{metric.label}</h3>
                <div className="metric-value">
                  <p style={{ color: metric.color }}>
                    {metricId === 'revenue' ? `$${currentValue.toFixed(2)}` : currentValue.toFixed(1)}
                  </p>
                  {comparisonMode && (
                    <span className={change > 0 ? 'positive' : 'negative'}>
                      {change}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {renderStrengthIndicators()}
        {renderDemographicAnalysis()}
        {renderBusinessImpact()}
      </div>
    </div>
  );
};

export default TrendAnalysisDashboard;