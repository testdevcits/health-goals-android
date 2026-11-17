import { StyleSheet } from 'react-native';

const createStyles = (colors: any, spacing: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    screenContent: {
      paddingHorizontal: spacing.base,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
      flexGrow: 1,
    },
    modalActions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    modalActionButton: {
      flex: 1,
    },
    destructiveButton: {
      backgroundColor: colors.error,
    },
    addMemberButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      gap: spacing.s,
      backgroundColor: colors.primaryLight,
      paddingVertical: spacing.s + 1,
      paddingHorizontal: spacing.md + 1,
      borderRadius: spacing.lg,
      marginBottom: spacing.xs,
    },
    addMemberText: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

export default createStyles;
