// src/screens/Home/styles.Home.ts
import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createHomeStyles = (theme: AppTheme) => {
  const { spacing, radius, colors, fonts } = theme;

  return StyleSheet.create({
    // ── Root ──────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scroll: {
      flexGrow: 1,
      paddingBottom: spacing.xxxl,
    },

    // ── Header ────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      backgroundColor: colors.background,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    bellButton: {
      position: 'relative',
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },

    notificationBadge: {
      borderRadius: 8,
      fontSize: theme.typography.body2.fontSize,
      color: theme.colors.textInverse,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },

    // ── Notification Banner ───────────────────────
    notifBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.xl,
      marginTop: spacing.md,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      backgroundColor: colors.primary,
      gap: spacing.md,
    },
    notifBannerText: {
      flex: 1,
    },
    notifEnableBtn: {
      borderColor: colors.white,
    },
    notifEnableBtnText: {
      backgroundColor: colors.white,
      color: colors.primary,
      fontSize: theme.typography.buttonSm.fontSize,
      fontFamily: fonts.bold,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.full,
      borderWidth: 1.5,
      borderColor: colors.white,
    },
    notificationEmoji: {
      fontSize: theme.typography.h3.fontSize,
    },
    notificationDescription: {
      opacity: 0.8,
    },
    healthConnectCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      marginHorizontal: spacing.xl,
      marginTop: spacing.md,
      padding: spacing.base,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
      backgroundColor: colors.surface,
      elevation: 1,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    healthConnectIcon: {
      width: 46,
      height: 46,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
    },
    healthConnectCopy: {
      flex: 1,
      gap: spacing.xs,
    },
    healthConnectAction: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      marginTop: spacing.xxs,
      paddingVertical: spacing.xs,
      paddingRight: spacing.xs,
    },

    // ── Energy Card ───────────────────────────────
    energyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.xl,
      marginTop: spacing.md,
      borderRadius: radius.xl,
      padding: spacing.base,
      gap: spacing.base,
      backgroundColor: colors.primaryDark,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    energyStatus: {
      flex: 1,
      minHeight: 84,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    energyLoading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: spacing.base,
      paddingHorizontal: spacing.base,
    },
    energyLoadingCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      flexShrink: 0,
    },
    energyLoadingText: {
      flex: 1,
      gap: spacing.md,
    },
    energyLoadingLine: {
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.whiteOverlay17,
    },
    energyLoadingLineTitle: {
      width: '68%',
    },
    energyLoadingLineDescription: {
      width: '92%',
    },
    energyLoadingLineFootnote: {
      width: '52%',
    },
    energyCircle: {
      width: 84,
      height: 84,
      borderRadius: 42,
      borderWidth: 3,
      borderColor: colors.whiteOverlay65,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.whiteOverlay12,
      flexShrink: 0,
    },
    energyLabel: {
      opacity: 0.75,
      letterSpacing: 1,
    },
    energyDescription: {
      opacity: 0.8,
      lineHeight: 18,
    },
    energyRight: {
      flex: 1,
    },
    streakPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xxs + 2,
      borderRadius: radius.full,
      backgroundColor: colors.whiteOverlay18,
      gap: spacing.xs,
    },
    streakEmoji: {
      fontSize: theme.typography.body2.fontSize,
    },

    // ── Today's Summary card ───────────────────────
    // summaryCard: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   marginHorizontal: spacing.xl,
    //   borderRadius: radius.lg,
    //   padding: spacing.base,
    //   backgroundColor: colors.surface,
    //   gap: spacing.md,
    //   elevation: 1,
    //   shadowOpacity: 0.05,
    //   shadowRadius: 6,
    //   shadowOffset: { width: 0, height: 2 },
    // },
    // summaryIconBox: {
    //   width: 44,
    //   height: 44,
    //   borderRadius: radius.md,
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    // summaryEmoji: {
    //   fontSize: 24,
    // },
    // summaryText: {
    //   flex: 1,
    // },

    // ── Workout Categories ─────────────────────────
    workoutList: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xs,
      gap: spacing.md,
    },
    workoutCard: {
      width: 120,
      borderRadius: radius.lg,
      padding: spacing.md,
      backgroundColor: colors.surface,
      alignItems: 'flex-start',
      elevation: 1,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      borderBottomWidth: 4,
    },
    workoutIconBox: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    workoutEmoji: {
      fontSize: theme.typography.statValue.fontSize,
    },
    workoutAccentBar: {
      position: 'absolute',
      bottom: 0,
      left: 5,
      right: 5,
      height: 3,
      borderBottomLeftRadius: radius.lg,
      borderBottomRightRadius: radius.lg,
    },

    // ── Activity Trends ────────────────────────────
    trendsCard: {
      marginHorizontal: spacing.xl,
      borderRadius: radius.xl,
      padding: spacing.base,
      backgroundColor: colors.surface,
      elevation: 1,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    // Tab switcher
    tabRow: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.lg,
      padding: spacing.xs,
      marginBottom: spacing.base,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: spacing.sm - 2,
      alignItems: 'center',
      borderRadius: radius.md,
    },
    tabBtnActive: {
      backgroundColor: colors.surface,
      elevation: 2,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
    },
    // Selected day readout
    selectedReadoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
      marginBottom: spacing.xs,
      minHeight: 28,
    },
    selectedReadoutLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    selectedIndicatorDot: {
      width: 7,
      height: 7,
      borderRadius: radius.full,
    },
    selectedPill: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.full,
      borderWidth: 1,
    },
    // Bar chart
    chartArea: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: 125,
      marginBottom: spacing.md,
      marginTop: spacing.xs,
    },
    barWrapper: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.s,
    },
    barTouchableColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%',
      paddingBottom: 2,
    },
    bar: {
      width: 20,
      borderRadius: radius.full,
    },
    barMuted: {
      opacity: 0.45,
    },
    barSelected: {
      opacity: 1,
      borderWidth: 1.5,
      borderColor: colors.surface,
      elevation: 4,
      shadowOpacity: 0.35,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    barTooltip: {
      position: 'absolute',
      top: 0,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: radius.md,
      borderWidth: 1,
      zIndex: 10,
      elevation: 3,
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
    },
    barTooltipText: {
      fontSize: 10,
      lineHeight: 12,
    },
    // Stats row
    statsRow: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: spacing.md,
      gap: spacing.xs,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.divider,
    },
    quickActionsRow: {
      flexDirection: 'row',
      marginHorizontal: spacing.xl,
      gap: spacing.md,
    },
    quickActionCard: {
      flex: 1,
      borderRadius: radius.xl,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      gap: spacing.sm,
      elevation: 1,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    quickActionIconBox: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionEmoji: {
      fontSize: theme.typography.statValue.fontSize,
    },
  });
};
