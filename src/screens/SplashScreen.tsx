// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigation';
import { useTheme } from '../theme/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;

  // animations
  const logoScale = new Animated.Value(0.6);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  const dotsOpacity = new Animated.Value(0);

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

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.gradientStart },
      ]}>
      {/* Background gradient simulation */}
      <View style={styles.gradientOverlay} />

      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}>
        {/* App icon square */}
        <View style={styles.iconBox}>
          <Text style={styles.iconEmoji}>💚</Text>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text
          style={[
            typography.headline2,
            { color: colors.white, marginTop: spacing.lg },
          ]}>
          Vitality
        </Text>
        <Text
          style={[
            typography.body2,
            { color: 'rgba(255,255,255,0.75)', marginTop: spacing.xs },
          ]}>
          Your health, your crew, your momentum
        </Text>
      </Animated.View>

      <Animated.View style={[styles.dots, { opacity: dotsOpacity }]}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === 2
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.35)',
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    // teal → blue → purple gradient via overlapping views
    backgroundColor: '#5B6BF5',
    opacity: 0.55,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 44,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 48,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default SplashScreen;
