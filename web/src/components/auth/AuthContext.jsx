// raptor-suite/web/src/components/auth/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase'; // Import Firebase auth and db services
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Create AuthContext
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap your app or parts of it
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null); // To store Firestore user data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user profile from Firestore if user is authenticated
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            console.log("User profile not found in Firestore.");
            setUserProfile(null); // Clear profile if not found
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null); // Clear profile on error
        }
      } else {
        setUserProfile(null); // Clear profile when logged out
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile, // Expose user profile from Firestore
    loading,
    // You can add more auth-related functions here, e.g., login, signup, logout
    // For now, we'll rely on Firebase directly for these, or use AuthForm component
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children once authentication state is determined */}
    </AuthContext.Provider>
  );
};