import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth(); // Destructure user and logout from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Call logout from context
      navigate('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="app-logo">
          🦅 Raptor Suite
        </Link>
        <nav className="main-nav">
          {user && ( // Only show navigation links if a user is logged in
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/workspace">Workspace</Link></li> {/* Added Workspace link per integration plan */}
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/billing">Billing</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
          )}
        </nav>
        <div className="user-actions">
          {user ? ( // Display user's email and Logout button if user is logged in
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-300">
                {user.displayName || user.email}
              </span>
              {user.photoURL && ( // Display photo if available
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="h-8 w-8 rounded-full ring-2 ring-purple-500/50"
                />
              )}
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </div>
          ) : ( // Display Login / Register button if no user is logged in
            <button 
              onClick={() => navigate('/signin')}
              className="login-button"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;