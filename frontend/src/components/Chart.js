// components/Chart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/Chart.css';

const Chart = () => {
  const data = [
    { month: 'Jan', sustainable: 65, athleisure: 45, vintage: 35 },
    { month: 'Feb', sustainable: 68, athleisure: 52, vintage: 38 },
    { month: 'Mar', sustainable: 75, athleisure: 58, vintage: 42 },
    { month: 'Apr', sustainable: 85, athleisure: 65, vintage: 48 },
    { month: 'May', sustainable: 82, athleisure: 68, vintage: 52 },
    { month: 'Jun', sustainable: 90, athleisure: 72, vintage: 58 }
  ];

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <div className="chart-title">
          <h3>Market Growth Trends</h3>
          <p>Monthly trend analysis</p>
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#4CAF50' }}></span>
            <span>Sustainable</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#2196F3' }}></span>
            <span>Athleisure</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#9C27B0' }}></span>
            <span>Vintage</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="sustainable" 
              stroke="#4CAF50" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="athleisure" 
              stroke="#2196F3" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="vintage" 
              stroke="#9C27B0" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
