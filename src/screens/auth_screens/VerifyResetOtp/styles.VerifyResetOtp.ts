import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createVerifyResetOtpStyles = (theme: AppTheme) => {
  const { colors, spacing, radius } = theme;

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
    emailBadge: {
      marginTop: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xxs,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      maxWidth: 320,
    },
    formSection: {
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
      marginTop: spacing.sm,
    },
    codeLabel: {
      marginBottom: spacing.md,
    },
    otpContainer: {
      width: '100%',
      marginBottom: spacing.xs,
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
      borderColor: colors.primary,
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
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
    },
    verifyButton: {
      marginTop: spacing.xl,
    },
    resendSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
      gap: 6,
    },
  });
};
