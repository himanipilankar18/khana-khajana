import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ReviewForm = ({ vendorId }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');
  const [surrounding, setSurrounding] = useState(3);
  const [vendorHygiene, setVendorHygiene] = useState(3);
  const [kitchenCleanliness, setKitchenCleanliness] = useState(3);
  const [foodQuality, setFoodQuality] = useState(3);
  const [images, setImages] = useState([]);

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

  const handleImagePick = async () => {
    if (images.length >= 2) {
      Alert.alert("Limit reached", "You can only upload 2 images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("Required", "Please write a comment.");
      return;
    }

    if (images.length !== 2) {
      Alert.alert("Image Required", "Please attach exactly 2 images.");
      return;
    }

    try {
      await addDoc(collection(db, 'vendors', vendorId, 'reviews'), {
        username: username || "Anonymous",
        comment,
        surrounding,
        vendorHygiene,
        kitchenCleanliness,
        foodQuality,
        imageUris: images.map(img => img.uri),
        timestamp: serverTimestamp(),
      });

      Alert.alert("Thank you!", "Your review has been submitted.");
      setComment('');
      setUsername('');
      setImages([]);
      setSurrounding(3);
      setVendorHygiene(3);
      setKitchenCleanliness(3);
      setFoodQuality(3);
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const renderSlider = (label, value, setValue) => (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.sliderLabel}>{label}: {value}/5</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={1}
        maximumValue={5}
        step={1}
        minimumTrackTintColor="#E95322"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#E95322"
        value={value}
        onValueChange={setValue}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.heading}>Leave a Review</Text>

        <TextInput
          placeholder="Your name (optional)"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Write your experience..."
          value={comment}
          onChangeText={setComment}
          multiline
          style={[styles.input, { height: 80 }]}
        />

        {renderSlider("Surrounding Cleanliness", surrounding, setSurrounding)}
        {renderSlider("Vendor Hygiene", vendorHygiene, setVendorHygiene)}
        {renderSlider("Kitchen Cleanliness", kitchenCleanliness, setKitchenCleanliness)}
        {renderSlider("Quality of Food", foodQuality, setFoodQuality)}

        <Text style={styles.sliderLabel}>Upload 2 Images</Text>
        <View style={styles.imageRow}>
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.uri }}
              style={styles.imagePreview}
            />
          ))}
          {images.length < 2 && (
            <TouchableOpacity onPress={handleImagePick} style={styles.imageUploadBox}>
              <Text style={styles.imageUploadText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button title="Submit Review" onPress={handleSubmit} color="#E95322" />
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.reviewHeader}>User Reviews</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet.</Text>
        ) : (
          reviews.map(review => (
            <View key={review.id} style={styles.reviewBox}>
              <Text style={styles.reviewer}>{review.username || 'Anonymous'}</Text>
              <Text style={styles.comment}>{review.comment}</Text>

              <Text style={styles.ratingText}>Surrounding: {review.surrounding}/5</Text>
              <Text style={styles.ratingText}>Vendor Hygiene: {review.vendorHygiene}/5</Text>
              <Text style={styles.ratingText}>Kitchen Cleanliness: {review.kitchenCleanliness}/5</Text>
              <Text style={styles.ratingText}>Food Quality: {review.foodQuality}/5</Text>

              <View style={styles.imageRow}>
                {review.imageUris?.map((uri, i) => (
                  <Image key={i} source={{ uri }} style={styles.imagePreview} />
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  formBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#E95322',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  sliderLabel: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  imageRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  imageUploadBox: {
    width: 80,
    height: 80,
    backgroundColor: '#EEE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: 28,
    color: '#999',
  },
  reviewHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  reviewBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
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
  ratingText: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  noReviews: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 13,
    marginTop: 5,
  },
});

export default ReviewForm;
