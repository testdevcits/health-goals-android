// src/navigations/ChallengesStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChallengesScreen from '../screens/challenges_screens/Challenges/ChallengesScreen';
import AllChallengesScreen from '../screens/challenges_screens/all_challenges/AllChallengesScreen';

export type ChallengesStackParamList = {
  Challenges: undefined;
  AllChallenges: undefined;
};

const Stack = createNativeStackNavigator<ChallengesStackParamList>();

const ChallengesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Challenges" component={ChallengesScreen} />
      <Stack.Screen name="AllChallenges" component={AllChallengesScreen} />
    </Stack.Navigator>
  );
};

export default ChallengesStack;
