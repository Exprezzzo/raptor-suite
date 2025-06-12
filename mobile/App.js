import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
// Import your VoiceModePanel and other components/hooks for mobile later
// import VoiceModePanel from './src/components/VoiceModePanel';
// import { useVoiceMode } from './src/hooks/useVoiceMode';
// import { AuthProvider } from './src/contexts/AuthContext'; // If you're adapting the web AuthContext

// Your ACTUAL Firebase configuration for the Mobile app (extracted from your screenshots)
// Note: For native builds (iOS/Android), Expo often prefers google-services.json/GoogleService-Info.plist
// This config here is primarily for Expo Web or if using directly within JS
const firebaseConfig = {
  apiKey: "AIzaSyDr94-d2Fv_QM4jE01_p_r_w_R-E-k5K-N5p4xQ", // Your actual API Key
  authDomain: "raptor-suite.firebaseapp.com",
  projectId: "raptor-suite",
  storageBucket: "raptor-suite.appspot.com",
  messagingSenderId: "305267868516",
  appId: "1:305267868516:ios:e0b7b13a30c822e11d612e" // Using iOS App ID for example, adjust if needed for Android
};

// Initialize Firebase client-side app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ---- START TEMPORARY AUTH BYPASS FOR MOBILE ----
// This will allow you to bypass real Firebase Auth for quick testing on mobile.
// REMEMBER TO REMOVE THIS FOR PRODUCTION!
const useAuthBypass = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyUser = {
      uid: 'mobile-temp-admin-user-456',
      email: 'mobile.temp@raptorsuite.com',
      displayName: 'Raptor Mobile Admin',
    };
    setUser(dummyUser);
    setLoading(false);
  }, []);
  return { user, loading };
};
// ---- END TEMPORARY AUTH BYPASS FOR MOBILE ----


export default function App() {
  const { user, loading } = useAuthBypass(); // Use the bypass hook for now

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading authentication...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Authentication Required. Could not bypass login.</Text>
        <Text style={styles.smallText}>(Ensure the temporary bypass is active)</Text>
      </View>
    );
  }

  // If user is logged in (or bypassed), show the main app content
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Raptor Suite Mobile!</Text>
      <Text style={styles.text}>Logged in as: {user.displayName || user.email || user.uid}</Text>
      {/* You would integrate your VoiceModePanel here eventually */}
      {/* <VoiceModePanel projectId="mobile-test-project" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a2a', // Dark blue background for mobile
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0ff',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#c0c0e0',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
    color: '#8080a0',
    marginTop: 5,
  }
});