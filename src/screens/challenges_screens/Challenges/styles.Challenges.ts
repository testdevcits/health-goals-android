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
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.sm,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
        },

        headerText: {
            flex: 1,
            paddingRight: spacing.sm,
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

        scrollContent: {
            flexGrow: 1,
        },

        tabs: {
            flexDirection: 'row',
            marginHorizontal: spacing.base,
            marginTop: spacing.base,
            marginBottom: spacing.md,
            padding: spacing.xs,
            borderRadius: radius.lg,
            backgroundColor: colors.surfaceElevated,
        },

        tab: {
            flex: 1,
            minHeight: 38,
            borderRadius: radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: spacing.xs,
        },

        activeTab: {
            backgroundColor: colors.surface,
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
        },

        content: {
            paddingHorizontal: spacing.base,
            paddingTop: spacing.xs,
        },

        podium: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginBottom: spacing.base,
            paddingTop: spacing.md,
        },

        podiumPerson: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
        },

        firstPlacePerson: {
            paddingHorizontal: spacing.xs,
        },

        podiumAvatar: {
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: colors.surface,
            marginBottom: spacing.xs,
            elevation: 3,
        },

        podiumBase: {
            width: '100%',
            borderTopLeftRadius: radius.md,
            borderTopRightRadius: radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing.xs,
        },

        leaderboardCard: {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            overflow: 'hidden',
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
        },

        leaderboardRow: {
            minHeight: 60,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
            gap: spacing.sm,
        },

        currentUserRow: {
            backgroundColor: colors.primaryLight,
        },

        lastLeaderboardRow: {
            borderBottomWidth: 0,
        },

        rankCircle: {
            width: 25,
            height: 25,
            borderRadius: radius.full,
            backgroundColor: colors.backgroundSecondary,
            alignItems: 'center',
            justifyContent: 'center',
        },

        smallAvatar: {
            width: 34,
            height: 34,
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center',
        },

        leaderboardDetails: {
            flex: 1,
            minWidth: 0,
        },

        stepsColumn: {
            alignItems: 'flex-end',
            minWidth: 58,
        },

        challengeCard: {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderLeftWidth: 4,
            padding: spacing.md,
            marginBottom: spacing.md,
            gap: spacing.sm,
            elevation: 1,
            shadowColor: '#000',
            shadowOpacity: 0.035,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
        },

        challengeHeading: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.xs,
        },

        challengeTitleRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },

        challengeTitle: {
            flexShrink: 1,
        },

        statusPill: {
            borderRadius: radius.full,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xxs,
        },

        progressTrack: {
            height: 7,
            backgroundColor: colors.surfaceElevated,
            borderRadius: radius.full,
            overflow: 'hidden',
            marginTop: spacing.xs,
        },

        progressFill: {
            height: '100%',
            borderRadius: radius.full,
        },

        progressFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },

        browseButton: {
            minHeight: 46,
            borderRadius: radius.lg,
            borderWidth: 1.5,
            borderColor: colors.primary,
            borderStyle: 'dashed',
            backgroundColor: colors.primaryLight,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            marginTop: spacing.xs,
        },

        badgesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
        },

        badgeCard: {
            minHeight: 118,
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.xs,
            paddingVertical: spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 1,
            shadowColor: '#000',
            shadowOpacity: 0.035,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
        },

        badgeIcon: {
            width: 48,
            height: 48,
            borderRadius: radius.full,
            backgroundColor: '#FFF1C7',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
        },

        lockedBadge: {
            opacity: 0.55,
        },

        lockedBadgeIcon: {
            backgroundColor: colors.surfaceElevated,
        },

        badgeTitle: {
            marginBottom: spacing.xxs,
        },
    });

export default createStyles