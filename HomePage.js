import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function HomePage({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <LinearGradient colors={['#ff6a00', '#ee0979']} style={styles.hero}>
        <Text style={styles.heroText}>Discover Safe & Delicious</Text>
        <Text style={[styles.heroText, { fontWeight: 'bold' }]}>Mumbai Street Food</Text>
        <Text style={styles.subText}>
          Explore Mumbai's vibrant street food culture with hygiene-based ratings & reviews.
        </Text>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('VendorList')}>
            <Ionicons name="search" size={18} color="#fff" />
            <Text style={styles.btnText}>Find Vendors</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <FontAwesome5 name="map-marker-alt" size={18} color="#fff" />
            <Text style={styles.btnText}>Explore Trails</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>How Khana Khazana Works</Text>

      <View style={styles.cardContainer}>
        <FeatureCard icon="star" title="Rate Vendors" />
        <FeatureCard icon="location" title="Find Spots" />
        <FeatureCard icon="utensils" title="Review Food" />
      </View>
    </ScrollView>
  );
}

const FeatureCard = ({ icon, title }) => (
  <View style={styles.card}>
    <Ionicons name={icon} size={32} color="#f57c00" />
    <Text style={styles.cardText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  hero: {
    padding: 30,
    paddingTop: 70,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroText: { color: '#fff', fontSize: 26 },
  subText: { color: '#fff', marginTop: 10, fontSize: 14 },
  btnContainer: { flexDirection: 'row', marginTop: 20 },
  actionBtn: {
    backgroundColor: '#f57c00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
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
});
