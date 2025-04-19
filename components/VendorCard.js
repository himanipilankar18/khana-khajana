// VendorCard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ReviewForm from './ReviewForm';
import AddReviewForm from './AddReviewForm';

const VendorCard = ({ vendor }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewSnapshot = await getDocs(collection(db, 'vendors', vendor.id, 'reviews'));
        const reviewList = reviewSnapshot.docs.map(doc => doc.data());
        setReviews(reviewList);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [vendor.id]);

  const imageUrl = vendor.imageUrl || vendor.image;

  return (
    <View style={styles.card}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <Text style={styles.name}>{vendor.name}</Text>
      <Text style={styles.location}>📍 {vendor.location}</Text>
      <Text style={styles.score}>🧼 Hygiene Score: {vendor.hygiene_score}</Text>
      <ReviewForm vendorId={vendor.id} />
      <AddReviewForm vendorId={vendor.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  location: {
    marginTop: 4,
    color: '#666',
  },
  score: {
    marginTop: 6,
    fontWeight: 'bold',
    color: '#388e3c',
  },
});

export default VendorCard;
