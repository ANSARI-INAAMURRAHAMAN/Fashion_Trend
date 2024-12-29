// src/redux/actions/trendActions.js

export const fetchTrends = () => async (dispatch) => {
    try {
      const response = await fetch('https://api.example.com/trends'); // Replace with your actual API endpoint
      const data = await response.json();
  
      // Dispatch the data to Redux store
      dispatch({
        type: 'SET_TRENDS',
        payload: data,
      });
    } catch (error) {
      console.error('Error fetching trends:', error);
      // Optionally handle errors, e.g., dispatch an error action
    }
  };
  