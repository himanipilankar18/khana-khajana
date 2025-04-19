import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AddVendorForm from '../components/AddVendorForm';
import VendorList from '../components/VendorList';

const VendorListScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AddVendorForm />
      <VendorList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100, // Add extra bottom padding for scrolling comfort
  },
});

export default VendorListScreen;
