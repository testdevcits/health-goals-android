// src/screens/Login/styles.Login.ts
import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createLoginStyles = (theme: AppTheme) => {
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
      paddingBottom: spacing.xl,
    },
    iconBox: {
      width: 72,
      height: 72,
      borderRadius: radius.xl,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    iconEmoji: {
      fontSize: 36,
    },
    // ── Form ─────────────────────────────────────
    formSection: {
      paddingTop: spacing.sm,
    },
    forgotRow: {
      alignSelf: 'flex-end',
      marginTop: -spacing.sm,
      marginBottom: spacing.base,
      paddingVertical: spacing.xs,
    },
    signInButton: {
      marginBottom: spacing.lg,
    },
    // ── Divider ───────────────────────────────────
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.base,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.divider,
    },
    dividerText: {
      marginHorizontal: spacing.md,
    },
    // ── Social buttons ────────────────────────────
    socialButton: {
      marginBottom: spacing.md,
    },
    // ── Footer ───────────────────────────────────
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
  });
};
