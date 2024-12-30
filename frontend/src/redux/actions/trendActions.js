// redux/actions/trendActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import trendService from '../../services/trendService';

export const searchTrends = createAsyncThunk(
  'trends/search',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await trendService.searchTrends(query, page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const filterTrends = createAsyncThunk(
  'trends/filter',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await trendService.filterTrends(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// redux/reducers/trendReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trends: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    total: 1,
    limit: 10
  },
  filters: {
    categories: [],
    regions: [],
    seasons: [],
    priceRange: { min: '', max: '' }
  }
};

const trendSlice = createSlice({
  name: 'trends',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(filterTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(filterTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters } = trendSlice.actions;
export default trendSlice.reducer;

// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import trendReducer from './reducers/trendReducer';

export const store = configureStore({
  reducer: {
    trends: trendReducer
  }
});