// src/navigations/ProfileStack.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/profile_screens/profile/Profile';
import Settings from '../screens/profile_screens/settings/Settings';


export type RootStackParamList = {
    Profile: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileStack = () => {
    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>

    );
};

export default ProfileStack;
