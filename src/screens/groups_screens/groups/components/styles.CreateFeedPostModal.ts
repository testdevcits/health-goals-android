import { StyleSheet } from 'react-native';
import { fonts } from '../../../../theme/fonts';

export const createFeedPostModalStyles = (
  colors: any,
  spacing: any,
  radius: any,
) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },

    keyboardContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'flex-end',
    },

    bottomSheet: {
      maxHeight: '92%',
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 20,
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.base,
    },

    sheetHandle: {
      width: 44,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: spacing.md,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },

    headerTitleCol: {
      flex: 1,
    },

    headerSubtitle: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },

    closeButton: {
      width: 34,
      height: 34,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    sectionLabel: {
      fontFamily: fonts.semiBold,
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      marginTop: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Group Picker
    groupSelectorRow: {
      flexDirection: 'row',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },

    groupChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1.5,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },

    groupChipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },

    groupChipText: {
      fontFamily: fonts.medium,
      fontSize: 13,
      color: colors.textSecondary,
    },

    groupChipTextSelected: {
      fontFamily: fonts.semiBold,
      color: colors.primary,
    },

    // Emoji Picker
    emojiRow: {
      flexDirection: 'row',
      gap: spacing.xs,
      marginBottom: spacing.sm,
      paddingVertical: spacing.xs,
    },

    emojiChip: {
      width: 42,
      height: 42,
      borderRadius: radius.md,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
    },

    emojiChipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
      transform: [{ scale: 1.08 }],
    },

    emojiText: {
      fontSize: 20,
    },

    // Message Input
    messageInputContainer: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.lg,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.xs,
    },

    messageInput: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.textPrimary,
      minHeight: 88,
      textAlignVertical: 'top',
      padding: 0,
    },

    charCounterRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: spacing.xs,
    },

    charCounterText: {
      fontFamily: fonts.regular,
      fontSize: 11,
      color: colors.textTertiary,
    },

    // Activity Attachment Card
    activityCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.backgroundSecondary,
      padding: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.sm,
    },

    activityCardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },

    activityLeftRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },

    activityIconContainer: {
      width: 38,
      height: 38,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },

    activityValueText: {
      fontFamily: fonts.bold,
      fontSize: 15,
      color: colors.textPrimary,
    },

    activitySubtitle: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: colors.textSecondary,
    },

    activityRemoveBtn: {
      padding: spacing.xs,
    },

    // Media Preview Card
    mediaPreviewContainer: {
      position: 'relative',
      borderRadius: radius.lg,
      overflow: 'hidden',
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
    },

    mediaPreviewImage: {
      width: '100%',
      height: 160,
      borderRadius: radius.lg,
    },

    mediaGalleryCard: {
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: colors.surface,
      marginBottom: spacing.xs,
    },

    mediaChangeBtn: {
      position: 'absolute',
      bottom: spacing.xs,
      right: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: radius.full,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },

    mediaChangeBtnText: {
      fontFamily: fonts.medium,
      fontSize: 11,
      color: '#FFFFFF',
    },

    cancelUrlBtn: {
      padding: spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },

    orUrlButton: {
      paddingVertical: spacing.xs,
      alignItems: 'center',
      marginBottom: spacing.xs,
    },

    orUrlText: {
      fontFamily: fonts.medium,
      fontSize: 12,
      color: colors.textSecondary,
    },

    mediaRemoveBtn: {
      position: 'absolute',
      top: spacing.xs,
      right: spacing.xs,
      width: 28,
      height: 28,
      borderRadius: radius.full,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    mediaInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },

    mediaUrlInput: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },

    addMediaBtn: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    addMediaBtnText: {
      fontFamily: fonts.semiBold,
      fontSize: 12,
      color: colors.primary,
    },

    // Visibility Selector
    visibilityRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },

    visibilityChip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      borderRadius: radius.md,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1.5,
      borderColor: colors.border,
    },

    visibilityChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },

    visibilityText: {
      fontFamily: fonts.medium,
      fontSize: 12,
      color: colors.textSecondary,
    },

    visibilityTextActive: {
      fontFamily: fonts.semiBold,
      color: colors.primary,
    },

    // Actions
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },

    cancelButton: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cancelButtonText: {
      fontFamily: fonts.semiBold,
      fontSize: 14,
      color: colors.textSecondary,
    },

    submitButton: {
      flex: 2,
    },
  });

export default createFeedPostModalStyles;
