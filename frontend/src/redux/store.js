// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import trendReducer from './reducers/trendReducer';

export default configureStore({
    reducer: {
        auth: authReducer,
        trends: trendReducer
    }
});