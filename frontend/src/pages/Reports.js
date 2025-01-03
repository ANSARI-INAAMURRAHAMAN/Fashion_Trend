import React, { useState, useEffect } from 'react';
import { FileDown, BarChart2, TrendingUp, Download } from 'lucide-react';
import { reportsService } from '../services/api';
import '../styles/Reports.css';

const Reports = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exportFormat, setExportFormat] = useState('pdf');

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const data = await reportsService.getMetrics();
            setMetrics(data);
        } catch (err) {
            setError('Failed to load metrics');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await reportsService.exportReport(exportFormat);
            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `fashion-trends-report.${exportFormat}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Export failed');
        }
    };

    if (loading) return <div className="loading">Loading reports...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="reports-container">
            <header className="reports-header">
                <h1><BarChart2 className="header-icon" /> Analytics & Reports</h1>
                <div className="export-controls">
                    <select 
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="format-select"
                    >
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                    </select>
                    <button onClick={handleExport} className="export-button">
                        <FileDown size={16} />
                        Export Report
                    </button>
                </div>
            </header>

            <div className="metrics-grid">
                <div className="metric-card">
                    <TrendingUp className="metric-icon" />
                    <h3>Trend Accuracy</h3>
                    <p className="metric-value">{metrics?.trendAccuracy || 0}%</p>
                    <div className="metric-change positive">
                        +{metrics?.accuracyChange || 0}%
                    </div>
                </div>
                <div className="metric-card">
                    <h3>Trends Analyzed</h3>
                    <p className="metric-value">{metrics?.kpiData?.trendsAnalyzed || 0}</p>
                </div>
                <div className="metric-card">
                    <h3>Active Users</h3>
                    <p className="metric-value">{metrics?.kpiData?.activeUsers || 0}</p>
                </div>
                <div className="metric-card">
                    <h3>Successful Predictions</h3>
                    <p className="metric-value">{metrics?.kpiData?.predictions || 0}%</p>
                </div>
            </div>

            <section className="kpi-section">
                <h2>Key Performance Indicators</h2>
                <div className="kpi-chart">
                    {/* Add your chart component here */}
                </div>
            </section>

            <section className="insights-section">
                <h2>Key Insights</h2>
                <div className="insights-grid">
                    {metrics?.insights?.map((insight, index) => (
                        <div key={index} className="insight-card">
                            <h4>{insight.title}</h4>
                            <p>{insight.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Reports;
