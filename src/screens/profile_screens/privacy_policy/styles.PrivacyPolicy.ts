import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../theme';

export const createPrivacyPolicyStyles = (theme: AppTheme) => {
  const { colors, spacing, radius, fonts } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxxl + spacing.xl,
    },
    heroCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
      alignItems: 'center',
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    iconText: {
      fontSize: 48,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    heroTitle: {
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    heroDescription: {
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 320,
      color: colors.textSecondary,
    },
    effectiveDateBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: 5,
      borderRadius: radius.full,
      backgroundColor: colors.primaryLight,
      marginTop: spacing.md,
    },
    effectiveDateText: {
      fontFamily: fonts.medium,
      fontSize: 12,
      color: colors.primaryDark,
    },
    sectionLabel: {
      marginBottom: spacing.md,
      marginLeft: spacing.xs,
    },
    policyCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.base,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    policyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    policyEmoji: {
      fontSize: 20,
    },
    policyText: {
      lineHeight: 21,
      paddingLeft: 28,
      color: colors.textSecondary,
    },
    actionButton: {
      borderRadius: radius.lg,
      marginTop: spacing.sm,
      marginBottom: spacing.xxl,
    },
    footerNote: {
      marginTop: spacing.sm,
      marginBottom: spacing.xl,
      textAlign: 'center',
      lineHeight: 18,
      paddingHorizontal: spacing.md,
      color: colors.textTertiary,
    },
  });
};
