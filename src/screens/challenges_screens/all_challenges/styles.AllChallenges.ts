import { StyleSheet } from 'react-native';

export const createStyles = (
  colors: any,
  spacing: any,
  radius: any,
  screenWidth: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },

    scrollContent: {
      paddingBottom: spacing.xl,
    },

    categoryContainer: {
      flexDirection: 'row',
      marginHorizontal: spacing.base,
      marginTop: spacing.base,
      marginBottom: spacing.md,
      padding: spacing.xs,
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.lg,
    },

    categoryTab: {
      flex: 1,
      minWidth: 0,
      minHeight: 36,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xxs,
      borderRadius: radius.md,
    },

    selectedCategoryTab: {
      backgroundColor: colors.surface,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },

    challengeList: {
      paddingHorizontal: spacing.base,
    },

    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxxl,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
    },
  });

export const createCardStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderLeftWidth: 4,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.045,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 3 },
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.xs,
    },

    titleContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 0,
      gap: spacing.xs,
    },

    emoji: {
      fontSize: 15,
    },

    title: {
      flexShrink: 1,
    },

    statusBadge: {
      borderRadius: radius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      flexShrink: 0,
    },

    description: {
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
    },

    progressTrack: {
      height: 7,
      borderRadius: radius.full,
      overflow: 'hidden',
      backgroundColor: colors.surfaceElevated,
      marginTop: spacing.xs,
    },

    progressFill: {
      height: '100%',
      borderRadius: radius.full,
    },

    progressFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
    },

    continueButton: {
      minHeight: 34,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      marginTop: spacing.sm,
    },
  });
