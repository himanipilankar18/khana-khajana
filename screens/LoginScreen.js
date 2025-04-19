import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
const uid = userCredential.user.uid;

// Get role from Firestore
const userDoc = await getDoc(doc(db, 'users', uid));
const userData = userDoc.data();
const userRole = userData?.role || 'User';

Alert.alert("Success", `Logged in as ${userRole}!`);
if (userRole === 'Vendor') {
  navigation.replace('VendorDashboard');
} else {
  navigation.replace('Home');
}


    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" color="#E95322" onPress={handleLogin} />
      </View>
      <Text onPress={() => navigation.navigate("SignUp")} style={styles.link}>
        Don't have an account? <Text style={{ color: '#E95322' }}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F5CB58" },
  heading: { fontSize: 28, marginBottom: 20, textAlign: 'center', color: "#E95322", fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E95322', padding: 10, marginBottom: 15, borderRadius: 8 },
  link: { marginTop: 15, color: 'black', textAlign: 'center' },
  buttonContainer: { marginTop: 10, borderRadius: 10, overflow: 'hidden' }
});
