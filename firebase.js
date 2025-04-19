// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"; // Firestore for database

const firebaseConfig = {
  apiKey: "AIzaSyA0f5LDRWSBEjByEp8ficZA7YJF7lW9Op8",
  authDomain: "khana-khajana-f8e17.firebaseapp.com",
  projectId: "khana-khajana-f8e17",
  storageBucket: "khana-khajana-f8e17.appspot.com", // fixed typo here!
  messagingSenderId: "452733800675",
  appId: "1:452733800675:web:9e7fbf35bb43a3edbdb5d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app); // You’ll use this to read/write vendor data

export { db };
