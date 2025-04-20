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
const userRole = userData?.role?.toLowerCase()


Alert.alert("Success", `Logged in as ${userRole}!`);
if (userRole === 'vendor') {
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
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: "#FFF8E7", // Soft pastel background
    },
    heading: {
      fontSize: 32,
      marginBottom: 30,
      textAlign: 'center',
      color: "#E95322",
      fontWeight: 'bold',
      fontFamily: 'System',
    },
    input: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 18,
      borderRadius: 10,
      fontSize: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    link: {
      marginTop: 20,
      color: '#555',
      textAlign: 'center',
      fontSize: 14,
    },
    buttonContainer: {
      marginTop: 16,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: "#E95322",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    buttonText: {
      color: "#fff",
      textAlign: "center",
      paddingVertical: 14,
      fontSize: 16,
      fontWeight: "600",
    }
  });
  
