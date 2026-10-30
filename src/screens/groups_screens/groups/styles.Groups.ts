import { StyleSheet } from 'react-native';

const createStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },

    tabs: {
      flexDirection: 'row',
      marginHorizontal: spacing.base,
      marginTop: spacing.base,
      marginBottom: spacing.md,
      padding: spacing.xs,
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.lg,
    },

    tab: {
      flex: 1,
      minHeight: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
    },

    activeTab: {
      backgroundColor: colors.surface,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.xl,
    },
  });

export default createStyles;
