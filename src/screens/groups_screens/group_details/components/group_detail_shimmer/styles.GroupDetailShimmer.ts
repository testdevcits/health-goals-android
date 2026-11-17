import { StyleSheet } from 'react-native';

export const createGroupDetailShimmerStyles = (colors: any, spacing: any) =>
  StyleSheet.create({
    container: {
      gap: spacing.md,
    },
    // Banner skeleton
    bannerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 26,
      padding: spacing.lg,
      minHeight: 132,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    bannerIcon: {
      width: 70,
      height: 70,
      borderRadius: 22,
      backgroundColor: colors.surfaceElevated,
      marginRight: spacing.base,
    },
    bannerContent: {
      flex: 1,
      justifyContent: 'center',
    },
    bannerTitle: {
      width: 140,
      height: 22,
      borderRadius: spacing.s,
      backgroundColor: colors.surfaceElevated,
    },
    bannerSubtitle: {
      width: 190,
      height: 14,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
      marginTop: spacing.sm,
    },
    avatarStack: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.ms,
    },
    stackAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceElevated,
      marginRight: -6,
      borderWidth: 2,
      borderColor: colors.surface,
    },
    // Tabs
    tabsContainer: {
      marginVertical: spacing.xs,
    },
    // Section Title Placeholder
    sectionTitle: {
      width: 130,
      height: 18,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
      marginBottom: spacing.sm,
      marginTop: spacing.xs,
    },
    // Overview: Goal Card skeleton
    goalCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.sl,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    goalRing: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: colors.surfaceElevated,
      marginRight: spacing.sl,
    },
    goalContent: {
      flex: 1,
      justifyContent: 'center',
    },
    goalLabel: {
      width: 80,
      height: 14,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
    goalValue: {
      width: 130,
      height: 24,
      borderRadius: spacing.s,
      backgroundColor: colors.surfaceElevated,
      marginVertical: spacing.s,
    },
    goalSubtext: {
      width: 110,
      height: 12,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
    // Overview: Preview Card skeleton
    cardContainer: {
      padding: spacing.base,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: spacing.md,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.ms,
    },
    cardIcon: {
      width: 36,
      height: 36,
      borderRadius: spacing.ms,
      backgroundColor: colors.surfaceElevated,
    },
    cardTitle: {
      width: 130,
      height: 16,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
    cardBadge: {
      width: 60,
      height: 20,
      borderRadius: spacing.ms,
      backgroundColor: colors.surfaceElevated,
    },
    cardProgressBar: {
      height: spacing.s,
      borderRadius: spacing.xs - 1,
      backgroundColor: colors.surfaceElevated,
      width: '100%',
    },
    cardFooterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardFooterText: {
      width: 90,
      height: 12,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
    cardFooterBtn: {
      width: 76,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceElevated,
    },
    // Leaderboard Skeleton
    leaderboardIntro: {
      width: 160,
      height: 14,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
      alignSelf: 'center',
      marginVertical: spacing.xs,
    },
    contributorsCard: {
      padding: spacing.base,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: spacing.ml,
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    memberRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.ms,
    },
    memberRank: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.surfaceElevated,
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceElevated,
    },
    memberTextCol: {
      gap: spacing.xs,
    },
    memberName: {
      width: 110,
      height: 14,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
    memberSubtext: {
      width: 60,
      height: 10,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
    memberSteps: {
      width: 68,
      height: 20,
      borderRadius: spacing.ms,
      backgroundColor: colors.surfaceElevated,
    },
    // Challenges Tab Skeleton
    challengeFullCard: {
      padding: spacing.sl,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: spacing.xs,
      borderLeftColor: colors.primary,
      backgroundColor: colors.surface,
      gap: spacing.md,
    },
    challengeDescLine: {
      width: '90%',
      height: 13,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
    challengeDescLine2: {
      width: '65%',
      height: 13,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
    challengeFullBtn: {
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfaceElevated,
      width: '100%',
      marginTop: spacing.xs,
    },
    newChallengeButton: {
      height: 46,
      borderRadius: spacing.ml,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
    newChallengeText: {
      width: 120,
      height: 14,
      borderRadius: spacing.xs,
      backgroundColor: colors.surfaceElevated,
    },
  });

export default createGroupDetailShimmerStyles;
