import { StyleSheet } from 'react-native';

const createStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      minHeight: 400,
    },

    feedList: {
      paddingHorizontal: spacing.base,
      paddingBottom: spacing.xxl + spacing.lg,
    },

    floatingButton: {
      position: 'absolute',
      bottom: spacing.lg,
      right: spacing.base,
      width: 56,
      height: 56,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      zIndex: 99,
    },

    feedCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.04,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 3 },
    },

    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },

    postAvatar: {
      width: 38,
      height: 38,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },

    postAuthorInfo: {
      flex: 1,
      minWidth: 0,
    },

    postEmoji: {
      fontSize: 18,
    },

    postMessage: {
      marginTop: spacing.md,
      marginBottom: spacing.md,
    },

    postActions: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacing.base,
    },

    postAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      minHeight: 24,
    },
  });

export default createStyles;
