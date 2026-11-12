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
      gap: 12,
      marginTop: 8,
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
      gap: 6,
      backgroundColor: colors.primaryLight,
      paddingVertical: 7,
      paddingHorizontal: 13,
      borderRadius: 20,
      marginBottom: spacing.xs,
    },
    addMemberText: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

export default createStyles;
