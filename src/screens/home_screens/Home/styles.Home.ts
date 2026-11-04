// src/screens/Home/styles.Home.ts
import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../theme';

export const createHomeStyles = (theme: AppTheme) => {
  const { spacing, radius, colors } = theme;

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
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },

    notificationBadge: {
      borderRadius: 8,
      fontSize: 14,
      color: theme.colors.textInverse,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
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
      fontSize: 14,
      fontWeight: 'bold',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.full,
      borderWidth: 1.5,
      borderColor: colors.white,
    },
    notificationEmoji: {
      fontSize: 20,
    },
    notificationDescription: {
      opacity: 0.8,
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
      gap: 4,
    },
    streakEmoji: {
      fontSize: 14,
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
      shadowColor: colors.black,
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
      fontSize: 24,
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
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    // Tab switcher
    tabRow: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.lg,
      padding: 4,
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
      shadowColor: colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
    },
    // Bar chart
    chartArea: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: 110,
      marginBottom: spacing.md,
      marginTop: spacing.sm,
    },
    barWrapper: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
    },
    bar: {
      width: 20,
      borderRadius: radius.full,
    },
    barMuted: {
      opacity: 0.65,
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
      shadowColor: colors.black,
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
      fontSize: 24,
    },
  });
};
