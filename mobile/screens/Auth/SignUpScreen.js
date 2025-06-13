// raptor-suite/mobile/screens/Auth/SignUpScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../../firebaseConfig'; // Import initialized auth & firestore
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase v9 modular API
import { doc, setDoc } from 'firebase/firestore'; // Firestore v9 modular API

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore with a default role
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        role: 'user', // Default role for new users
        displayName: user.email.split('@')[0], // Basic display name
      });

      Alert.alert('Success', 'Account created and user profile saved!');
      // Navigate to the main app dashboard/home screen
      // You'll replace 'Home' with your actual main app navigator name
      // navigation.navigate('Home');
      console.log('User signed up:', user.email);
    } catch (error) {
      console.error("Sign-up error:", error);
      Alert.alert('Sign-up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Raptor Suite Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? "Signing Up..." : "Sign Up"} onPress={handleSignUp} disabled={loading} />
      <Button title="Already have an account? Sign In" onPress={() => navigation.navigate('SignIn')} color="#6a0dad" />
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
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});

export default SignUpScreen;