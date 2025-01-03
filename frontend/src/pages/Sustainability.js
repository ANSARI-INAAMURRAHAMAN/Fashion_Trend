import React, { useState, useEffect } from 'react';
import { Leaf, Recycle, TreePine, AlertCircle } from 'lucide-react';
import { sustainabilityService } from '../services/api';
import '../styles/Sustainability.css';

const Sustainability = () => {
    const [sustainabilityData, setSustainabilityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await sustainabilityService.getSustainabilityData();
                setSustainabilityData(data || {
                    carbonFootprint: 0,
                    wasteReduced: 0,
                    sustainableTrends: [],
                    recommendations: []
                });
            } catch (err) {
                console.error('Error fetching sustainability data:', err);
                setError('Failed to load sustainability data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading sustainability insights...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="sustainability-container">
            <header className="sustainability-header">
                <h1><Leaf className="icon" /> Sustainability Insights</h1>
                <p>Making fashion eco-friendly, one trend at a time</p>
            </header>

            <div className="metrics-grid">
                <div className="metric-card">
                    <TreePine className="metric-icon" />
                    <h3>Environmental Impact</h3>
                    <p className="metric-value">{sustainabilityData?.carbonFootprint || '0'} kg</p>
                    <p className="metric-label">Carbon Footprint Reduced</p>
                </div>

                <div className="metric-card">
                    <Recycle className="metric-icon" />
                    <h3>Waste Reduction</h3>
                    <p className="metric-value">{sustainabilityData?.wasteReduced || '0'} kg</p>
                    <p className="metric-label">Textile Waste Saved</p>
                </div>
            </div>

            <section className="eco-trends-section">
                <h2>Sustainable Trends</h2>
                <div className="trends-grid">
                    {sustainabilityData?.sustainableTrends?.map((trend, index) => (
                        <div key={index} className="trend-card">
                            <div className="trend-image">
                                <img src={trend.imageUrl} alt={trend.title} />
                                <span className="eco-badge">
                                    <Leaf size={16} /> Eco-friendly
                                </span>
                            </div>
                            <div className="trend-content">
                                <h3>{trend.title}</h3>
                                <p>{trend.description}</p>
                                <div className="eco-materials">
                                    {trend.sustainableMaterials?.map((material, idx) => (
                                        <span key={idx} className="material-tag">{material}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="recommendations-section">
                <h2>Sustainability Tips</h2>
                <div className="tips-grid">
                    {sustainabilityData?.recommendations?.map((tip, index) => (
                        <div key={index} className="tip-card">
                            <AlertCircle className="tip-icon" />
                            <h4>{tip.title}</h4>
                            <p>{tip.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Sustainability;
