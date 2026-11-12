import { StyleSheet } from 'react-native';

const createStyles = (colors: any, spacing: any, radius: any) =>
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
      maxHeight: '90%',
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
    },

    sheetScrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.sm,
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
    },

    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },

    iconOption: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
    },

    selectedIconOption: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },

    iconEmoji: {
      fontSize: 22,
    },

    privateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.xs,
      marginBottom: spacing.md,
    },

    capacityNote: {
      marginTop: -spacing.xs,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },

    lockIcon: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    privateText: {
      flex: 1,
    },

    submitButton: {
      borderRadius: radius.md,
      marginTop: spacing.xs,
      marginBottom: spacing.xl,
    },
  });

export default createStyles;
