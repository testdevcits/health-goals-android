import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 100,
      padding: 16,
    },
    pointsCard: {
      backgroundColor: colors.primary,
      borderRadius: 22,
      padding: 20,
      marginBottom: 12,
    },
    pointsValue: {
      marginVertical: 2,
    },
    lifetimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: 'rgba(255,255,255,0.35)',
    },
    lifetimeMetric: {
      flex: 1,
      gap: 2,
    },
    lifetimeDivider: {
      width: StyleSheet.hairlineWidth,
      height: 34,
      marginHorizontal: 16,
      backgroundColor: 'rgba(255,255,255,0.35)',
    },
    dailyActivityCard: {
      padding: 16,
      marginBottom: 4,
      gap: 14,
    },
    dailyActivityHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    dailyActivityTitle: {
      gap: 2,
    },
    activityStateBadge: {
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    dailyActivityMetrics: {
      flexDirection: 'row',
    },
    dailyActivityMetric: {
      flex: 1,
      gap: 2,
    },
    rewardList: {
      gap: 10,
    },
    rewardRow: {
      minHeight: 74,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      gap: 12,
    },
    rewardIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
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
      gap: 6,
      padding: 14,
    },
    ticketImage: {
      width: '100%',
      height: 180,
      marginTop: 8,
    },
    loadMoreButton: {
      alignItems: 'center',
      paddingVertical: 14,
    },
  });

export default createStyles;
