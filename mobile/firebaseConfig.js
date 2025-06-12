// C:\Users\Owner\OneDrive\Desktop\raptor-suite\mobile\firebaseConfig.js

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth'; // Required for auth module functionality
import '@react-native-firebase/firestore'; // Required for firestore module functionality

// Your web app's Firebase configuration (these are your actual keys)
const firebaseConfig = {
  apiKey: "AIzaSyBQVkJqG8XLHhApVLNGVR0b6DDQdFCMdLAE",
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.firebaseapp.com", // Corrected from your web app screenshot, it was .appspot.com previously.
  messagingSenderId: "277123240771",
  appId: "1:277123240771:web:b7afb5ffab029579f04115f6" // From your web app screenshot
  // measurementId: "G-XXXXXXXXXX" // Add if you found this specific ID
};

// Initialize Firebase app if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export specific services
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// If you plan to use Firebase Storage:
// import '@react-native-firebase/storage';
// export const storage = firebase.storage();