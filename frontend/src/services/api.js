import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add axios interceptor to attach token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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