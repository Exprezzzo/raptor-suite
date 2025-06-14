import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
  getAuth,
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from '../config/firebase'; // Importing from the optimized firebase config

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    const setupAuthListener = async () => {
      try {
        // Get the auth instance asynchronously
        const authInstance = await getAuth();
        unsubscribe = await firebaseOnAuthStateChanged(authInstance, (user) => { // Pass authInstance to onAuthStateChanged
          setUser(user);
          setLoading(false);
        });
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      const userCredential = await firebaseSignIn(email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email, password) => {
    try {
      setError(null);
      const userCredential = await firebaseCreateUser(email, password);
      
      // Create user profile in Firestore
      // Use the lazy-loaded getFirestore and related methods
      const db = await getFirestore();
      const userDocRef = await doc(db, 'users', userCredential.user.uid); // Renamed to userDocRef to avoid conflict
      const timestamp = await serverTimestamp();
      
      await setDoc(userDocRef, { // Using userDocRef
        email: userCredential.user.email,
        createdAt: timestamp,
        role: 'user', // Default role
        displayName: userCredential.user.email ? userCredential.user.email.split('@')[0] : 'New User', // Safe display name
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await firebaseSignOut();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};