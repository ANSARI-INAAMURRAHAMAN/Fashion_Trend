// src/redux/reducers/trendReducer.js

const initialState = {
    trends: [],
  };
  
  const trendReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_TRENDS':
        return {
          ...state,
          trends: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default trendReducer;
  