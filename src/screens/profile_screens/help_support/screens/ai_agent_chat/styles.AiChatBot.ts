import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../../../theme';

export const createAiChatBotStyles = (theme: AppTheme) => {
  const { colors, spacing, radius, typography } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    keyboardContainer: {
      flex: 1,
    },
    disclaimerBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      marginHorizontal: spacing.base,
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    disclaimerText: {
      flex: 1,
      lineHeight: 16,
    },
    messagesList: {
      flex: 1,
    },
    messagesContent: {
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
      paddingBottom: spacing.base,
      gap: spacing.md,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.sm,
    },
    userRow: {
      justifyContent: 'flex-end',
      paddingLeft: spacing.xxl,
    },
    botRow: {
      justifyContent: 'flex-start',
      paddingRight: spacing.xxl,
    },
    botAvatar: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    messageBubble: {
      maxWidth: '85%',
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      borderRadius: radius.lg,
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: radius.xs,
    },
    botBubble: {
      backgroundColor: colors.surface,
      borderBottomLeftRadius: radius.xs,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    messageText: {
      lineHeight: 20,
    },
    userMessageText: {
      color: colors.white,
    },
    botMessageText: {
      color: colors.textPrimary,
    },
    messageTime: {
      fontSize: typography.tabLabel.fontSize,
      marginTop: spacing.xs,
      alignSelf: 'flex-end',
    },
    userTime: {
      color: 'rgba(255, 255, 255, 0.75)',
    },
    botTime: {
      color: colors.textTertiary,
    },
    typingIndicatorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginLeft: spacing.base,
      marginBottom: spacing.xs,
    },
    typingText: {
      fontStyle: 'italic',
    },
    suggestionsWrapper: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      paddingVertical: spacing.sm,
    },
    suggestionsTitle: {
      paddingHorizontal: spacing.base,
      marginBottom: spacing.xs,
    },
    suggestionsScroll: {
      paddingHorizontal: spacing.base,
      gap: spacing.sm,
    },
    suggestionChip: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
    },
    composerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: spacing.sm,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 100,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.sm,
      fontSize: typography.body2.fontSize,
      fontFamily: theme.fonts.regular,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.45,
    },
  });
};
