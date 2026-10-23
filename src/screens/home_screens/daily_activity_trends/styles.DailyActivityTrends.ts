import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createTrendStyles = (theme: AppTheme) => {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      paddingHorizontal: spacing.base,
      paddingBottom: spacing.md,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    statusRow: {
      height: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xs,
    },
    headerMain: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCopy: {
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingHorizontal: spacing.base,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    tabs: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      borderRadius: radius.md,
      marginBottom: spacing.md,
    },
    tab: {
      flex: 1,
      minHeight: 34,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: radius.sm,
    },
    selectedTab: {
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
    },
    chartCard: {
      padding: spacing.base,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    chartHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    weekBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs + 1,
      borderRadius: radius.full,
    },
    chart: {
      height: 126,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginBottom: spacing.xs,
    },
    chartColumn: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    chartBar: {
      width: 22,
      borderTopLeftRadius: radius.full,
      borderTopRightRadius: radius.full,
    },
    dayLabels: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    dayLabel: {
      flex: 1,
      textAlign: 'center',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: spacing.md,
      marginBottom: spacing.md,
    },
    statCard: {
      width: '48.5%',
      minHeight: 78,
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      borderRadius: radius.lg,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    insightCard: {
      padding: spacing.base,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    insightHeading: {
      marginBottom: spacing.xs,
    },
    insightText: {
      lineHeight: 22,
    },
    adjustButton: {
      width: '100%',
      borderRadius: radius.md,
    },
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: colors.overlay,
    },
    goalSheet: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    goalHelp: {
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },
    goalInputWrap: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: spacing.base,
    },
    goalInput: {
      flex: 1,
      fontSize: 18,
      paddingVertical: spacing.sm,
    },
    saveButton: {
      marginTop: spacing.md,
      borderRadius: radius.md,
    },
  });
};
