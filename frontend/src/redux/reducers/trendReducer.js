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
  trends: [], // Initialize as empty array
  loading: false,
  error: null,
  filters: {}
};

const trendReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TRENDS_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_TRENDS_SUCCESS':
      return {
        ...state,
        loading: false,
        trends: action.payload,
        error: null
      };
    case 'FETCH_TRENDS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default trendReducer;