// raptor-suite/mobile/App.js (REFINED UPDATE)

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import AuthNavigator from './components/AuthNavigator';
import { auth } from './firebaseConfig'; // Import initialized auth service

// --- Main App Screens (Placeholders for now) ---
const MainStack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // Auth state listener in App.js will handle navigation to auth screens
    } catch (error) {
      console.error("Error signing out from mobile:", error);
      alert("Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Raptor Suite Home!</Text>
      <Text style={styles.subText}>You are logged in.</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      {/* Add more links/buttons to other main app features */}
    </View>
  );
};

const MainAppNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomeScreen} />
      {/* Add other main app screens here (e.g., Projects, Profile, Settings) */}
      {/* <MainStack.Screen name="Projects" component={ProjectsScreen} /> */}
    </MainStack.Navigator>
  );
};
// --- End Main App Screens ---


export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null); // Firebase user object

  // Handle user state changes
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Raptor Suite...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <MainAppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  }
});