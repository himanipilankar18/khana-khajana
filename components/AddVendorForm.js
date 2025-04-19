import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import uploadToCloudinary from '../utils/uploadToCloudinary'; // helper function you set up

const AddVendorForm = () => {
  const [name, setName] = useState('');
  const [hygieneScore, setHygieneScore] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Request permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need media library permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setImage(selectedImage);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Image Picker Error', err.message);
    }
  };
  

  const handleSubmit = async () => {
    if (!name || !hygieneScore || !location) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        setImageUploading(true);
        imageUrl = await uploadToCloudinary(image);
        setImageUploading(false);
      }

      await addDoc(collection(db, 'vendors'), {
        name,
        hygiene_score: parseFloat(hygieneScore),
        location,
        imageUrl,
      });

      Alert.alert('Vendor added successfully!');
      setName('');
      setHygieneScore('');
      setLocation('');
      setImage(null);
    } catch (error) {
      console.error('Error adding vendor:', error);
      Alert.alert('Failed to add vendor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Vendor</Text>

      <TextInput
        placeholder="Vendor Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Hygiene Score (e.g. 4.5)"
        value={hygieneScore}
        onChangeText={setHygieneScore}
        keyboardType="decimal-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      {image && (
        <Image source={{ uri: image }} style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 10 }} />
      )}

      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>{image ? 'Change Image' : 'Pick Image'}</Text>
      </TouchableOpacity>

      <Button
        title={imageUploading ? 'Uploading Image...' : 'Add Vendor'}
        onPress={handleSubmit}
        color="#f57c00"
        disabled={imageUploading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: '#f57c00',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddVendorForm;
