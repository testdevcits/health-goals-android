import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../../../theme';

export const createDailySummaryStyles = (theme: AppTheme) => {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    summaryContainer: {
      marginHorizontal: spacing.xl,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    summaryCard: {
      flex: 1,
      minHeight: 135,
      padding: spacing.base,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      elevation: 2,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    runningHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    metricRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: spacing.xs,
    },
    bottomIcon: {
      position: 'absolute',
      right: spacing.base,
      bottom: spacing.base,
    },
    playButton: {
      position: 'absolute',
      right: spacing.base,
      bottom: spacing.base,
      width: 24,
      height: 24,
      borderRadius: 17,
      backgroundColor: colors.coral,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
