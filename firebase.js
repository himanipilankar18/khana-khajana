
// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore,collection,getDocs } from "firebase/firestore"; // Firestore for database


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0f5LDRWSBEjByEp8ficZA7YJF7lW9Op8",
  authDomain: "khana-khajana-f8e17.firebaseapp.com",
  projectId: "khana-khajana-f8e17",
  storageBucket: "khana-khajana-f8e17.firebasestorage.app",
  messagingSenderId: "452733800675",
  appId: "1:452733800675:web:9e7fbf35bb43a3edbdb5d6",
  measurementId: "G-4BMS70GD8K"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app); // You’ll use this to read/write vendor data




// Export Firestore and utilities
export { db, collection, getDocs };

