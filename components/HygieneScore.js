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

      let total = 0;
      let count = 0;

      reviewsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const scores = [
          data.surrounding,
          data.vendorHygiene,
          data.kitchenCleanliness,
          data.foodQuality,
        ];

        // Only consider valid numeric values
        if (scores.every(score => typeof score === 'number')) {
          total += scores.reduce((a, b) => a + b, 0);
          count += scores.length;
        }
      });

      const avg = count > 0 ? (total / count).toFixed(1) : 'No ratings yet';
      setAverage(avg);
    };

    fetchRatings();
  }, [vendorId]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Avg Hygiene Score: {average}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  text: { fontSize: 16, fontWeight: 'bold' },
});
