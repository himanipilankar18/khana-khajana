import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const AddReviewForm = ({ vendorId }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      await addDoc(collection(db, 'vendors', vendorId, 'reviews'), {
        comment,
        createdAt: new Date()
      });
      setComment('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a review"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Submit" color="#E95322" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderColor: '#E95322',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
});

export default AddReviewForm;