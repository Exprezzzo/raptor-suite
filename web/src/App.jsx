import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AuthRoutes from './routes/AuthRoutes';
import MainRoutes from './routes/MainRoutes';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider and useAuth

// Separate component to use auth context, ensuring AuthProvider wraps it
function AppContent() {
  const { user, loading } = useAuth(); // Use the useAuth hook

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div> {/* Spinner from previous App.jsx */}
          <p>Loading Raptor Suite…</p> {/* Text from previous App.jsx */}
        </div>
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

// Main App component with AuthProvider
// AuthProvider must wrap any components that use the useAuth hook
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;