import { StyleSheet } from 'react-native';

const createStyles = (colors: any, spacing: any, radius: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },

    header: {
      minHeight: 70,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: spacing.sm,
    },

    backButton: {
      width: 38,
      height: 38,
      borderRadius: radius.full,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerText: {
      flex: 1,
      minWidth: 0,
    },

    headerIconButton: {
      width: 36,
      height: 36,
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

    screenContent: {
      paddingHorizontal: spacing.base,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
      flexGrow: 1,
    },

    groupBanner: {
      minHeight: 120,
      backgroundColor: colors.primary,
      borderRadius: radius.xl,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.md,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: colors.primaryDark,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },

    bannerIcon: {
      width: 64,
      height: 64,
      borderRadius: radius.lg,
      backgroundColor: 'rgba(255,255,255,0.20)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    bannerEmoji: {
      fontSize: 30,
    },

    bannerDetails: {
      flex: 1,
      minWidth: 0,
    },

    bannerAvatars: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },

    bannerAvatar: {
      width: 25,
      height: 25,
      borderRadius: radius.full,
      borderWidth: 1.5,
      borderColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -5,
    },

    bannerMore: {
      width: 25,
      height: 25,
      borderRadius: radius.full,
      borderWidth: 1.5,
      borderColor: colors.surface,
      backgroundColor: colors.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 2,
    },

    settingsButton: {
      width: 34,
      height: 34,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.20)',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },

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

    goalCard: {
      minHeight: 132,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },

    goalRing: {
      width: 86,
      height: 86,
      borderRadius: radius.full,
      borderWidth: 7,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderLeftColor: colors.surfaceElevated,
      transform: [{ rotate: '-30deg' }],
    },

    goalRingInner: {
      alignItems: 'center',
      transform: [{ rotate: '30deg' }],
    },

    goalInfo: {
      flex: 1,
      minWidth: 0,
    },

    goalNumbers: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: spacing.xxs,
    },

    section: {
      marginBottom: spacing.lg,
    },

    sectionHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },

    weekBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radius.full,
    },

    chartCard: {
      height: 150,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },

    chartBars: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },

    chartColumn: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: spacing.xxs,
    },

    chartBar: {
      width: '65%',
      minHeight: 8,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
    },

    chartDay: {
      marginTop: spacing.xs,
      marginBottom: spacing.xxs,
    },

    contributorsCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },

    memberRow: {
      minHeight: 61,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },

    currentMemberRow: {
      backgroundColor: colors.primaryLight,
    },

    rankBadge: {
      width: 26,
      height: 26,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },

    firstRankBadge: {
      backgroundColor: colors.warningLight,
    },

    thirdRankBadge: {
      backgroundColor: colors.infoLight,
    },

    memberAvatar: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },

    memberInfo: {
      flex: 1,
      minWidth: 0,
    },

    memberSteps: {
      alignItems: 'flex-end',
      minWidth: 65,
    },

    leaderboardIntro: {
      marginBottom: spacing.md,
    },

    challengeCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderLeftWidth: 4,
      padding: spacing.md,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
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
      gap: spacing.xs,
    },

    challengeEmoji: {
      fontSize: 16,
    },

    challengeTitle: {
      flexShrink: 1,
    },

    challengeStatus: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      backgroundColor: colors.errorLight,
      borderRadius: radius.full,
    },

    challengeDescription: {
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
    },

    progressTrack: {
      height: 7,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceElevated,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      borderRadius: radius.full,
    },

    challengeFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
    },

    newChallengeButton: {
      minHeight: 46,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

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

    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },

    modalKeyboardContainer: {
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

    modalInput: {
      minHeight: 44,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      color: colors.textPrimary,
      fontSize: 14,
      marginTop: spacing.xs,
      marginBottom: spacing.md,
    },

    modalOptionsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.md,
    },

    modalOption: {
      flex: 1,
    },

    selectOption: {
      minHeight: 44,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      marginTop: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    submitChallengeButton: {
      minHeight: 48,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
  });

export default createStyles;
