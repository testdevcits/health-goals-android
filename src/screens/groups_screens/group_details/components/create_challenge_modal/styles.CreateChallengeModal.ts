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
    modalOptionsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    modalOption: {
      flex: 1,
    },
    selectOption: {
      minHeight: 44,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      marginTop: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    submitChallengeButton: {
      minHeight: 48,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
  });

export default createChallengeModalStyles;
