// src/navigations/DiscoverStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Discover from '../screens/discover_screens/discover/Discover';

export type DiscoverStack = {
  Discover: undefined;
};

const Stack = createNativeStackNavigator<DiscoverStack>();

const DiscoverStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Discover" component={Discover} />
    </Stack.Navigator>
  );
};

export default DiscoverStack;
