import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw4cMzV0LzPJh171nI0z3f92zLsZC8Hs4",
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.appspot.com",
  messagingSenderId: "277123240771",
  appId: "1:277123240771:web:3802e33f088dc2dd563191"
};

// Diagnostic logging
console.log('🦅 Raptor Suite Firebase Check:', {
  apiKey: firebaseConfig.apiKey ? '✅ Present' : '❌ Missing',
  apiKeyStart: firebaseConfig.apiKey?.substring(0, 15) + '...',
  authDomain: firebaseConfig.authDomain ? '✅ Present' : '❌ Missing',
  projectId: firebaseConfig.projectId ? '✅ Present' : '❌ Missing',
  timestamp: new Date().toISOString(),
  version: '1.0.1'
});

// Initialize Firebase (only once)
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  console.log('✅ Firebase app initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Google Auth
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Log auth status
console.log('🔐 Firebase Auth ready:', auth.app.name);

export default app;