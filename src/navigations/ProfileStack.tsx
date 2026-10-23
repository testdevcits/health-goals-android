// src/navigations/ProfileStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/profile_screens/profile/Profile';
import Settings from '../screens/profile_screens/settings/Settings';
import EditProfileScreen from '../screens/profile_screens/edit_profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile_screens/change_password/ChangePasswordScreen';
import ConnectedDevicesScreen from '../screens/profile_screens/connected_devices/ConnectedDevicesScreen';
import RewardsScreen from '../screens/profile_screens/rewards/RewardsScreen';
import PrivacyScreen from '../screens/profile_screens/privacy/PrivacyScreen';
import HealthReportsScreen from '../screens/profile_screens/health_reports/HealthReportsScreen';
import HelpSupportScreen from '../screens/profile_screens/help_support/HelpSupportScreen';

export type RootStackParamList = {
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  ConnectedDevices: undefined;
  Rewards: undefined;
  Privacy: undefined;
  HealthReports: undefined;
  HelpSupport: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen
        name="ConnectedDevices"
        component={ConnectedDevicesScreen}
      />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="HealthReports" component={HealthReportsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
