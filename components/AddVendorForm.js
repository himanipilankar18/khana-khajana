import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../firebase';

const AddVendorForm = () => {
  const [vendorName, setVendorName] = useState('');
  const [location, setLocation] = useState('');

  const handleAddVendor = () => {
    // Functionality to be implemented
    alert('Vendor added (demo)!');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Vendor Name"
        value={vendorName}
        onChangeText={setVendorName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Add Vendor" color="#E95322" onPress={handleAddVendor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderColor: '#E95322',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});

export default AddVendorForm;