import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../../../theme';

export const createChallengesTabStyles = (theme: AppTheme) => {
  const { colors, spacing, radius, fonts, typography } = theme;

  return StyleSheet.create({
    section: {
      marginBottom: spacing.lg,
    },
    newChallengeButton: {
      minHeight: 48,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
    },
    newChallengeText: {
      fontFamily: fonts.semiBold,
      fontSize: typography.body2.fontSize,
      color: colors.primary,
    },
  });
};

export default createChallengesTabStyles;
