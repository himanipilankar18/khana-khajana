import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ExploreTraits({ navigation }) {
  const [foods, setFoods] = useState([]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Traits</Text>
      <FlatList
        data={foods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            <Text style={styles.foodName}>{item.name}</Text>
            <FlatList
              data={item.vendors}
              keyExtractor={(vendor, index) => `${item.id}-${index}`}
              renderItem={({ item: vendor }) => (
                <TouchableOpacity
                  style={styles.vendorCard}
                  onPress={() => navigation.navigate('VendorProfile', { vendorId: vendor.id })}
                >
                  <Image
  source={{ uri: vendor.image || 'https://via.placeholder.com/80' }}
  style={styles.vendorImage}
/>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                </TouchableOpacity>
              )}
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
    marginBottom: 20,
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
