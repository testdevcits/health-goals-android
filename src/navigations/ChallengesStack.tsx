// src/navigations/ChallengesStack.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home_screens/Home/HomeScreen';
import ChallengesScreen from '../screens/challenges_screens/Challenges/ChallengesScreen';


export type ChallengesStackParamList = {
    Challenges: undefined;
};

const Stack = createNativeStackNavigator<ChallengesStackParamList>();

const ChallengesStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="Challenges" component={ChallengesScreen} />

        </Stack.Navigator>
    );
};

export default ChallengesStack;
