import React from 'react';
import { View, Text, Button } from 'react-native';
import '../firebaseConfig';
import { useFirebaseAuth } from '../auth';

export default function App() {
  const [request, response, promptAsync] = useFirebaseAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' }}>
      <Text style={{ color: 'white', fontSize: 20, marginBottom: 20 }}>
        🔐 Login with Google
      </Text>
      <Button title="Sign in with Google" onPress={() => promptAsync()} disabled={!request} />
    </View>
  );
}
