import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import ForosScreen from '../screens/ForosScreen';
import IntercambiosScreen from '../screens/IntercambiosScreen';
import ToquesScreen from '../screens/ToquesScreen';
import BibliotecaScreen from '../screens/BibliotecaScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const [keys, setKeys] = useState({
    Home: 0, Foros: 0, Intercambios: 0, Toques: 0, Biblioteca: 0
  });

  const handleTabPress = (name) => {
    setKeys(prev => ({ ...prev, [name]: prev[name] + 1 }));
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Foros: 'chatbox-outline',
            Intercambios: 'swap-horizontal-outline',
            Toques: 'location-outline',
            Biblioteca: 'bookmark-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
      screenListeners={({ route }) => ({
        tabPress: () => handleTabPress(route.name),
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} key={keys.Home} />}
      </Tab.Screen>
      <Tab.Screen name="Foros">
        {(props) => <ForosScreen {...props} key={keys.Foros} />}
      </Tab.Screen>
      <Tab.Screen name="Intercambios">
        {(props) => <IntercambiosScreen {...props} key={keys.Intercambios} />}
      </Tab.Screen>
      <Tab.Screen name="Toques">
        {(props) => <ToquesScreen {...props} key={keys.Toques} />}
      </Tab.Screen>
      <Tab.Screen name="Biblioteca">
        {(props) => <BibliotecaScreen {...props} key={keys.Biblioteca} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}