import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const CLOUDINARY_UPLOAD_PRESET = 'khana_upload';
const CLOUDINARY_CLOUD_NAME = 'dtl3fqbrt';
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const AddVendorForm = () => {
  const [vendorName, setVendorName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async () => {
    const data = new FormData();
    data.append('file', {
      uri: image,
      type: 'image/jpeg',
      name: 'vendor.jpg',
    });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const res = await fetch(CLOUDINARY_API_URL, {
      method: 'POST',
      body: data,
    });

    const result = await res.json();
    return result.secure_url;
  };

  const handleAddVendor = async () => {
    if (!vendorName || !location || !image) {
      Alert.alert('Missing fields', 'Please fill all fields and add an image.');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToCloudinary();

      await addDoc(collection(db, 'vendors'), {
        name: vendorName,
        location: location,
        image: imageUrl,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Vendor added!');
      setVendorName('');
      setLocation('');
      setImage(null);
    } catch (error) {
      console.error('Error adding vendor:', error);
      Alert.alert('Error', 'Could not add vendor.');
    } finally {
      setUploading(false);
    }
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

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Pick Vendor Stall Image'}</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <Button
        title={uploading ? 'Adding Vendor...' : 'Add Vendor'}
        color="#E95322"
        onPress={handleAddVendor}
        disabled={uploading}
      />
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
  imagePicker: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#E95322',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    marginBottom: 12,
    borderRadius: 8,
  },
});

export default AddVendorForm;
