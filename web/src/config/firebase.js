// C:\Users\Owner\Projects\raptor-suite\web\src\config\firebase.js
import { initializeApp, getApps } from 'firebase/app'; // Ensure getApps is imported
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, limit, serverTimestamp, getDocs } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBw4cMzV0LzPJhl71nIOz3f92zLsZC8Hs4",
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.firebasestorage.app",
  messagingSenderId: "277123240771",
  appId: "1:277123240771:web:b7ab5ffa029579f04115f6"
  // measurementId: "G-YOUR_ACTUAL_MEASUREMENT_ID" // Add if you have Google Analytics set up
};

// Initialize Firebase only if no Firebase apps have been initialized already.
// If an app exists, reuse it to prevent "duplicate-app" errors.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Get service instances linked to this app
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app); // For Cloud Functions
const storage = getStorage(app); // For Cloud Storage

// Export the initialized Firebase app instance and its services,
// along with the specific Firebase SDK functions used in your application.
export {
  app,
  auth,
  db,
  functions,
  storage,
  // Export all specific Firebase SDK functions required by your app:
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  limit,
  serverTimestamp,
  getDocs,
  getFunctions,
  httpsCallable,
};