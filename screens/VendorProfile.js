import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function VendorProfile({ route }) {
  const { vendorId } = route.params;
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const vendorRef = doc(db, 'vendors', vendorId);
        const vendorSnap = await getDoc(vendorRef);

        if (vendorSnap.exists()) {
          setVendor(vendorSnap.data());
        } else {
          console.warn('Vendor not found');
        }
      } catch (error) {
        console.error('Error fetching vendor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  if (!vendor) {
    return (
      <View style={styles.center}>
        <Text>Vendor not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: vendor.image }} style={styles.image} />
      <Text style={styles.name}>{vendor.name}</Text>
      <Text style={styles.description}>{vendor.description || 'No description available.'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
