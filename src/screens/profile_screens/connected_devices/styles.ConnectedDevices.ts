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
    contentWrapper: {
      flex: 1,
    },
    sectionLabel: {
      marginBottom: 8,
    },
    healthSectionLabel: {
      marginTop: 24,
    },
    watchCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 16,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    watchHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
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
      marginRight: 12,
      backgroundColor: colors.backgroundSecondary,
    },
    watchTitleCol: {
      flex: 1,
    },
    statusIndicatorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      gap: 6,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
    },
    disconnectButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 14,
    },
    metricTile: {
      flex: 1,
      minWidth: '45%',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.border,
    },
    metricTileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    metricTileValue: {
      marginVertical: 2,
    },
    watchFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    syncButton: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    filterText: {
      width: '50%',
    },
    filterChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    deviceCard: {
      marginTop: 8,
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
      marginTop: 12,
      textAlign: 'center',
    },
    emptyDevices: {
      marginTop: 12,
    },
    errorMessage: {
      marginTop: 12,
      textAlign: 'center',
    },
    spacer: {
      height: 10,
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
      gap: 12,
      marginTop: 16,
    },
    modalActionButton: {
      flex: 1,
    },
  });

export default createStyles;
