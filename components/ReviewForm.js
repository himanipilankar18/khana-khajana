// components/ReviewForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function ReviewForm({ vendorId, userId, onReviewSubmitted }) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!rating || !comment) return;

    await addDoc(collection(db, 'vendors', vendorId, 'reviews'), {
      hygieneRating: parseFloat(rating),
      comment,
      userId,
      timestamp: serverTimestamp(),
    });

    setRating('');
    setComment('');
    onReviewSubmitted(); // Refresh list or trigger toast
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Hygiene Rating (1-5):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
        placeholder="Enter rating"
      />
      <Text style={styles.label}>Comment:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={comment}
        onChangeText={setComment}
        placeholder="Write a review..."
      />
      <Button title="Submit Review" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  label: { marginBottom: 5, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
