// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import trendReducer from './trendReducer';

const rootReducer = combineReducers({
  trend: trendReducer, // Add more reducers here as your app grows
});

export default rootReducer;
