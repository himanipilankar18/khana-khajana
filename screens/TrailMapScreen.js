import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const TrailMapScreen = ({ route }) => {
  const { trail } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: trail.vendors[0].lat,
          longitude: trail.vendors[0].lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {trail.vendors.map((vendor, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: vendor.lat, longitude: vendor.lng }}
            title={vendor.name}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default TrailMapScreen;
