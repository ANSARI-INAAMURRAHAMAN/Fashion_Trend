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

// Add default parameters for pagination
const DEFAULT_PARAMS = {
  page: 1,
  limit: 10
};

export const fetchTrends = (params = DEFAULT_PARAMS) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'FETCH_TRENDS_REQUEST' });
    
    // Ensure params has default values
    const queryParams = {
      ...DEFAULT_PARAMS,
      ...params
    };

    console.log('Fetching trends with params:', queryParams);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/trends?page=${queryParams.page}&limit=${queryParams.limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received trends data:', data);

    const newTrends = data.data || [];
    const updatedTrends = queryParams.page === 1 ? newTrends : [...getState().trends.trends, ...newTrends];

    dispatch({ 
      type: 'FETCH_TRENDS_SUCCESS', 
      payload: updatedTrends
    });

    return newTrends;
  } catch (error) {
    console.error('Error fetching trends:', error);
    dispatch({ 
      type: 'FETCH_TRENDS_FAILURE', 
      payload: error.message 
    });
    return [];
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
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to create a trend');
    }

    const response = await api.post('/api/trends', trendData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    dispatch({
      type: CREATE_TREND_SUCCESS,
      payload: response.data
    });
    
    // Fetch trends with default parameters after creating
    await dispatch(fetchTrends());
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
