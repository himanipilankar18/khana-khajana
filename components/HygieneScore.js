// components/HygieneScore.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function HygieneScore({ vendorId }) {
  const [average, setAverage] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      const reviewsSnapshot = await getDocs(collection(db, 'vendors', vendorId, 'reviews'));
      const ratings = reviewsSnapshot.docs.map(doc => doc.data().hygieneRating);
      const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'No ratings yet';
      setAverage(avg);
    };

    fetchRatings();
  }, [vendorId]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Avg Hygiene Rating: {average}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  text: { fontSize: 16, fontWeight: 'bold' },
});
