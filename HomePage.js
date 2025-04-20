import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const screenWidth = Dimensions.get('window').width;

export default function HomePage({ navigation }) {
  const [topRatedVendors, setTopRatedVendors] = useState([]);
  const [popularFoodTrails, setPopularFoodTrails] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          setLocation({ latitude: 18.9402, longitude: 72.8356 });
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        console.log('User location:', loc.coords);
      } catch (error) {
        console.error('Location error:', error);
        setLocation({ latitude: 18.9402, longitude: 72.8356 });
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorsSnapshot = await getDocs(collection(db, 'vendors'));
        const vendors = vendorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredVendors = vendors;

        const topRated = filteredVendors
          .filter((vendor) => vendor.hygiene_score && vendor.hygiene_score >= 1.5)
          .sort((a, b) => b.hygiene_score - a.hygiene_score)
          .slice(0, 5);

        setTopRatedVendors(topRated);

        const trailsSnapshot = await getDocs(collection(db, 'food_trails'));
        const trails = trailsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPopularFoodTrails(trails);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (location) fetchData();
  }, [location]);

  const formattedFoodTrails = popularFoodTrails.map(trail => ({
    id: trail.id,
    name: trail.name,
    imageUrl: trail.imageUrl || 'https://via.placeholder.com/250x150.png?text=Food+Trail',
    likes: trail.likes || 0,
    vendors: trail.vendors || [],
  }));
  

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <LinearGradient colors={['#ff6a00', '#ee0979']} style={styles.hero}>
        <Text style={styles.heroText}>Discover Safe & Delicious</Text>
        <Text style={[styles.heroText, { fontWeight: 'bold' }]}>
          Mumbai Street Food
        </Text>
        <Text style={styles.subText}>
          Explore Mumbai's vibrant street food culture with hygiene-based
          ratings & reviews.
        </Text>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('VendorList')}
          >
            <Ionicons name="search" size={18} color="#fff" />
            <Text style={styles.btnText}>Find Vendors</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ExploreTraits')}>
            <Text style={{ color: '#fff', marginLeft: 12 }}>Explore Trails</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={{ height: 300, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', marginTop: 20 }}>
  {location && (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {topRatedVendors.map((vendor) => (
        vendor.lat && vendor.lng && (
          <Marker
            key={vendor.id}
            coordinate={{
              latitude: vendor.lat,
              longitude: vendor.lng,
            }}
            title={vendor.name}
            description={`Hygiene Score: ${vendor.hygiene_score}`}
          />
        )
      ))}
    </MapView>
  )}
</View>
      <Text style={styles.sectionTitle}>Top-Hygeinic Vendors</Text>
      {topRatedVendors.length === 0 ? (
        <Text style={{ textAlign: 'center', marginBottom: 20, color: '#999' }}>
          No top-rated vendors found nearby.
        </Text>
      ) : (
        <Carousel
          width={screenWidth * 1}
          height={280}
          data={topRatedVendors}
          scrollAnimationDuration={800}
          renderItem={({ item }) => (
            <View style={styles.carouselCard}>
              <Image
                source={{
                  uri: item.imageUrl || 'https://via.placeholder.com/250x150.png?text=No+Image',
                }}
                style={styles.carouselImage}
              />
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorLocation}>{item.location}</Text>
              <Text style={styles.vendorSpecialty}>
                Specialty: {item.specialty || 'N/A'}
              </Text>
              <Text style={styles.vendorRating}>
                Hygiene Score: {item.hygiene_score ?? 'N/A'}⭐
              </Text>
            </View>
          )}
        />
      )}

      <Text style={styles.sectionTitle}>Popular Food Trails</Text>
      {formattedFoodTrails.length === 0 ? (
        <Text style={{ textAlign: 'center', marginBottom: 20, color: '#999' }}>
          No food trails available at the moment.
        </Text>
      ) : (
        <Carousel
          width={screenWidth * 1}
          height={280}
          data={formattedFoodTrails}
          scrollAnimationDuration={800}
          renderItem={({ item }) => (
            <View style={styles.carouselCard}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.carouselImage}
                onError={(e) => console.log('Image error:', e.nativeEvent.error)}
              />
              <Text style={styles.foodTrailName}>{item.name}</Text>
              <Text style={styles.foodTrailLikes}>{item.likes} Likes</Text>
              <Text style={styles.foodTrailAddress}>
                Stops: {item.vendors.map(v => v.name).join(', ')}
              </Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 30 },
  hero: {
    padding: 30,
    paddingTop: 70,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroText: { color: '#fff', fontSize: 26, textAlign: 'center' },
  subText: { color: '#fff', marginTop: 10, fontSize: 14, textAlign: 'center' },
  btnContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  actionBtn: {
    backgroundColor: '#f57c00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  btnText: { color: '#fff', marginLeft: 8, fontSize: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 25,
    textAlign: 'center',
  },
  carouselCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  carouselImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  vendorName: { fontWeight: 'bold', fontSize: 16 },
  vendorLocation: { fontSize: 12, color: '#777' },
  vendorSpecialty: { fontSize: 12, marginTop: 4 },
  vendorRating: { fontSize: 12, color: '#f57c00', marginTop: 2 },
  foodTrailName: { fontWeight: 'bold', fontSize: 16 },
  foodTrailLikes: { fontSize: 12, color: '#777' },
  foodTrailAddress: { fontSize: 12, marginTop: 4 },
});
