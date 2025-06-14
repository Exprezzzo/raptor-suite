import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import AuthForm from '../components/auth/AuthForm'; // Assuming AuthForm exists and takes props
import './AuthPage.css'; // Assuming AuthPage.css styles the page

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signIn } = useAuth(); // Destructure signIn from useAuth

  const handleSignIn = async (email, password) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await signIn(email, password); // Call signIn from AuthContext
      navigate('/'); // Navigate to dashboard or home on success
    } catch (err) {
      console.error("Sign-in error:", err); // Log the error for debugging
      setError(err.message); // Set user-friendly error message
    } finally {
      setLoading(false); // Always set loading to false when done
    }
  };

  return (
    <div className="auth-page-container">
      <AuthForm
        type="signin"
        onSubmit={handleSignIn}
        isLoading={loading}
        error={error}
      />
      <p className="auth-switch-text">
        Don't have an account? <span onClick={() => navigate('/signup')} className="auth-link">Sign Up</span>
      </p>
    </div>
  );
};

export default SignInPage;