import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';


export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // 'User' or 'Vendor'

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const uid = userCredential.user.uid;

// Save role in Firestore
await setDoc(doc(db, 'users', uid), {
  email,
  role,
});

Alert.alert("Success", `Account created as ${role}!`);
navigation.replace('Home'); // Optionally change this to route by role

    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'User' && styles.selectedRole]}
          onPress={() => setRole('User')}
        >
          <Text style={styles.roleText}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'Vendor' && styles.selectedRole]}
          onPress={() => setRole('Vendor')}
        >
          <Text style={styles.roleText}>Vendor</Text>
        </TouchableOpacity>
      </View>

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
        <Button title="Sign Up" color="#E95322" onPress={handleSignUp} />
      </View>
      <Text onPress={() => navigation.navigate("Login")} style={styles.link}>
        Already have an account? <Text style={{ color: '#E95322' }}>Login</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F5CB58" },
  heading: { fontSize: 28, marginBottom: 20, textAlign: 'center', color: "#E95322", fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E95322', padding: 10, marginBottom: 15, borderRadius: 8 },
  link: { marginTop: 15, color: 'black', textAlign: 'center' },
  buttonContainer: { marginTop: 10, borderRadius: 10, overflow: 'hidden' },
  roleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  roleButton: { paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 10, borderWidth: 1, borderColor: '#E95322', borderRadius: 8, backgroundColor: '#fff' },
  selectedRole: { backgroundColor: '#E95322' },
  roleText: { color: '#000', fontWeight: 'bold' }
});
