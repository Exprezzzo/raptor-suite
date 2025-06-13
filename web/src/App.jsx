// raptor-suite/web/src/App.jsx (UPDATED)

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // Firebase v9 modular API

import './index.css'; // Global CSS for the web app
import './App.css'; // Specific App component CSS
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Import Firebase (just to ensure it's initialized, though services are exported from firebase.js)
import { auth } from './firebase'; // Import auth service

// Import the new route components
import AuthRoutes from './routes/AuthRoutes';
import MainRoutes from './routes/MainRoutes';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-loading-screen">
        <p>Loading application...</p>
        {/* You could add a spinner or more elaborate loading UI here */}
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Header />

        <main className="app-main-content">
          {user ? <MainRoutes /> : <AuthRoutes />}
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;