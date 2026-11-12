import { StyleSheet } from 'react-native';

const createChallengeModalStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },

    modalKeyboardContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'flex-end',
    },

    bottomSheet: {
      maxHeight: '92%',
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
    },

    sheetScrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.base,
    },

    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: spacing.md,
    },

    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },

    closeButton: {
      width: 34,
      height: 34,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    fieldLabel: {
      marginBottom: spacing.xs,
      marginTop: spacing.xs,
    },

    metricPillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs + 2,
      marginBottom: spacing.sm,
      marginTop: spacing.xxs,
    },

    metricPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },

    selectedMetricPill: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },

    presetsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs + 2,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },

    presetChip: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },

    selectedPresetChip: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primary,
    },

    durationPillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.xs,
      marginTop: spacing.xxs,
    },

    durationPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },

    selectedDurationPill: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },

    durationHelper: {
      marginBottom: spacing.sm,
      marginTop: 2,
    },

    summaryCard: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginTop: spacing.md,
      marginBottom: spacing.base,
      borderWidth: 1,
      borderColor: colors.border,
    },

    summaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: spacing.sm,
    },

    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },

    summaryItem: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      padding: spacing.xs + 2,
    },

    summaryItemLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 2,
    },

    summaryItemValue: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },

    submitButton: {
      borderRadius: radius.md,
      marginTop: spacing.xs,
      marginBottom: spacing.xl,
    },
  });

export default createChallengeModalStyles;
