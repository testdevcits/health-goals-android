import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../theme';
import { fonts } from '../../../theme/fonts';
import { typography } from '../../../theme/typography';

export const createStyles = (theme: AppTheme) => {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      paddingHorizontal: spacing.base,
      paddingTop: spacing.md,
      paddingBottom: spacing.huge,
    },
    imageSection: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      marginTop: spacing.xs,
    },
    imageContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      position: 'relative',
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 5,
    },
    groupImage: {
      width: 96,
      height: 96,
      borderRadius: 48,
    },
    imagePlaceholder: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.surface,
    },
    avatarEmoji: {
      fontSize: typography.metricNumber.fontSize,
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      elevation: 4,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 4,
    },
    imageActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    emojiScrollContent: {
      paddingVertical: spacing.xs,
      gap: spacing.sm,
    },
    emojiChip: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.border,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    emojiChipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
      borderWidth: 2,
      elevation: 3,
      shadowColor: colors.primary,
      shadowOpacity: 0.25,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    emojiText: {
      fontSize: typography.h2.fontSize,
    },
    sectionLabel: {
      fontFamily: fonts.semiBold,
      fontSize: typography.caption.fontSize,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.textSecondary,
      marginTop: spacing.lg,
      marginBottom: spacing.xs + 2,
      paddingHorizontal: spacing.xs,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: 'hidden',
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
      minHeight: 60,
    },
    iconBadge: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    rowContent: {
      flex: 1,
      justifyContent: 'center',
    },
    rowTitle: {
      fontFamily: fonts.semiBold,
      fontSize: typography.body1.fontSize,
      color: colors.textPrimary,
    },
    rowSubtitle: {
      fontFamily: fonts.regular,
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
      marginTop: 2,
    },
    rowValue: {
      fontFamily: fonts.medium,
      fontSize: typography.body2.fontSize,
      color: colors.textSecondary,
    },
    nameInput: {
      flex: 1.5,
      textAlign: 'right',
      fontFamily: fonts.semiBold,
      fontSize: typography.body1.fontSize,
      color: colors.textPrimary,
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.xs,
    },
    descInput: {
      flex: 1.5,
      textAlign: 'right',
      fontFamily: fonts.regular,
      fontSize: typography.label.fontSize,
      color: colors.textPrimary,
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.xs,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
      marginLeft: 68,
    },
    dangerTitle: {
      color: colors.coral,
    },
    dangerSubtitle: {
      color: colors.textSecondary,
    },
    saveButton: {
      marginTop: spacing.xl + 4,
      marginBottom: spacing.md,
      minHeight: 52,
      borderRadius: radius.lg,
    },
  });
};

export default createStyles;
