import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ReviewForm = ({ vendorId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsSnapshot = await getDocs(collection(db, 'vendors', vendorId, 'reviews'));
        const reviewData = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(reviewData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [vendorId]);

  if (reviews.length === 0) {
    return <Text style={styles.noReviews}>No reviews yet.</Text>;
  }

  return (
    <View style={styles.container}>
      {reviews.map(review => (
        <View key={review.id} style={styles.reviewBox}>
          <Text style={styles.reviewer}>{review.username || 'Anonymous'}</Text>
          <Text style={styles.comment}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  reviewBox: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  reviewer: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  comment: {
    marginTop: 4,
    fontSize: 13,
    color: '#555',
  },
  noReviews: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 13,
    marginTop: 5,
  },
});

export default ReviewForm;
