// src/screens/Splash/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useTheme } from '../../../theme/useTheme';
import AppText from '../../../components/AppText';
import { createSplashStyles } from './styles.Splash';
import * as Animatable from 'react-native-animatable';


type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createSplashStyles(theme);

  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Login'), 2600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.gradientOverlay} />

      {/* Animated Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}>
        <View style={styles.iconBox}>
          <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.iconEmoji}>💚</Animatable.Text>
        </View>
      </Animated.View>

      {/* Animated Text */}
      <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
        <AppText variant="h2" color="white" center>
          Vitality
        </AppText>
        <AppText
          variant="body2"
          color="white"
          center
          mt={6}
          style={{ opacity: 0.75 }}>
          Your health, your crew, your momentum
        </AppText>
      </Animated.View>

      {/* Animated Dots */}
      <Animated.View style={[styles.dots, { opacity: dotsOpacity }]}>
        {[0, 1, 2].map(i => (
          <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite"
            key={i}
            style={[
              styles.dot,
              i === 1 ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
