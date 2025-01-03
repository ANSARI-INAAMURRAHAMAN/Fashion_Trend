import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

// Create a root element for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using createRoot
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
