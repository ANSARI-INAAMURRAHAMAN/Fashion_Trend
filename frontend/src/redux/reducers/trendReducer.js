// src/redux/reducers/trendReducer.js
import {
  FETCH_TRENDS_REQUEST,
  FETCH_TRENDS_SUCCESS,
  FETCH_TRENDS_FAIL,
  SET_TREND_FILTERS,
  CLEAR_TREND_FILTERS,
  CREATE_TREND,
  GET_TRENDS,
  GET_TREND,
  UPDATE_TREND,
  DELETE_TREND,
  TREND_ERROR,
  CLEAR_TREND
} from '../types';

const initialState = {
  trends: [],
  currentTrend: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    season: '',
    gender: '',
    region: '',
    status: '',
    minPopularity: 0,
    minEngagement: 0
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  }
};

export default function trendReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_TRENDS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_TRENDS_SUCCESS:
      return {
        ...state,
        loading: false,
        trends: action.payload.data,
        pagination: action.payload.pagination
      };
    case FETCH_TRENDS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case SET_TREND_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case CLEAR_TREND_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };
    case GET_TRENDS:
      return {
        ...state,
        trends: payload,
        loading: false
      };
    case GET_TREND:
      return {
        ...state,
        currentTrend: payload,
        loading: false
      };
    case CREATE_TREND:
      return {
        ...state,
        trends: [payload, ...state.trends],
        loading: false
      };
    case UPDATE_TREND:
      return {
        ...state,
        trends: state.trends.map(trend =>
          trend._id === payload._id ? payload : trend
        ),
        loading: false
      };
    case DELETE_TREND:
      return {
        ...state,
        trends: state.trends.filter(trend => trend._id !== payload),
        loading: false
      };
    case TREND_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_TREND:
      return {
        ...state,
        currentTrend: null,
        loading: false
      };
    default:
      return state;
  }
}