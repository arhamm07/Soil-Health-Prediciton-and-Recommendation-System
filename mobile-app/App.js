import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Home, Info, Sprout } from 'lucide-react-native';

import HomeScreen from './src/screens/HomeScreen';
import PredictionScreen from './src/screens/PredictionScreen';
import ResultScreen from './src/screens/ResultScreen';
import AboutScreen from './src/screens/AboutScreen';
import SplashScreen from './src/components/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Main') {
            return <Home color={color} size={size} />;
          } else if (route.name === 'About') {
            return <Info color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#2e7d32' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen 
        name="Main" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ title: 'About Us' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  if (isSplashVisible) {
    return <SplashScreen onAnimationComplete={() => setIsSplashVisible(false)} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName="Tabs"
        screenOptions={{
          headerStyle: { backgroundColor: '#2e7d32' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Tabs" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Prediction" 
          component={PredictionScreen} 
          options={{ title: 'Soil Analysis' }}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{ title: 'Analysis Result' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
