// src/screens/ForgotPassword/styles.ForgotPassword.ts
import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createForgotPasswordStyles = (theme: AppTheme) => {
  const { spacing, radius, colors } = theme;

  return StyleSheet.create({
    keyboardView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flexGrow: 1,
      paddingBottom: spacing.xxxl,
    },
    scrollContent: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      alignItems: 'center',
    },
    // ── Header ────────────────────────────────────
    header: {
      alignItems: 'center',
      width: '100%',
      maxWidth: 460,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    iconBox: {
      width: 72,
      height: 72,
      borderRadius: radius.xl,
      backgroundColor: colors.warning,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    iconEmoji: {
      fontSize: 36,
    },
    subtitleText: {
      maxWidth: 280,
      marginTop: spacing.sm,
    },
    // ── Form ─────────────────────────────────────
    formSection: {
      width: '100%',
      maxWidth: 460,
      alignSelf: 'center',
      paddingTop: spacing.xs,
    },
    sendButton: {
      marginTop: spacing.xs,
    },
    // ── Success ───────────────────────────────────
    successBox: {
      width: '100%',
      padding: spacing.xl,
      alignItems: 'center',
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceElevated,
    },
    successEmoji: {
      fontSize: 40,
      marginBottom: spacing.md,
    },
    // ── Footer ───────────────────────────────────
    backRow: {
      alignItems: 'center',
      marginTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
  });
};
