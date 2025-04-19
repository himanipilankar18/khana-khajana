// components/AddReviewForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export default function AddReviewForm({ vendorId }) {
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Please enter a review.');
      return;
    }

    try {
      await addDoc(collection(db, 'vendors', vendorId, 'reviews'), {
        comment,
        createdAt: new Date(),
      });
      setComment('');
      Alert.alert('Review added!');
    } catch (err) {
      console.error('Error adding review:', err);
      Alert.alert('Failed to add review.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Write your review..."
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        multiline
      />
      <Button title="Submit Review" onPress={handleSubmit} color="#f57c00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
});
