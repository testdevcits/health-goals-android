// src/navigations/GroupsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsScreen from '../screens/groups_screens/groups/GroupsScreen';
import GroupDetailScreen from '../screens/groups_screens/group_details/GroupDetailScreen';
import GroupSetting from '../screens/groups_screens/group_settings/GroupSetting';

export type RootStackParamList = {
  Groups: undefined;
  GroupDetails: {
    groupId: string;
    name: string;
    description: string;
    members: number;
    private?: boolean;
  };
  GroupSetting: {
    groupId: string;
    groupName: string;
    groupDescription?: string;
    groupImageUrl?: string;
    groupEmoji?: string;
    isLeader?: boolean;
    memberCount?: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GroupsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetailScreen} />
      <Stack.Screen name="GroupSetting" component={GroupSetting} />

    </Stack.Navigator>
  );
};

export default GroupsStack;
