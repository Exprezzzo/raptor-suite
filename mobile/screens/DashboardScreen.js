// raptor-suite/mobile/screens/DashboardScreen.js

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../firebaseConfig'; // Import auth to get current user info

const DashboardScreen = () => {
  const user = auth.currentUser; // Get current authenticated user

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Mobile Dashboard!</Text>
      {user && <Text style={styles.subtitle}>Logged in as: {user.email}</Text>}
      <Text style={styles.text}>Here you will see your project overview, quick stats, and more.</Text>
      <Button title="Explore Projects" onPress={() => { /* navigation.navigate('Projects') */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
});

export default DashboardScreen;