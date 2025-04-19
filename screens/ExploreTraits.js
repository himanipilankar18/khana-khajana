import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput
} from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ExploreTraits({ navigation }) {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filtered traits based on search query
  const filteredFoods = foods.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Traits</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search traits..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredFoods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            <Text style={styles.foodName}>{item.name}</Text>
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    elevation: 2,
  },
  foodCard: {
    marginBottom: 30,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
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
});
