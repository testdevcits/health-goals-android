// src/navigations/GroupsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsScreen from '../screens/groups_screens/groups/GroupsScreen';
import GroupDetailScreen from '../screens/groups_screens/group_details/GroupDetailScreen';

export type RootStackParamList = {
  Groups: undefined;
  GroupDetails: {
    groupId: string;
    name: string;
    description: string;
    members: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GroupsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetailScreen} />
    </Stack.Navigator>
  );
};

export default GroupsStack;
