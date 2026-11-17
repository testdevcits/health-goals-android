import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.huge + spacing.xxxl,
      padding: spacing.base,
    },
    pointsCard: {
      backgroundColor: colors.primary,
      borderRadius: 22,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    pointsValue: {
      marginVertical: spacing.xxs,
    },
    lifetimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.base,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.whiteOverlay35,
    },
    lifetimeMetric: {
      flex: 1,
      gap: spacing.xxs,
    },
    lifetimeDivider: {
      width: StyleSheet.hairlineWidth,
      height: 34,
      marginHorizontal: spacing.base,
      backgroundColor: colors.whiteOverlay35,
    },
    dailyActivityCard: {
      padding: spacing.base,
      marginBottom: spacing.xs,
      gap: spacing.ml,
    },
    dailyActivityHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.ms,
    },
    dailyActivityTitle: {
      gap: spacing.xxs,
    },
    activityStateBadge: {
      borderRadius: spacing.md,
      paddingHorizontal: spacing.ms,
      paddingVertical: spacing.s - 1,
    },
    dailyActivityMetrics: {
      flexDirection: 'row',
    },
    dailyActivityMetric: {
      flex: 1,
      gap: spacing.xxs,
    },
    rewardList: {
      gap: spacing.ms,
    },
    rewardRow: {
      minHeight: 74,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.ml,
      gap: spacing.md,
    },
    rewardIcon: {
      width: 42,
      height: 42,
      borderRadius: spacing.md,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rewardCopy: {
      flex: 1,
    },
    redeemAction: {
      alignItems: 'flex-end',
    },
    ticketCard: {
      gap: spacing.s,
      padding: spacing.ml,
    },
    ticketImage: {
      width: '100%',
      height: 180,
      marginTop: spacing.sm,
    },
    loadMoreButton: {
      alignItems: 'center',
      paddingVertical: spacing.ml,
    },
  });

export default createStyles;
