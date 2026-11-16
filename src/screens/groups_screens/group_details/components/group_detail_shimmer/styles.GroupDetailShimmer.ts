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
      padding: 20,
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
      marginRight: 16,
    },
    bannerContent: {
      flex: 1,
      justifyContent: 'center',
    },
    bannerTitle: {
      width: 140,
      height: 22,
      borderRadius: 6,
      backgroundColor: colors.surfaceElevated,
    },
    bannerSubtitle: {
      width: 190,
      height: 14,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
      marginTop: 8,
    },
    avatarStack: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
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
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
      marginBottom: spacing.sm,
      marginTop: spacing.xs,
    },
    // Overview: Goal Card skeleton
    goalCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
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
      marginRight: 18,
    },
    goalContent: {
      flex: 1,
      justifyContent: 'center',
    },
    goalLabel: {
      width: 80,
      height: 14,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
    },
    goalValue: {
      width: 130,
      height: 24,
      borderRadius: 6,
      backgroundColor: colors.surfaceElevated,
      marginVertical: 6,
    },
    goalSubtext: {
      width: 110,
      height: 12,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
    },
    // Overview: Preview Card skeleton
    cardContainer: {
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 12,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    cardIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.surfaceElevated,
    },
    cardTitle: {
      width: 130,
      height: 16,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
    },
    cardBadge: {
      width: 60,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.surfaceElevated,
    },
    cardProgressBar: {
      height: 6,
      borderRadius: 3,
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
      borderRadius: 4,
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
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
      alignSelf: 'center',
      marginVertical: spacing.xs,
    },
    contributorsCard: {
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 14,
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    memberRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
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
      gap: 4,
    },
    memberName: {
      width: 110,
      height: 14,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
    },
    memberSubtext: {
      width: 60,
      height: 10,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
    },
    memberSteps: {
      width: 68,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.surfaceElevated,
    },
    // Challenges Tab Skeleton
    challengeFullCard: {
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      backgroundColor: colors.surface,
      gap: 12,
    },
    challengeDescLine: {
      width: '90%',
      height: 13,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
    },
    challengeDescLine2: {
      width: '65%',
      height: 13,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
    },
    challengeFullBtn: {
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfaceElevated,
      width: '100%',
      marginTop: 4,
    },
    newChallengeButton: {
      height: 46,
      borderRadius: 14,
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
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
    },
  });

export default createGroupDetailShimmerStyles;
