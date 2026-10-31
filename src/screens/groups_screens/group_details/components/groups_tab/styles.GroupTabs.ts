import { StyleSheet } from 'react-native';

const createGroupTabsStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    tabs: {
      flexDirection: 'row',
      padding: spacing.xs,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceElevated,
      marginBottom: spacing.md,
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
  });

export default createGroupTabsStyles;
