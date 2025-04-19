import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VendorCard = ({ vendor }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{vendor.name}</Text>
      <Text style={styles.hygiene}>Hygiene Score: {vendor.hygiene_score}/5</Text>
      <Text style={styles.location}>{vendor.location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  hygiene: {
    fontSize: 16,
    marginTop: 4,
    color: '#4CAF50',
  },
  location: {
    fontSize: 14,
    marginTop: 2,
    color: '#777',
  },
});

export default VendorCard;
