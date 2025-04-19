import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, ScrollView, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function VendorDashboard() {
  const [vendorData, setVendorData] = useState(null);
  const [location, setLocation] = useState('');
  const [hours, setHours] = useState('');
  const [image, setImage] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchVendor = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVendorData(docSnap.data());
          setLocation(docSnap.data().location || '');
          setHours(docSnap.data().hours || '');
          setImage(docSnap.data().photo || null);
        }
      }
    };
    fetchVendor();
  }, []);

  const updateProfile = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        location,
        hours,
        photo: image,
      });
      Alert.alert('Success', 'Profile updated');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vendor Dashboard</Text>

      {vendorData && (
        <>
          <Image
  source={image ? { uri: image } : { uri: 'https://via.placeholder.com/400x200.png?text=Street+Food+Stall' }}
  style={styles.image}
/>

          <Button title="Upload Stall Photo" onPress={pickImage} />

          <Text style={styles.label}>Vendor Name: {vendorData.name}</Text>
          <Text style={styles.label}>Hygiene Rating: ⭐ {vendorData.hygieneRating || 'N/A'}</Text>

          <Text style={styles.label}>Location</Text>
          <TextInput value={location} onChangeText={setLocation} style={styles.input} placeholder="E.g. Juhu Beach" />

          <Text style={styles.label}>Operating Hours</Text>
          <TextInput value={hours} onChangeText={setHours} style={styles.input} placeholder="E.g. 4 PM - 10 PM" />

          <Button title="Save Updates" onPress={updateProfile} />

          <Text style={styles.sectionTitle}>Recent Customer Reviews</Text>
          {vendorData.reviews?.length > 0 ? (
            vendorData.reviews.map((review, idx) => (
              <Text key={idx} style={styles.review}>- {review}</Text>
            ))
          ) : (
            <Text style={styles.review}>No reviews yet.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontWeight: '600', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 5 },
  image: { width: '100%', height: 200, borderRadius: 10, marginVertical: 10 },
  sectionTitle: { fontSize: 18, marginTop: 30, fontWeight: 'bold' },
  review: { fontStyle: 'italic', marginTop: 5 },
});
