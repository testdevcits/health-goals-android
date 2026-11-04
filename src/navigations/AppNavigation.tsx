// src/navigations/AppNavigation.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { HeartPulse } from 'lucide-react-native';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppText from '../components/AppText';
import LoginScreen from '../screens/auth_screens/Login/LoginScreen';
import MainTabNavigation from './MainTabNavigation';
import SplashScreen from '../screens/auth_screens/Splash/SplashScreen';
import RegisterScreen from '../screens/auth_screens/Register/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth_screens/ForgotPassword/ForgotPasswordScreen';
import Notifications from '../screens/common_screens/notifications/Notifications';
import VerifyEmailScreen from '../screens/auth_screens/verify_email /VerifyEmailScreen';
import { restoreSession } from '../services/auth';
import { useTheme } from '../theme/useTheme';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
  VerifyEmail: {
    challengeId: string;
    email: string;
    purpose: 'login' | 'register';
    deliveryMode?: string;
  };
  MainTabNavigation: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const AppNavigation = () => {
  const { theme } = useTheme();
  const bounce = useRef(new Animated.Value(0)).current;
  const [initialRoute, setInitialRoute] = useState<
    'Login' | 'MainTabNavigation' | null
  >(null);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 420,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [bounce]);

  useEffect(() => {
    restoreSession()
      .then(session => setInitialRoute(session ? 'MainTabNavigation' : 'Login'))
      .catch(() => setInitialRoute('Login'));
  }, []);

  if (!initialRoute)
    return (
      <View
        style={[
          styles.loader,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Animated.View
          style={[
            styles.loaderIcon,
            { backgroundColor: theme.colors.primaryLight },
            {
              opacity: bounce.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              }),
              transform: [
                {
                  translateY: bounce.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
                {
                  scale: bounce.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1.06],
                  }),
                },
              ],
            },
          ]}
        >
          <HeartPulse
            size={40}
            color={theme.colors.primary}
            strokeWidth={2}
          />
        </Animated.View>
        <AppText
          variant="body2"
          style={[styles.loaderMessage, { color: theme.colors.textSecondary }]}
        >
          Getting things ready…
        </AppText>
      </View>
    );
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
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmailScreen}
          options={{ animation: 'slide_from_right' }}
        />
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

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderIcon: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
  },
  loaderMessage: {
    marginTop: 20,
  },
});

export default AppNavigation;
