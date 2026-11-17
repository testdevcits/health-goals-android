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
    contentWrapper: {
      flex: 1,
    },
    sectionLabel: {
      marginBottom: spacing.sm,
    },
    healthSectionLabel: {
      marginTop: spacing.xl,
    },
    watchCard: {
      padding: spacing.base,
      borderRadius: spacing.base,
      borderWidth: 1,
      marginBottom: spacing.base,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    watchHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.ml,
    },
    watchInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    watchIconBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
      backgroundColor: colors.backgroundSecondary,
    },
    watchTitleCol: {
      flex: 1,
    },
    statusIndicatorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xxs,
      gap: spacing.s,
    },
    statusDot: {
      width: spacing.sm,
      height: spacing.sm,
      borderRadius: spacing.xs,
      backgroundColor: colors.success,
    },
    disconnectButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.s,
      borderRadius: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.ms,
      marginBottom: spacing.ml,
    },
    metricTile: {
      flex: 1,
      minWidth: '45%',
      padding: spacing.md,
      borderRadius: spacing.md,
      borderWidth: 1,
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.border,
    },
    metricTileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s,
      marginBottom: spacing.xs,
    },
    metricTileValue: {
      marginVertical: spacing.xxs,
    },
    watchFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.ms,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    syncButton: {
      paddingHorizontal: spacing.ml,
      paddingVertical: spacing.s,
      borderRadius: spacing.sm,
      backgroundColor: colors.primary,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: spacing.sm,
    },
    filterText: {
      width: '50%',
    },
    filterChip: {
      paddingHorizontal: spacing.ms,
      paddingVertical: spacing.xs,
      borderRadius: spacing.md,
      borderWidth: 1,
    },
    deviceCard: {
      marginTop: spacing.sm,
    },
    scanButton: {
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    disabledButton: {
      opacity: 0.6,
    },
    deviceNote: {
      marginTop: spacing.md,
      textAlign: 'center',
    },
    emptyDevices: {
      marginTop: spacing.md,
    },
    errorMessage: {
      marginTop: spacing.md,
      textAlign: 'center',
    },
    spacer: {
      height: spacing.ms,
    },
    settingsButton: {
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    infoCard: {
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    modalActions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.base,
    },
    modalActionButton: {
      flex: 1,
    },
  });

export default createStyles;
