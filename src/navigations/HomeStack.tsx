// src/navigations/HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home_screens/Home/HomeScreen';
import DailyActivities from '../screens/home_screens/daily_activities/DailyActivities';
import DailyActivityTrends from '../screens/home_screens/daily_activity_trends/DailyActivityTrends';
import WorkoutCategoriesScreen from '../screens/home_screens/categories/WorkoutCategoriesScreen';
import CategoriesDetailsScreen from '../screens/home_screens/categories_details/CategoriesDetailsScreen';
import WorkoutSessionScreen from '../screens/home_screens/workout_sessions/WorkoutSessionScreen';

export type RootStackParamList = {
  Home: undefined;
  DailyActivities: undefined;
  DailyActivityTrends: undefined;
  Category: undefined;
  CategoriesDetailsScreen: undefined;
  WorkoutSession: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DailyActivities" component={DailyActivities} />
      <Stack.Screen
        name="DailyActivityTrends"
        component={DailyActivityTrends}
      />
      <Stack.Screen name="Category" component={WorkoutCategoriesScreen} />
      <Stack.Screen
        name="CategoriesDetailsScreen"
        component={CategoriesDetailsScreen}
      />    
      <Stack.Screen
        name="WorkoutSession"
        component={WorkoutSessionScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
