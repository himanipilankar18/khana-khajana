import React from 'react';
import { View, StyleSheet } from 'react-native';
import VendorList from '../components/VendorList';

const VendorListScreen = () => {
  return (
    <View style={styles.container}>
      <VendorList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
});

export default VendorListScreen;
