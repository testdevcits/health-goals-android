import { StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/useTheme';

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) => {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    keyboardView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: spacing.xl,
    },
    iconContainer: {
      width: 76,
      height: 76,
      borderRadius: radius.xxl,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    description: {
      maxWidth: 300,
      lineHeight: 22,
    },
    email: {
      marginTop: spacing.xs,
      marginBottom: spacing.xl,
    },
    developmentNotice: {
      alignSelf: 'stretch',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xl,
    },
    codeSection: {
      alignSelf: 'stretch',
      marginTop: spacing.sm,
    },
    codeLabel: {
      marginBottom: spacing.md,
    },
    otpContainer: {
      width: '100%',
    },
    otpCell: {
      width: 46,
      height: 56,
      borderRadius: radius.md,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBg,
    },
    otpCellFocused: {
      borderWidth: 1.5,
      backgroundColor: colors.surface,
    },
    otpCellFilled: {
      borderColor: colors.primary,
    },
    otpText: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '600',
    },
    otpPlaceholder: {
      color: colors.textTertiary,
    },
    errorText: {
      marginTop: spacing.sm,
    },
    verifyButton: {
      alignSelf: 'stretch',
      marginTop: spacing.xl,
    },
    helperText: {
      maxWidth: 300,
      lineHeight: 20,
      marginTop: spacing.lg,
    },
  });
};
export default createStyles;
