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
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5CB58",
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "#E95322",
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E95322',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E95322',
  },
  buttonText: {
    paddingVertical: 14,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#E95322',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  selectedRole: {
    backgroundColor: '#E95322',
  },
  roleText: {
    fontWeight: 'bold',
    color: 'black',
  },
  selectedRoleText: {
    color: '#fff',
  },
});
