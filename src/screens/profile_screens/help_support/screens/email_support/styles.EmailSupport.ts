import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../../../theme';

export const createEmailSupportStyles = (theme: AppTheme) => {
  const { colors, spacing, radius } = theme;

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
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    iconBox: {
      width: 72,
      height: 72,
      borderRadius: radius.lg,
      backgroundColor: colors.infoLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    iconText: {
      fontSize: 38,
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
    composeButton: {
      borderRadius: radius.lg,
      marginTop: spacing.xs,
      marginBottom: spacing.xxl,
    },
    sectionLabel: {
      marginBottom: spacing.md,
      marginLeft: spacing.xs,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.base,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingVertical: spacing.xs,
    },
    infoEmoji: {
      fontSize: 20,
      marginTop: 2,
    },
    infoContent: {
      flex: 1,
    },
    infoDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
      marginVertical: spacing.sm,
    },
    footerNote: {
      marginTop: spacing.md,
      marginBottom: spacing.xl,
      textAlign: 'center',
      lineHeight: 18,
      paddingHorizontal: spacing.md,
    },
  });
};
