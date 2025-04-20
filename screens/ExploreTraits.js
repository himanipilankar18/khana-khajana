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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    elevation: 2,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 8,
    marginBottom: 10,
  },
  filterButtonSelected: {
    backgroundColor: '#ff7f50',
  },
  filterText: {
    color: '#333',
    fontWeight: '500'
  },
  filterTextSelected: {
    color: '#fff',
  },
  foodCard: {
    marginBottom: 30,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  trailImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  vendorCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  vendorImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  vendorName: {
    marginTop: 6,
    fontSize: 14,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'white',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
