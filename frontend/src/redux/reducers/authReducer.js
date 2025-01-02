// redux/reducers/authReducer.js
import {
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAIL,
    LOGOUT,
    CLEAR_ERROR
} from '../types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case AUTH_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case AUTH_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                loading: false
            };
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
}