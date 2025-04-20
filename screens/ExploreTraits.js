import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';

const dietaryOptionsList = ['Vegetarian', 'Non-Vegetarian', 'Gluten-Free', 'Nut-Free'];

export default function ExploreTraits({ navigation }) {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [newTrailName, setNewTrailName] = useState('');
  const [newTrailImage, setNewTrailImage] = useState(null);
  const [newVendors, setNewVendors] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [uploading, setUploading] = useState(false);

  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'exploreTraits'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFoods(data);
      } catch (error) {
        console.error('Error fetching exploreTraits:', error);
      }
    };

    fetchFoods();
  }, []);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewTrailImage(result.assets[0].uri);
    }
  };

  const addVendorToList = () => {
    if (vendorName && lat && lng) {
      setNewVendors([...newVendors, {
        name: vendorName,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      }]);
      setVendorName('');
      setLat('');
      setLng('');
      setPickedLocation(null);
    }
  };

  const submitTrail = async () => {
    if (!newTrailName || !newTrailImage || newVendors.length === 0) return;

    setUploading(true);
    const imageUrl = await uploadToCloudinary(newTrailImage);
    if (!imageUrl) return setUploading(false);

    const newTrail = {
      name: newTrailName,
      imageUrl,
      likes: 0,
      vendors: newVendors,
    };

    try {
      await addDoc(collection(db, 'exploreTraits'), newTrail);
      setNewTrailName('');
      setNewTrailImage(null);
      setNewVendors([]);
      alert('Trail added!');
    } catch (err) {
      console.error('Error adding trail:', err);
    } finally {
      setUploading(false);
    }
  };

  const filteredFoods = foods
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(item => {
      const filteredVendors = selectedFilters.length === 0
        ? item.vendors
        : item.vendors.filter(vendor =>
            vendor.dietaryOptions &&
            selectedFilters.every(filter => vendor.dietaryOptions.includes(filter))
          );
      return { ...item, vendors: filteredVendors };
    })
    .filter(item => item.vendors.length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create New Food Trail</Text>

      <TextInput
        placeholder="Trail Name"
        value={newTrailName}
        onChangeText={setNewTrailName}
        style={styles.searchInput}
      />

      <TouchableOpacity onPress={pickImage} style={styles.filterButton}>
        <Text style={styles.filterText}>{newTrailImage ? 'Image Selected' : 'Pick Cover Image'}</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Vendor Name"
        value={vendorName}
        onChangeText={setVendorName}
        style={styles.searchInput}
      />

      <TouchableOpacity onPress={() => setLocationPickerVisible(true)} style={styles.filterButton}>
        <Text style={styles.filterText}>
          {pickedLocation ? `Selected: ${pickedLocation.lat.toFixed(4)}, ${pickedLocation.lng.toFixed(4)}` : 'Pick Location on Map'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={addVendorToList} style={styles.filterButton}>
        <Text style={styles.filterText}>Add Vendor</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Vendors:</Text>
      {newVendors.map((v, index) => (
        <Text key={index}>{v.name} ({v.lat}, {v.lng})</Text>
      ))}

      <TouchableOpacity
        onPress={submitTrail}
        style={[styles.filterButton, { backgroundColor: '#4caf50', marginTop: 10 }]}
        disabled={uploading}
      >
        <Text style={styles.filterText}>{uploading ? 'Uploading...' : 'Submit Trail'}</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Explore Trails</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search traits..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {dietaryOptionsList.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterButton,
              selectedFilters.includes(option) && styles.filterButtonSelected
            ]}
            onPress={() => toggleFilter(option)}
          >
            <Text style={[
              styles.filterText,
              selectedFilters.includes(option) && styles.filterTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredFoods.map(item => (
        <View style={styles.foodCard} key={item.id}>
          <Text style={styles.foodName}>{item.name}</Text>
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.trailImage} />
          )}
          <FlatList
            data={item.vendors}
            keyExtractor={(vendor, index) => `${item.id}-${index}`}
            renderItem={({ item: vendorRaw }) => {
              const vendor = {
                id: vendorRaw.id?.trim(),
                name: vendorRaw.name?.trim(),
                image: vendorRaw.image?.trim(),
              };

              if (!vendor.id || !vendor.name) return null;

              return (
                <TouchableOpacity
                  style={styles.vendorCard}
                  onPress={() =>
                    navigation.navigate('VendorProfile', { vendor })
                  }
                >
                  <Image
                    source={{ uri: vendor.image || 'https://via.placeholder.com/80' }}
                    style={styles.vendorImage}
                  />
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                </TouchableOpacity>
              );
            }}
            horizontal
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}

      {/* Location Picker Modal */}
      {locationPickerVisible && (
        <View style={styles.mapOverlay}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 19.0760,
              longitude: 72.8777,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setPickedLocation({ lat: latitude, lng: longitude });
              setLat(latitude.toString());
              setLng(longitude.toString());
            }}
          >
            {pickedLocation && (
              <Marker
                coordinate={{
                  latitude: pickedLocation.lat,
                  longitude: pickedLocation.lng,
                }}
                title="Selected Location"
              />
            )}
          </MapView>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => setLocationPickerVisible(false)}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  </SafeAreaView> );
 }

 const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FAFAFA',
    },
    scrollContainer: {
      paddingBottom: 40,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: '#FAFAFA',
    },
    heading: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 16,
      marginTop: 50,
      color: '#333',
      textAlign:'center',
    },
    searchInput: {
      backgroundColor: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      fontSize: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    filterScroll: {
      flexDirection: 'row',
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: '#E0E0E0',
      marginRight: 10,
      marginBottom: 10,
    },
    filterButtonSelected: {
      backgroundColor: '#FF7F50',
    },
    filterText: {
      color: '#444',
      fontWeight: '500',
      fontSize: 14,
    },
    filterTextSelected: {
      color: '#fff',
    },
    foodCard: {
      marginBottom: 28,
    },
    foodName: {
      fontSize: 20,
      fontWeight: '600',
      color: '#222',
      marginBottom: 8,
    },
    trailImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 12,
    },
    vendorCard: {
      backgroundColor: '#fff',
      padding: 12,
      marginRight: 12,
      borderRadius: 12,
      elevation: 3,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    vendorImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
    },
    vendorName: {
      marginTop: 8,
      fontSize: 15,
      fontWeight: '500',
      color: '#333',
    },
    mapOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    map: {
      width: '100%',
      height: 300,
      borderRadius: 12,
    },
    confirmButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 20,
      alignSelf: 'center',
    },
    confirmButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
  });
  