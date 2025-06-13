// raptor-suite/web/src/components/common/Header.jsx (UPDATED)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase v9 modular API
import { auth } from '../../firebase'; // Import auth service
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin'); // Redirect to sign-in page after logout
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="app-logo">
          Raptor Suite Admin
        </Link>
        <nav className="main-nav">
          {user && ( // Only show main navigation links if user is logged in
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/billing">Billing</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
          )}
        </nav>
        <div className="user-actions">
          {user ? (
            <button className="logout-button" onClick={handleLogout}>
              Logout ({user.email})
            </button>
          ) : (
            <button className="login-button" onClick={() => navigate('/signin')}>
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;