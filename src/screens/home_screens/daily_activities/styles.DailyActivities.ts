import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createDailyActivityStyles = (theme: AppTheme) => {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },

    scrollContent: {
      paddingHorizontal: spacing.base,
      paddingBottom: spacing.xl,
    },
    ringsArea: {
      height: 220,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metricRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    metricCard: {
      minHeight: 82,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: spacing.xs,
    },
    metricGoal: {
      marginTop: spacing.xxs,
    },
    totals: {
      paddingTop: spacing.xs,
      paddingBottom: spacing.md,
      borderBottomColor: colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginBottom: spacing.md,
    },
    totalRow: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    chartSection: {
      marginBottom: spacing.lg,
    },

    chartSubtitle: {
      marginBottom: spacing.md,
    },
    chart: {
      height: 108,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      marginBottom: spacing.xs,
    },
    chartBarSlot: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    chartBar: {
      width: 12,
      borderTopLeftRadius: radius.full,
      borderTopRightRadius: radius.full,
    },
    chartLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    detailCard: {
      padding: spacing.base,
      marginBottom: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    detailTitle: {
      marginBottom: spacing.sm,
    },
    detailValues: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    detailMetric: {
      flex: 1,
      gap: spacing.xxs,
    },
  });
};
