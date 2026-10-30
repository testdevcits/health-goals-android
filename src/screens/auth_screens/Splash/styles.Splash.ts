// src/screens/Splash/styles.Splash.ts
import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createSplashStyles = (theme: AppTheme) => {
  const { spacing, radius, colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.gradientStart,
    },
    gradientOverlay: {
      ...StyleSheet?.absoluteFill,
      backgroundColor: theme.colors.gradientEnd,
      opacity: 0.55,
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBox: {
      width: 90,
      height: 90,
      borderRadius: radius.xxl,
      backgroundColor: colors.whiteOverlay18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconEmoji: {
      fontSize: 44,
    },
    textBlock: {
      alignItems: 'center',
      marginTop: spacing.lg,
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
    dotActive: {
      backgroundColor: colors.whiteOverlay90,
    },
    dotInactive: {
      backgroundColor: colors.whiteOverlay35,
    },
  });
};
