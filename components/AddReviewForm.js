// AddReviewForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider'; // make sure to install this
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function AddReviewForm({ vendorId }) {
  const [text, setText] = useState('');
  const [gloves, setGloves] = useState(3);
  const [hairCaps, setHairCaps] = useState(3);
  const [cleanliness, setCleanliness] = useState(3);
  const [utensils, setUtensils] = useState(3);

  const handleSubmit = async () => {
    const avgHygiene = ((gloves + hairCaps + cleanliness + utensils) / 4).toFixed(1);
    const user = auth.currentUser;

    if (!text.trim()) {
      Alert.alert('Error', 'Please enter your review text.');
      return;
    }

    try {
      await addDoc(collection(db, 'vendors', vendorId, 'reviews'), {
        text,
        gloves,
        hairCaps,
        cleanliness,
        utensils,
        hygieneRating: parseFloat(avgHygiene),
        timestamp: serverTimestamp(),
        username: user?.email || 'Anonymous',
      });

      setText('');
      setGloves(3);
      setHairCaps(3);
      setCleanliness(3);
      setUtensils(3);

      Alert.alert('Thank you!', 'Your review has been submitted.');
    } catch (error) {
      console.error('Error adding review:', error);
      Alert.alert('Error', 'Could not submit review.');
    }
  };

  const renderSlider = (label, value, setValue) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}: {value}</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor="#4CAF50"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#4CAF50"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Your Review</Text>

      {renderSlider('Glove Usage', gloves, setGloves)}
      {renderSlider('Hair Caps', hairCaps, setHairCaps)}
      {renderSlider('Cleanliness', cleanliness, setCleanliness)}
      {renderSlider('Utensil Maintenance', utensils, setUtensils)}

      <TextInput
        style={styles.input}
        placeholder="Write your review..."
        value={text}
        onChangeText={setText}
        multiline
      />

      <Button title="Submit Review" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginTop: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    height: 80,
  },
  sliderContainer: {
    marginVertical: 10,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
});
