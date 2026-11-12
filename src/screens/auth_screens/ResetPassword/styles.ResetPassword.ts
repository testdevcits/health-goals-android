import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createResetPasswordStyles = (theme: AppTheme) => {
  const { spacing, radius, colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xxl,
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      width: '100%',
      maxWidth: 440,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
    },
    iconBox: {
      width: 76,
      height: 76,
      borderRadius: radius.xxl,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.base,
    },
    subtitleText: {
      maxWidth: 320,
      marginTop: spacing.xxs,
      lineHeight: 20,
    },
    formSection: {
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
    },
    rulesBox: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      gap: 4,
    },
    submitButton: {
      marginTop: spacing.md,
    },
  });
};
