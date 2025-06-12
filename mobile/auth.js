// C:\Users\Owner\OneDrive\Desktop\raptor-suite\mobile\auth.js

import { auth, firestore } from './firebaseConfig'; // Import the initialized auth and firestore objects

// NOTE ON GOOGLE SIGN-IN:
// For full Google Sign-In with @react-native-firebase/auth,
// you typically also need to install and configure
// @react-native-google-signin/google-signin.
// This will be a separate step AFTER we get the initial dev client building.
// The current auth.js focuses on basic email/password and setup for later expansion.

/**
 * Signs in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.User>}
 */
export const signInWithEmail = async (email, password) => {
  try {
    const response = await auth.signInWithEmailAndPassword(email, password);
    console.log('User signed in successfully:', response.user.email);
    return response.user;
  } catch (error) {
    console.error('Error signing in with email:', error.message);
    throw error; // Re-throw the error for UI handling
  }
};

/**
 * Creates a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.User>}
 */
export const signUpWithEmail = async (email, password) => {
  try {
    const response = await auth.createUserWithEmailAndPassword(email, password);
    console.log('User created successfully:', response.user.email);

    // Optionally, create a user document in Firestore upon sign-up
    await firestore.collection('users').doc(response.user.uid).set({
      email: response.user.email,
      createdAt: firestore.FieldValue.serverTimestamp(),
      // Add any other initial user data here
    });
    console.log('User document created in Firestore for:', response.user.email);

    return response.user;
  } catch (error) {
    console.error('Error signing up with email:', error.message);
    throw error;
  }
};

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log('User signed out successfully.');
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

/**
 * Placeholder for social sign-in (e.g., Google Sign-In).
 * Actual implementation requires specific social login SDKs.
 * @param {string} provider - e.g., 'google', 'facebook'
 * @returns {Promise<firebase.User>}
 */
export const signInWithSocial = async (provider) => {
  console.log(`Attempting to sign in with ${provider}...`);
  // Future implementation for social logins will go here.
  // For now, this is just a placeholder to avoid breaking calls.
  alert(`Social sign-in with ${provider} is not yet implemented.`);
  throw new Error(`Social sign-in with ${provider} is not yet implemented for ${provider}.`);
};

/**
 * Listens for Firebase authentication state changes.
 * @param {function(firebase.User | null): void} callback
 * @returns {function(): void} - An unsubscribe function.
 */
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};