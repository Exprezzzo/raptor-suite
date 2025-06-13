// raptor-suite/mobile/firebaseConfig.js

import firebase from 'firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';
import { getReactNativeFirebaseConfig } from '../shared/utils'; // Assuming a utility to get config

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY", // Replace with your actual Firebase API Key
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your actual Sender ID
  appId: "YOUR_MOBILE_APP_ID", // Replace with your actual Mobile App ID
  measurementId: "YOUR_MEASUREMENT_ID" // Optional, if using Analytics
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Alternatively, for production, you might want to fetch config dynamically or from shared:
// const firebaseConfig = getReactNativeFirebaseConfig(); // Requires such a utility in shared/utils

// You can export specific services as needed
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export default firebase;