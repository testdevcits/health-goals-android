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
  });

export default createStyles;
