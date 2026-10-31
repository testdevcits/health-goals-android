import { StyleSheet } from 'react-native';

const createGroupChatStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    chatContainer: {
      flex: 1,
      minHeight: 350,
    },
    chatMessages: {
      flex: 1,
    },
    chatMessagesContent: {
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.sm,
      paddingRight: spacing.xl,
    },
    myMessageRow: {
      justifyContent: 'flex-end',
      paddingLeft: spacing.xl,
      paddingRight: 0,
    },
    chatAvatar: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    messageBubble: {
      maxWidth: '90%',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
    },
    myMessageText: {
      color: colors.white,
    },
    otherMessageText: {
      color: colors.textPrimary,
    },
    otherMessageBubble: {
      backgroundColor: colors.surface,
      borderBottomLeftRadius: radius.xs,
      elevation: 1,
      shadowColor: colors.black,
      shadowOpacity: 0.035,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    myMessageBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: radius.xs,
    },
    messageAuthor: {
      marginBottom: spacing.xxs,
    },
    messageTime: {
      marginTop: spacing.xxs,
      opacity: 0.8,
    },
    myMessageTime: {
      color: colors.white,
    },
    otherMessageTime: {
      color: colors.textTertiary,
    },
    chatComposer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm,
      marginTop: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.full,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    chatInput: {
      flex: 1,
      maxHeight: 100,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      fontSize: 14,
      color: colors.textPrimary,
    },
    sendButton: {
      width: 38,
      height: 38,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default createGroupChatStyles;
