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
    },
    // ── Header ────────────────────────────────────
    header: {
      alignItems: 'center',
      paddingTop: spacing.xxxl + spacing.lg,
      paddingBottom: spacing.xxl,
    },
    iconBox: {
      width: 72,
      height: 72,
      borderRadius: radius.xl,
      backgroundColor: '#F5A623',
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
      paddingTop: spacing.sm,
    },
    sendButton: {
      marginTop: spacing.xs,
    },
    // ── Success ───────────────────────────────────
    successBox: {
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
      marginTop: spacing.xxl,
      paddingBottom: spacing.xl,
    },
  });
};
