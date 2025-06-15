// C:\Users\Owner\Projects\raptor-suite\web\src\contexts\AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  // Import the specific Firebase SDK functions as aliases (good practice)
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
  // Import the already initialized Firebase service instances directly
  auth, // <-- Changed: Import the initialized auth instance
  db,   // <-- Changed: Import the initialized firestore instance
  doc,
  setDoc,
  serverTimestamp
} from '../config/firebase'; // Importing from the optimized firebase config

// Create the AuthContext
const AuthContext = createContext({});

// Custom hook to easily access auth context values
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps the application to provide auth context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to set up the authentication state listener
  useEffect(() => {
    let unsubscribe = null; // Variable to hold the unsubscribe function from onAuthStateChanged

    const setupAuthListener = async () => {
      try {
        // Use the directly imported 'auth' instance for the listener
        unsubscribe = firebaseOnAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    setupAuthListener(); // Call the setup function

    // Cleanup function: unsubscribe from the auth listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to handle user sign-in
  const signIn = async (email, password) => {
    try {
      setError(null); // Clear any previous errors
      const userCredential = await firebaseSignIn(email, password); // Use aliased signInWithEmailAndPassword
      return userCredential.user;
    } catch (err) {
      setError(err.message); // Set error message
      throw err; // Re-throw the error for component-level handling
    }
  };

  // Function to handle user sign-up and create a Firestore profile
  const signUp = async (email, password) => {
    try {
      setError(null); // Clear any previous errors
      const userCredential = await firebaseCreateUser(email, password); // Use aliased createUserWithEmailAndPassword

      // Create user profile in Firestore
      // Use the directly imported 'db' instance
      const userDocRef = doc(db, 'users', userCredential.user.uid); // Use 'db' directly, no 'await getFirestore()' needed
      const timestamp = serverTimestamp(); // Get a server timestamp for creation time

      await setDoc(userDocRef, {
        email: userCredential.user.email,
        createdAt: timestamp,
        role: 'user', // Default role for new users
        displayName: userCredential.user.email ? userCredential.user.email.split('@')[0] : 'New User', // Safe display name
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message); // Set error message
      throw err; // Re-throw the error
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      setError(null); // Clear any previous errors
      await firebaseSignOut(); // Use aliased signOut
    } catch (err) {
      setError(err.message); // Set error message
      throw err; // Re-throw the error
    }
  };

  // Value object to be provided by the AuthContext
  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    logout
  };

  // Render the provider, making the 'value' available to children components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};