// raptor-suite/mobile/screens/Auth/SignInScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig'; // Import initialized auth service
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase v9 modular API

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User signed in successfully
      Alert.alert('Success', 'Signed in successfully!');
      // Navigate to the main app dashboard/home screen
      // You'll replace 'Home' with your actual main app navigator name
      // navigation.navigate('Home');
      console.log('User signed in:', auth.currentUser?.email);
    } catch (error) {
      console.error("Sign-in error:", error);
      Alert.alert('Sign-in Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In to Raptor Suite</Text>
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
      <Button title={loading ? "Signing In..." : "Sign In"} onPress={handleSignIn} disabled={loading} />
      <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('SignUp')} color="#6a0dad" />
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

export default SignInScreen;