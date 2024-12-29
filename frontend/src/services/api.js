// services/api.js
import axios from 'axios';

// Remove the extra /api from the base URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const authService = {
    register: async (userData) => {
        try {
            // Note the single /api in the URL
            const response = await axios.post(`${API_URL}/api/auth/register`, userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
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
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};