import { StyleSheet } from "react-native";
const createStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    groupList: {
      paddingHorizontal: spacing.base,
    },

    groupCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      minHeight: 108,
      gap: spacing.md,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 3 },
    },

    groupIcon: {
      width: 52,
      height: 52,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },

    groupEmoji: {
      fontSize: 25,
    },

    groupInfo: {
      flex: 1,
      minWidth: 0,
    },

    memberAvatars: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },

    memberAvatar: {
      width: 22,
      height: 22,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.surface,
      marginRight: -4,
      overflow: 'hidden',
    },

    memberAvatarText: {
      fontSize: 9,
      lineHeight: 10,
      color: colors.white,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },

    moreMembers: {
      width: 19,
      height: 19,
      borderRadius: radius.full,
      backgroundColor: colors.textTertiary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.surface,
      marginLeft: 1,
    },

    moreMembersText: {
      fontSize: 8,
      lineHeight: 10,
    },

    createGroupButton: {
      minHeight: 48,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
  });

  export default createStyles