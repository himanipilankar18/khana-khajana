import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { Dimensions } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
const { width: screenWidth } = Dimensions.get('window');

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
          // Fallback to CST Mumbai
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

        const filteredVendors = location
          ? vendors.filter((vendor) => {
              const dist = getDistanceFromLatLonInKm(
                location.latitude,
                location.longitude,
                vendor.latitude,
                vendor.longitude
              );
              return dist <= 10;
            })
          : vendors;

        const topRated = filteredVendors
          .filter((vendor) => vendor.rating >= 1.5)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);

        const foodTrails = filteredVendors
          .filter((vendor) => vendor.likes && vendor.likes > 50)
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 5);

        setTopRatedVendors(topRated);
        setPopularFoodTrails(foodTrails);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    if (location) fetchData();
  }, [location]);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

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
  <Text>Explore Traits</Text>
</TouchableOpacity>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>How Khana Khazana Works</Text>
      <View style={styles.cardContainer}>
        <FeatureCard
          icon={<MaterialIcons name="stars" size={32} color="#f57c00" />}
          title="Add me a vendor"
        />
        <FeatureCard
          icon={<Ionicons name="location" size={32} color="#f57c00" />}
          title="Find Spots"
        />
        <FeatureCard
          icon={
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={32}
              color="#f57c00"
            />
          }
          title="Review Food"
        />
      </View>

      {location && (
        <View style={styles.mapContainer}>
         <MapView
  style={StyleSheet.absoluteFillObject}


            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
            />
          </MapView>
        </View>
      )}

<Text style={styles.sectionTitle}>Top-Rated Vendors</Text>
<Carousel
  width={250}
  height={280}
  data={topRatedVendors}
  scrollAnimationDuration={800}
  renderItem={({ item }) => (
    <View style={styles.carouselCard}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.carouselImage} />
      ) : (
        <View style={[styles.carouselImage, { backgroundColor: '#ccc' }]} />
      )}
      <Text style={styles.vendorName}>{item.name}</Text>
      <Text style={styles.vendorLocation}>{item.location}</Text>
      <Text style={styles.vendorSpecialty}>Specialty: {item.specialty}</Text>
      <Text style={styles.vendorRating}>Rating: {item.rating}⭐</Text>
    </View>
  )}
/>



<Text style={styles.sectionTitle}>Popular Food Trails</Text>
<Carousel
  width={250}
  height={260}
  data={popularFoodTrails}
  scrollAnimationDuration={800}
  renderItem={({ item }) => (
    <View style={styles.carouselCard}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.carouselImage} />
      ) : (
        <View style={[styles.carouselImage, { backgroundColor: '#ccc' }]} />
      )}
      <Text style={styles.foodTrailName}>{item.name}</Text>
      <Text style={styles.foodTrailLikes}>{item.likes} Likes</Text>
      <Text style={styles.foodTrailAddress}>Address: {item.address}</Text>
    </View>
  )}
/>


    </ScrollView>
  );
}

const FeatureCard = ({ icon, title }) => (
  <View style={styles.card}>
    {icon ? icon : <Text>🚫</Text>}
    <Text style={styles.cardText}>{title}</Text>
  </View>
);

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
  carouselCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 4,
  },
  carouselImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  }
,  
  btnText: { color: '#fff', marginLeft: 8, fontSize: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 25,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    width: '28%',
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  mapContainer: {
    height: 250,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  horizontalList: {
    paddingLeft: 16,
    paddingBottom: 16,
  },
  vendorCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 12,
    width: 180,
    elevation: 2,
  },
  vendorImage: {
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  vendorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  vendorLocation: {
    fontSize: 12,
    color: '#777',
  },
  vendorSpecialty: {
    fontSize: 12,
    marginTop: 4,
  },
  vendorRating: {
    fontSize: 12,
    color: '#f57c00',
    marginTop: 2,
  },
  foodTrailCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 12,
    width: 180,
    elevation: 2,
  },
  foodTrailImage: {
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  foodTrailName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  foodTrailLikes: {
    fontSize: 12,
    color: '#777',
  },
  foodTrailAddress: {
    fontSize: 12,
    marginTop: 4,
  },
});
