import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { initializeApp } from 'firebase/app'; // For Firebase client-side app
import { getFirestore } from 'firebase/firestore'; // For Firestore if needed client-side

// Your NEW, CORRECT Firebase configuration for the Web app (provided directly by you)
const firebaseConfig = {
  apiKey: "AIzaSyBw4cMzV0LzPJhl71nIOz3f92zLsZC8Hs4",
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.firebasestorage.app", // This one is different!
  messagingSenderId: "277123240771",
  appId: "1:277123240771:web:b7ab5ffa029579f04115f6"
};

// Initialize Firebase client-side app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Automatically sign in anonymously if no user is logged in (for testing)
    const signInAnon = async () => {
      // Only attempt anonymous sign-in if no user is logged in AND loading is false (initial check complete)
      if (!auth.currentUser && !loading) {
        try {
          console.log("Attempting anonymous sign-in...");
          await signInAnonymously(auth);
          console.log("Signed in anonymously.");
        } catch (error) {
          console.error("Error signing in anonymously:", error);
          // It's useful to log the actual error code and message here
          console.error(`Anonymous sign-in error code: ${error.code}, message: ${error.message}`);
        }
      }
    };

    // If initial loading check is done and no user, try anonymous sign-in
    if (!loading && !user) {
        signInAnon();
    }


    return () => unsubscribe(); // Clean up the listener
  }, [loading]); // Depend on loading and user state to trigger anonymous sign-in after initial check

  return (
    <AuthContext.Provider value={{ user, loading, auth, db }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};