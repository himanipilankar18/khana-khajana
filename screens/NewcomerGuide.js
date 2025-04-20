import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const foodTrails = [
  {
    id: '1',
    title: 'South Mumbai Street Food Tour',
    image: require('../assets/south-mumbai.jpg'),
    description:
      'From Khaugalli to Girgaon Chowpatty – a beginner-friendly trail full of classics.',
    vendors: [
      { name: 'Girgaon Chowpatty', lat: 18.9543, lng: 72.812 },
      { name: 'Khaugalli Churchgate', lat: 18.9329, lng: 72.8278 },
      { name: 'Bademiya Colaba', lat: 18.9219, lng: 72.8347 },
    ],
    tips: [
      "Carry hand sanitizer – it's a street food essential.",
      'Try Pav Bhaji at Chowpatty just before sunset for the best vibe.',
      'Locals prefer standing and eating – no seating at most stalls.',
      "Ask for less spice if you're not used to Indian heat!",
    ],
  },
  {
    id: '2',
    title: 'Iconic Vada Pav Spots',
    image: require('../assets/vada-pav.jpg'),
    description:
      'Explore Mumbai’s best vada pav stalls across famous neighborhoods.',
    vendors: [
      { name: 'Anand Stall Vile Parle', lat: 19.1001, lng: 72.8506 },
      { name: 'Ashok Vada Pav Dadar', lat: 19.0163, lng: 72.8424 },
      { name: 'Graduate Vada Pav CST', lat: 18.9402, lng: 72.8356 },
    ],
    tips: [
      'Vada Pav is best with extra chutney – ask for green and red.',
      'Avoid peak hours (1–2 PM) if you want shorter queues.',
      'Some stalls don’t accept cards – carry cash or UPI.',
      'Squeeze lime on the fried green chilli served with it – trust us!',
    ],
  },
];

const NewcomerGuide = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Newcomer’s Guide to Mumbai Street Food</Text>
      <Text style={styles.subtext}>
        Curated food trails with mapped routes, beginner tips, and cultural
        context to get you started.
      </Text>

      {foodTrails.map((trail) => (
        <View key={trail.id} style={styles.card}>
          <Image source={trail.image} style={styles.image} />
          <Text style={styles.trailTitle}>{trail.title}</Text>
          <Text style={styles.description}>{trail.description}</Text>

          {trail.tips && trail.tips.length > 0 && (
            <View style={styles.tipsBox}>
              <Text style={styles.tipHeading}>Tips & Local Insights</Text>
              {trail.tips.map((tip, index) => (
                <Text key={index} style={styles.tipText}>
                  • {tip}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TrailMap', { trail })}
          >
            <Text style={styles.buttonText}>View Trail</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E95322',
    marginBottom: 6,
    marginTop: 35,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },
  trailTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  tipsBox: {
    backgroundColor: '#FFF7E8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  tipHeading: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    color: '#E95322',
  },
  tipText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#E95322',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NewcomerGuide;
