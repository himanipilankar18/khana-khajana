import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function VendorProfile({ route }) {
    const { vendor } = route.params;
  
    if (!vendor) {
      return (
        <View style={styles.center}>
          <Text>Vendor not found.</Text>
        </View>
      );
    }
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: vendor.image }} style={styles.image} />
        <Text style={styles.name}>{vendor.name}</Text>
        <Text style={styles.description}>{vendor.description || 'No description available.'}</Text>
      </ScrollView>
    );
  }
  

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 220,
      height: 220,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 5,
    },
    name: {
      fontSize: 26,
      fontWeight: '800',
      color: '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666',
      lineHeight: 22,
      paddingHorizontal: 12,
    },
  });
  
