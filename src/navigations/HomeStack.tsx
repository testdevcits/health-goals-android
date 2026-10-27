// src/navigations/HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home_screens/Home/HomeScreen';
import DailyActivities from '../screens/home_screens/daily_activities/DailyActivities';
import DailyActivityTrends from '../screens/home_screens/daily_activity_trends/DailyActivityTrends';
import WorkoutCategoriesScreen from '../screens/home_screens/categories/WorkoutCategoriesScreen';
import CategoriesDetailsScreen from '../screens/home_screens/categories_details/CategoriesDetailsScreen';
import WorkoutSessionScreen from '../screens/home_screens/workout_sessions/WorkoutSessionScreen';
import type { WorkoutCategory } from '../screens/home_screens/categories/consts';

export type HomeStackParamList = {
  Home: undefined;
  DailyActivities: undefined;
  DailyActivityTrends: undefined;
  Categories: undefined;
  CategoriesDetailsScreen:
    | { source: 'categories'; category: WorkoutCategory }
    | { source: 'home'; workoutId: string };
  WorkoutSession: { activityId?: string } | undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DailyActivities" component={DailyActivities} />
      <Stack.Screen
        name="DailyActivityTrends"
        component={DailyActivityTrends}
      />
      <Stack.Screen name="Categories" component={WorkoutCategoriesScreen} />
      <Stack.Screen
        name="CategoriesDetailsScreen"
        component={CategoriesDetailsScreen}
      />
      <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
