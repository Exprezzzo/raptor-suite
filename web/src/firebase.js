// Re-export everything from the optimized config
export * from './config/firebase.js'; // ENSURE THIS IS .js

// For backward compatibility, export initialized instances
// Note: Components should be updated to use the lazy-loaded versions from './config/firebase'
import { initializeApp } from 'firebase/app';
import { getAuth as getAuthInstance } from 'firebase/auth';
import { getFirestore as getFirestoreInstance } from 'firebase/firestore';
import { getStorage as getStorageInstance } from 'firebase/storage';
import { getFunctions as getFunctionsInstance } from 'firebase/functions';

// Your Firebase project configuration (from your Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBw4cMzV0LzPJhl71nlOz3f92zLsZC8Hs4",
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.appspot.com",
  messagingSenderId: "277123240771",
  appId: "1:277123240771:web:3802e33f088dc2dd563191"
};

// Initialize the main Firebase app instance
const app = initializeApp(firebaseConfig);

// These exports are for backward compatibility
// Components should gradually be updated to use the lazy-loaded `getAuth()`, `getFirestore()`, etc.,
// from './config/firebase' to leverage performance benefits.
export const auth = getAuthInstance(app);
export const db = getFirestoreInstance(app);
export const storage = getStorageInstance(app);
export const functions = getFunctionsInstance(app, 'us-central1'); // Assuming 'us-central1' is your default functions region

export default app;