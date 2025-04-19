import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import VendorCard from './VendorCard';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'vendors'), (snapshot) => {
      const vendorData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVendors(vendorData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default VendorList;
