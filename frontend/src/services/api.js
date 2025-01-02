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
    }
};

export default axios;