import { StyleSheet } from "react-native";


const createStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    feedList: {
      paddingHorizontal: spacing.base,
    },

    feedCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.black,
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

  export default createStyles