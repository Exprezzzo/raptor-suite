// raptor-suite/mobile/screens/ProjectsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProjectsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Creative Projects</Text>
      <Text style={styles.text}>List of your projects will appear here.</Text>
      {/* Add logic to fetch and display projects from Firestore */}
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
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
});

export default ProjectsScreen;