// src/redux/actions/trendActions.js
import { 
  FETCH_TRENDS_REQUEST,
  FETCH_TRENDS_SUCCESS,
  FETCH_TRENDS_FAIL,
  SET_TREND_FILTERS,
  CLEAR_TREND_FILTERS,
  FETCH_TRENDS_SERVER_UNREACHABLE,
  SHARE_TREND_REQUEST,
  SHARE_TREND_SUCCESS,
  SHARE_TREND_FAIL,
  CREATE_TREND_REQUEST,
  CREATE_TREND_SUCCESS,
  CREATE_TREND_FAIL
} from '../types';
import api from '../../services/api';

export const fetchTrends = (filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_TRENDS_REQUEST });

    const response = await api.get('/api/trends', { params: filters });

    dispatch({
      type: FETCH_TRENDS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    if (!error.response) {
      dispatch({
        type: FETCH_TRENDS_SERVER_UNREACHABLE,
        payload: 'Cannot reach server.'
      });
    } else {
      dispatch({
        type: FETCH_TRENDS_FAIL,
        payload: error.response?.data?.message || 'Error fetching trends'
      });
    }
  }
};

export const setTrendFilters = (filters) => ({
  type: SET_TREND_FILTERS,
  payload: filters
});

export const clearTrendFilters = () => ({
  type: CLEAR_TREND_FILTERS
});

export const shareTrend = (trendId, emails) => async (dispatch) => {
  try {
    dispatch({ type: SHARE_TREND_REQUEST });
    await api.post(`/api/trends/${trendId}/share`, { emails });
    dispatch({ type: SHARE_TREND_SUCCESS });
    dispatch(fetchTrends()); // Refresh trends after sharing
  } catch (error) {
    dispatch({
      type: SHARE_TREND_FAIL,
      payload: error.response?.data?.message || 'Error sharing trend'
    });
  }
};

export const addComment = (trendId, content) => async (dispatch) => {
  try {
    await api.post(`/api/trends/${trendId}/comments`, { content });
    // Refresh trends to get updated comments
    dispatch(fetchTrends());
  } catch (error) {
    // Handle error
  }
};

export const createTrend = (trendData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TREND_REQUEST });
    
    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to create a trend');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const response = await api.post('/api/trends', trendData, config);

    dispatch({
      type: CREATE_TREND_SUCCESS,
      payload: response.data.data
    });
    
    dispatch(fetchTrends());
    return response.data;
  } catch (error) {
    console.error('Create trend error:', error.response?.data || error);
    
    const errorMessage = error.response?.status === 401 
      ? 'Please login to create a trend'
      : error.response?.data?.message || 'Error creating trend';
    
    dispatch({
      type: CREATE_TREND_FAIL,
      payload: errorMessage
    });
    
    throw new Error(errorMessage);
  }
};
