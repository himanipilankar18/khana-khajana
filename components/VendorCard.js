import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path if needed
import ReviewList from './ReviewList';
import AddReviewForm from './AddReviewForm';


const VendorCard = ({ vendor }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // 🔍 Navigate to: vendors > [vendor.id] > reviews
        const reviewSnapshot = await getDocs(collection(db, 'vendors', vendor.id, 'reviews'));
        const reviewList = reviewSnapshot.docs.map(doc => doc.data());
        setReviews(reviewList);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [vendor.id]);

  // 🖼️ Display the vendor image, if available
  const imageUrl = vendor.imageUrl || vendor.image;

  return (
    <View style={styles.card}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
      <Text style={styles.name}>{vendor.name}</Text>
      <Text style={styles.location}>📍 {vendor.location}</Text>
      <Text style={styles.score}>🧼 Hygiene Score: {vendor.hygiene_score}</Text>
      <ReviewList vendorId={vendor.id} />
      <AddReviewForm vendorId={vendor.id} />
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Reviews:</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet.</Text>
        ) : (
          reviews.map((review, index) => (
            <Text key={index} style={styles.reviewText}>• {review.text}</Text>
          ))
        )}
      </View>
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
  reviewSection: {
    marginTop: 14,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  noReviews: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 4,
  },
  reviewText: {
    marginTop: 4,
    color: '#333',
  },
});

export default VendorCard;
