// redux/actions/authActions.js
import api from '../../services/api';
import {
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAIL,
    LOGOUT,
    CLEAR_ERROR
} from '../types';

// Load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: AUTH_REQUEST });
        
        const { data } = await api.get('/api/users/me');
        
        dispatch({
            type: AUTH_SUCCESS,
            payload: {
                user: data.data,
                token: localStorage.getItem('token')
            }
        });
    } catch (error) {
        dispatch({
            type: AUTH_FAIL,
            payload: error.response?.data?.message || 'Authentication failed'
        });
    }
};

// Login user
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: AUTH_REQUEST });

        const { data } = await api.post('/api/auth/login', { email, password });
        
        dispatch({
            type: AUTH_SUCCESS,
            payload: {
                user: data.user,
                token: data.token
            }
        });
    } catch (error) {
        dispatch({
            type: AUTH_FAIL,
            payload: error.response?.data?.message || 'Login failed'
        });
    }
};

// Logout user
export const logout = () => (dispatch) => {
    dispatch({ type: LOGOUT });
};

// Clear errors
export const clearError = () => ({
    type: CLEAR_ERROR
});