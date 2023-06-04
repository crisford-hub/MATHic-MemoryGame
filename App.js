import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./src/screens/Home";
import EasyHomeScreen from "./src/screens/Easy";
import MediumHomeScreen from "./src/screens/Medium";
import HardGameScreen from './src/screens/Hard';

const Stack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Easy" component={EasyHomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Medium" component={MediumHomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Hard" component={HardGameScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}


