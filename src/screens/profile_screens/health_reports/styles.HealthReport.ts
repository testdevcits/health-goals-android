import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../theme/colors';

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundSecondary },
    scrollContent: { flexGrow: 1, paddingBottom: 100, padding: 16 },
    reportCard: { padding: 16, marginBottom: 12 },
    summaryCard: {
      padding: 16,
      marginBottom: 12,
      gap: 8,
    },
    recordsCard: {
      padding: 16,
      marginBottom: 12,
    },
    recordsHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    recordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    recordCopy: {
      flex: 1,
      gap: 3,
    },
    loadMoreRecords: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    rewardsCard: {
      padding: 16,
      marginBottom: 12,
    },
    rewardsHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 14,
    },
    periodBadge: {
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    rewardMetrics: {
      flexDirection: 'row',
      borderRadius: 14,
      backgroundColor: colors.backgroundSecondary,
      paddingVertical: 12,
      marginBottom: 20,
    },
    rewardMetric: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      borderRightWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 4,
    },
    rewardIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    dailyHistoryHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    reportHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    dateRangeButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    calendarOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    calendarCard: {
      width: '100%',
      maxWidth: 420,
      borderRadius: 16,
      padding: 16,
      elevation: 8,
    },
    calendarTitle: {
      marginBottom: 4,
    },
    calendarHint: {
      marginBottom: 12,
    },
    calendarActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 12,
    },
    calendarAction: {
      minWidth: 92,
    },
    tabs: {
      height: 38,
      borderRadius: 12,
      padding: 3,
      flexDirection: 'row',
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
    },
    chart: {
      height: 126,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      marginBottom: 12,
    },
    chartDay: { alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
    bar: { width: 19, borderRadius: 10 },
    chartPlaceholder: {
      height: 126,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    activityList: {
      gap: 10,
    },
    activityDay: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
    },
    activityDayHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 2,
    },
    activityStatus: {
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 26,
      gap: 8,
    },
    activityIconWrap: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activityLabel: {
      flex: 1,
    },
    activityValue: {
      minWidth: 68,
      textAlign: 'right',
    },
    activityCoins: {
      minWidth: 66,
      textAlign: 'right',
    },
    rewardBreakdown: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingTop: 8,
      marginTop: 4,
    },
    rewardBreakdownItem: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
    },
    rewardBreakdownMiddle: {
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderRightWidth: StyleSheet.hairlineWidth,
    },
    reportActions: { flexDirection: 'row', gap: 8 },
    reportButton: {
      flex: 1,
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderRadius: 11,
    },
  });

export default createStyles;
