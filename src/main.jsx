import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './App.jsx'; // Corrected import to match default export from App.jsx
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp /> {/* Render the RootApp component */}
  </React.StrictMode>,
);