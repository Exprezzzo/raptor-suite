import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import AuthForm from '../components/auth/AuthForm'; // Assuming AuthForm exists and takes props
import './AuthPage.css'; // Assuming AuthPage.css styles the page

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signUp } = useAuth(); // Destructure signUp from useAuth

  const handleSignUp = async (email, password) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await signUp(email, password); // Call signUp from AuthContext
      navigate('/'); // Navigate to dashboard or home on success
    } catch (err) {
      console.error("Sign-up error:", err); // Log the error for debugging
      setError(err.message); // Set user-friendly error message
    } finally {
      setLoading(false); // Always set loading to false when done
    }
  };

  return (
    <div className="auth-page-container">
      <AuthForm
        type="signup"
        onSubmit={handleSignUp}
        isLoading={loading}
        error={error}
      />
      <p className="auth-switch-text">
        Already have an account? <span onClick={() => navigate('/signin')} className="auth-link">Sign In</span>
      </p>
    </div>
  );
};

export default SignUpPage;