import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import ScanScreen   from './screens/ScanScreen';
import ResultScreen from './screens/ResultScreen';
import AboutScreen  from './screens/AboutScreen';
import GuideScreen  from './screens/GuideScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ScanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanMain" component={ScanScreen} />
      <Stack.Screen name="Result"   component={ResultScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor:   '#00D4AA',
          tabBarInactiveTintColor: '#6B7280',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Detect: focused ? 'scan'   : 'scan-outline',
              Guide:  focused ? 'book'   : 'book-outline',
              Team:   focused ? 'people' : 'people-outline',
            };
            return (
              <View style={[styles.iconWrap, focused && styles.iconActive]}>
                <Ionicons name={icons[route.name]} size={22} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Detect" component={ScanStack}   />
        <Tab.Screen name="Guide"  component={GuideScreen} />
        <Tab.Screen name="Team"   component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0D1117',
    borderTopColor:  '#1C2333',
    borderTopWidth:  1,
    height:          68,
    paddingBottom:   10,
    paddingTop:      6,
  },
  tabLabel: {
    fontSize:      11,
    fontWeight:    '600',
    letterSpacing: 0.3,
  },
  iconWrap: {
    padding:      4,
    borderRadius: 10,
  },
  iconActive: {
    backgroundColor: 'rgba(0,212,170,0.12)',
  },
});
