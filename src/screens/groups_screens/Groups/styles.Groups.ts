import { StyleSheet } from "react-native";

const createStyles = (
    colors: any,
    spacing: any,
    radius: any,
) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.backgroundSecondary,
        },

        header: {
            minHeight: 76,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.sm,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
        },

        headerText: {
            flex: 1,
            minWidth: 0,
            paddingRight: spacing.xs,
        },

        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },

        notificationButton: {
            width: 38,
            height: 38,
            borderRadius: radius.full,
            backgroundColor: colors.backgroundSecondary,
            alignItems: 'center',
            justifyContent: 'center',
        },

        profileAvatar: {
            width: 38,
            height: 38,
            borderRadius: radius.full,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
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
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
        },

        scrollContent: {
            flexGrow: 1,
            paddingBottom: spacing.xl,
        },

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
            shadowColor: '#000',
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
            width: 19,
            height: 19,
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: colors.surface,
            marginRight: -3,
        },

        memberAvatarText: {
            fontSize: 9,
            lineHeight: 12,
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

        feedList: {
            paddingHorizontal: spacing.base,
        },

        feedCard: {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
            elevation: 2,
            shadowColor: '#000',
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

        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.48)',
            justifyContent: 'flex-end',
        },

        modalKeyboardContainer: {
            width: '100%',
            justifyContent: 'flex-end',
        },

        bottomSheet: {
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.xxl,
            borderTopRightRadius: radius.xxl,
            paddingHorizontal: spacing.base,
            paddingTop: spacing.sm,
        },

        sheetHandle: {
            width: 40,
            height: 4,
            borderRadius: radius.full,
            backgroundColor: colors.border,
            alignSelf: 'center',
            marginBottom: spacing.md,
        },

        sheetHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.md,
        },

        closeButton: {
            width: 34,
            height: 34,
            borderRadius: radius.full,
            backgroundColor: colors.backgroundSecondary,
            alignItems: 'center',
            justifyContent: 'center',
        },

        fieldLabel: {
            marginBottom: spacing.xs,
        },

        nameInput: {
            height: 44,
            borderRadius: radius.md,
            backgroundColor: colors.inputBg,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            paddingHorizontal: spacing.md,
            color: colors.textPrimary,
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            marginBottom: spacing.md,
        },

        iconGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
            marginBottom: spacing.md,
        },

        iconOption: {
            width: 44,
            height: 44,
            borderRadius: radius.md,
            backgroundColor: colors.backgroundSecondary,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: 'transparent',
        },

        selectedIconOption: {
            borderColor: colors.primary,
            backgroundColor: colors.primaryLight,
        },

        iconEmoji: {
            fontSize: 22,
        },

        privateRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            marginTop: spacing.xs,
            marginBottom: spacing.md,
        },

        lockIcon: {
            width: 34,
            height: 34,
            borderRadius: radius.md,
            backgroundColor: colors.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
        },

        privateText: {
            flex: 1,
        },

        submitButton: {
            minHeight: 48,
            borderRadius: radius.md,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing.xs,
        },
    });

export default createStyles