import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; // if you have this
import SignUp from './screens/SignUp';
import HomePage from './HomePage';
import VendorListScreen from './screens/VendorListScreen';
import VendorDashboard from './screens/VendorDashboard'; // Create this if not already

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="VendorList" component={VendorListScreen} />
        <Stack.Screen name="VendorDashboard" component={VendorDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
