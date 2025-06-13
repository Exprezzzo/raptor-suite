// raptor-suite/web/src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import config from '../../shared/config'; // Import shared config

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw4cMzV0LzPJhl71nIOz3f92zLsZC8Hs4", // Your actual API Key
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.firebasestorage.app", // Corrected storageBucket domain
  messagingSenderId: "277123240771",
  appId: "1:277123240771:web:b7ab5ffa029579f04115f6"
  // measurementId: "YOUR_MEASUREMENT_ID" // Optional, if using Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'us-central1'); // Specify region for functions

export default app;