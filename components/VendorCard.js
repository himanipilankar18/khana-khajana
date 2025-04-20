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
      
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 18,
      marginHorizontal: 16,
      marginBottom: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 14,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
    },
    location: {
      fontSize: 14,
      color: '#888',
      marginBottom: 6,
    },
    score: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4CAF50', // a more vibrant green
    },
  });
  

export default VendorCard;
