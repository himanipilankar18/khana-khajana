import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, ScrollView, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function VendorDashboard() {
  const [vendorData, setVendorData] = useState(null);
  const [location, setLocation] = useState('');
  const [hours, setHours] = useState('');
  const [image, setImage] = useState(null);
  const [individualAverages, setIndividualAverages] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchVendor = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setVendorData(data);
          setLocation(data.location || '');
          setHours(data.hours || '');
          setImage(data.photo || null);
        }

        const reviewsSnap = await getDocs(collection(docRef, 'reviews'));
        const reviews = reviewsSnap.docs.map(doc => doc.data());

        const paramTotals = { gloves: 0, hairCaps: 0, cleanliness: 0, utensils: 0 };
        reviews.forEach(r => {
          Object.keys(paramTotals).forEach(k => {
            paramTotals[k] += r.individualRatings?.[k] || 0;
          });
        });

        const counts = reviews.length;
        if (counts > 0) {
          setIndividualAverages({
            gloves: (paramTotals.gloves / counts).toFixed(1),
            hairCaps: (paramTotals.hairCaps / counts).toFixed(1),
            cleanliness: (paramTotals.cleanliness / counts).toFixed(1),
            utensils: (paramTotals.utensils / counts).toFixed(1),
          });
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
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

          {individualAverages && (
            <View style={styles.subratings}>
              <Text>🧤 Gloves: {individualAverages.gloves}</Text>
              <Text>👒 Hair Caps: {individualAverages.hairCaps}</Text>
              <Text>🧽 Cleanliness: {individualAverages.cleanliness}</Text>
              <Text>🍽️ Utensils: {individualAverages.utensils}</Text>
            </View>
          )}

          <Text style={styles.label}>Location</Text>
          <TextInput value={location} onChangeText={setLocation} style={styles.input} placeholder="E.g. Juhu Beach" />

          <Text style={styles.label}>Operating Hours</Text>
          <TextInput value={hours} onChangeText={setHours} style={styles.input} placeholder="E.g. 4 PM - 10 PM" />

          <Button title="Save Updates" onPress={updateProfile} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#f9f9f9',
      flex: 1,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#E95322',
      marginBottom: 25,
    },
    label: {
      fontWeight: '600',
      marginTop: 18,
      fontSize: 16,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 12,
      padding: 12,
      marginTop: 8,
      backgroundColor: '#fff',
      fontSize: 15,
    },
    image: {
      width: '100%',
      height: 220,
      borderRadius: 14,
      marginVertical: 16,
      resizeMode: 'cover',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    subratings: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
      elevation: 2,
    },
    subratingTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      color: '#444',
    },
    button: {
      backgroundColor: '#E95322',
      paddingVertical: 14,
      borderRadius: 12,
      marginTop: 30,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  