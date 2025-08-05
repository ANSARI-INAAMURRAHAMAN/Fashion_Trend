import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add axios interceptor to attach token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (!config.baseURL) {
            config.baseURL = API_URL;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const authHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

export const authService = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error);
            throw error;
        }
    },

    login: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
// services/api.js mein add karein
export const shareTrend = async (trendId, userEmails, role = 'viewer') => {
    const response = await fetch('/api/trends/share', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ trendId, userEmails, role })
    });
    return response.json();
};

export const addComment = async (trendId, content) => {
    const response = await fetch(`/api/trends/${trendId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
    });
    return response.json();
};

export const userService = {
    getProfile: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users/profile`);
            return response.data;
        } catch (error) {
            console.error('Profile fetch error:', error.response?.data || error);
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await axios.put(`${API_URL}/api/users/profile`, userData);
            return response.data;
        } catch (error) {
            console.error('Profile update error:', error.response?.data || error);
            throw error;
        }
    },

    refreshCounts: async () => {
        try {
            const response = await axios.post(`${API_URL}/api/users/refresh-counts`);
            return response.data;
        } catch (error) {
            console.error('Refresh counts error:', error.response?.data || error);
            throw error;
        }
    }
};

export const reportsService = {
    getMetrics: async () => {
        try {
            // Temporary mock data until backend is ready
            const mockData = {
                trendAccuracy: 85,
                accuracyChange: 5,
                insights: [
                    {
                        title: "Rising Trends",
                        description: "Sustainable fashion trends have increased by 45% this quarter"
                    },
                    {
                        title: "Prediction Accuracy",
                        description: "AI model accuracy improved by 12% after recent updates"
                    },
                    {
                        title: "Team Collaboration",
                        description: "Cross-team collaboration increased by 30% this month"
                    }
                ],
                kpiData: {
                    trendsAnalyzed: 250,
                    activeUsers: 120,
                    predictions: 89,
                    teamProjects: 45
                },
                monthlyTrends: [
                    { month: 'Jan', value: 65 },
                    { month: 'Feb', value: 72 },
                    { month: 'Mar', value: 85 },
                    { month: 'Apr', value: 78 }
                ]
            };

            // Comment out actual API call for now
            // const response = await axios.get(`${API_URL}/api/reports/metrics`);
            // return response.data;

            return mockData;
        } catch (error) {
            console.error('Metrics fetch error:', error);
            throw error;
        }
    },

    exportReport: async (format) => {
        try {
            // Mock export functionality
            const mockBlob = new Blob(['Mock report data'], { type: 'text/plain' });
            return mockBlob;
            
            // Uncomment when backend is ready
            // const response = await axios.get(`${API_URL}/api/reports/export`, {
            //     params: { format },
            //     responseType: 'blob'
            // });
            // return response.data;
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }
};

export const sustainabilityService = {
    getSustainabilityData: async () => {
        try {
            // Temporary mock data until backend is ready
            const mockData = {
                carbonFootprint: 1250,
                wasteReduced: 750,
                sustainableTrends: [
                    {
                        title: "Eco-Friendly Materials",
                        description: "Using recycled fabrics and sustainable materials",
                        imageUrl: "https://example.com/eco-fashion.jpg",
                        sustainableMaterials: ["Recycled Polyester", "Organic Cotton", "Hemp"]
                    }
                ],
                recommendations: [
                    {
                        title: "Reduce Waste",
                        description: "Implement zero-waste pattern cutting techniques"
                    },
                    {
                        title: "Energy Efficiency",
                        description: "Use energy-efficient manufacturing processes"
                    }
                ]
            };
            return mockData;
        } catch (error) {
            console.error('Sustainability data fetch error:', error);
            throw error;
        }
    }
};

export const trendAnalysisService = {
    getTrendAnalysis: async (timeRange = '3M', regions = ['global']) => {
        try {
            const response = await axios.get(`${API_URL}/api/trend-analysis/analysis`, {
                params: {
                    timeRange,
                    regions: regions.join(',')
                },
                headers: authHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trend analysis:', error);
            // Fallback to mock data if API fails
            const mockData = {
                current: {
                    global: Array.from({ length: 30 }, (_, i) => ({
                        day: i + 1,
                        popularity: 70 + Math.random() * 30,
                        engagement: 65 + Math.random() * 25,
                        retention: 80 + Math.random() * 15,
                        growth: 5 + Math.random() * 20,
                        revenue: 500 + Math.random() * 300,
                        users: 1000 + Math.random() * 500
                    }))
                },
                strengthIndicators: {
                    'Market Penetration': 75 + Math.random() * 20,
                    'Engagement Rate': 68 + Math.random() * 25,
                    'Growth Momentum': 82 + Math.random() * 15,
                    'Trend Velocity': 71 + Math.random() * 20
                },
                demographics: {
                    regions: [
                        { name: 'GLOBAL', value: 35 + Math.random() * 20 },
                        { name: 'NA', value: 28 + Math.random() * 15 },
                        { name: 'EU', value: 22 + Math.random() * 10 },
                        { name: 'ASIA', value: 15 + Math.random() * 8 }
                    ],
                    ageGroups: [
                        { group: '18-24', percentage: 30 + Math.random() * 10 },
                        { group: '25-34', percentage: 40 + Math.random() * 10 },
                        { group: '35-44', percentage: 20 + Math.random() * 5 },
                        { group: '45+', percentage: 10 + Math.random() * 5 }
                    ]
                },
                businessImpact: {
                    predictedSales: 15000000 + Math.random() * 5000000,
                    markdownRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
                }
            };
            return mockData;
        }
    },

    getKeywordTrends: async (keyword, timeframe = '3M', region = '') => {
        try {
            const response = await axios.get(`${API_URL}/api/trend-analysis/keyword/${keyword}`, {
                params: { timeframe, region },
                headers: authHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching keyword trends:', error);
            throw error;
        }
    },

    getRelatedQueries: async (keyword, region = '') => {
        try {
            const response = await axios.get(`${API_URL}/api/trend-analysis/related/${keyword}`, {
                params: { region },
                headers: authHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching related queries:', error);
            throw error;
        }
    },

    getDemographics: async (trendId) => {
        try {
            const response = await axios.get(`${API_URL}/api/trends/demographics/${trendId}`);
            return response.data;
        } catch (error) {
            console.error('Demographics fetch error:', error);
            throw error;
        }
    }
};

export default axios;