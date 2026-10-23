// src/navigations/GroupsStack.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsScreen from '../screens/groups_screens/Groups/GroupsScreen';

export type RootStackParamList = {
  Groups: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GroupsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Groups" component={GroupsScreen} />
    </Stack.Navigator>
  );
};

export default GroupsStack;
