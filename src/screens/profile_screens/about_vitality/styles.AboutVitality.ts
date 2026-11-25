import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../theme';
import { typography } from '../../../theme/typography';

export const createAboutVitalityStyles = (theme: AppTheme) => {
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
    appIconBadge: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 4,
    },
    appIconEmoji: {
      fontSize: typography.display.fontSize,
    },
    appName: {
      marginBottom: 4,
      textAlign: 'center',
    },
    appTagline: {
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 320,
      color: colors.textSecondary,
    },
    versionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      marginTop: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    versionText: {
      fontFamily: fonts.medium,
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    sectionLabel: {
      marginBottom: spacing.md,
      marginLeft: spacing.xs,
    },
    featureCard: {
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
    featureHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    featureEmoji: {
      fontSize: typography.h3.fontSize,
    },
    featureText: {
      lineHeight: 21,
      paddingLeft: 28,
      color: colors.textSecondary,
    },
    specCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.base,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    specRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    specLabel: {
      fontFamily: fonts.medium,
      fontSize: typography.label.fontSize,
      color: colors.textSecondary,
    },
    specValue: {
      fontFamily: fonts.semiBold,
      fontSize: typography.label.fontSize,
      color: colors.textPrimary,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
      marginVertical: spacing.xs,
    },
    actionButton: {
      borderRadius: radius.lg,
      marginTop: spacing.xs,
      marginBottom: spacing.xxl,
    },
    footerNote: {
      marginBottom: spacing.xl,
      textAlign: 'center',
      lineHeight: 18,
      color: colors.textTertiary,
    },
  });
};
