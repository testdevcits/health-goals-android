// src/screens/Register/styles.Register.ts
import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const createRegisterStyles = (theme: AppTheme) => {
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
    // ── Header ──────────────────────────────────
    header: {
      alignItems: 'center',
      paddingTop: spacing.xxl + spacing.md,
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
      // Subtle shadow
      elevation: 4,
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    iconEmoji: {
      fontSize: 34,
    },
    // ── Form ────────────────────────────────────
    formSection: {
      paddingTop: spacing.xs,
    },
    // Company Code + Goal row
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    halfContainer: {
      flex: 1,
    },
    // ── Terms ───────────────────────────────────
    termsRow: {
      marginBottom: spacing.lg,
    },
    termsLinkRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    // ── Actions ─────────────────────────────────
    createButton: {
      marginBottom: spacing.lg,
    },
    // ── Footer ──────────────────────────────────
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: spacing.xl,
    },
  });
};
