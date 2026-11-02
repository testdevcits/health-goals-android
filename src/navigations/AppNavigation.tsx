// src/navigations/AppNavigation.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth_screens/Login/LoginScreen';
import MainTabNavigation from './MainTabNavigation';
import SplashScreen from '../screens/auth_screens/Splash/SplashScreen';
import RegisterScreen from '../screens/auth_screens/Register/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth_screens/ForgotPassword/ForgotPasswordScreen';
import Notifications from '../screens/common_screens/notifications/Notifications';
import VerifyEmailScreen from '../screens/auth_screens/VerifyEmailScreen';
import { restoreSession } from '../services/auth';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
  VerifyEmail: { challengeId: string; email: string; purpose: 'login' | 'register'; deliveryMode?: string };
  MainTabNavigation: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const AppNavigation = () => {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'MainTabNavigation' | null>(null);
  useEffect(() => {
    restoreSession()
      .then(session => setInitialRoute(session ? 'MainTabNavigation' : 'Login'))
      .catch(() => setInitialRoute('Login'));
  }, []);

  if (!initialRoute) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} /> */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="MainTabNavigation"
          component={MainTabNavigation}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
