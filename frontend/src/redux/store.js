import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Named import for redux-thunk
import rootReducer from './reducers'; // Import your root reducer

const store = createStore(
  rootReducer, // your combined reducers
  applyMiddleware(thunk) // Apply redux-thunk middleware for async actions
);

export default store;
