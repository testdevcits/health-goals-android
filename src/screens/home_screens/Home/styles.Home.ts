// src/screens/Home/styles.Home.ts
import { StyleSheet, Dimensions } from 'react-native';
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
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.full,
      borderWidth: 1.5,
      borderColor: colors.white,
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
    energyCircle: {
      width: 84,
      height: 84,
      borderRadius: 42,
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.65)',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.12)',
      flexShrink: 0,
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
      backgroundColor: 'rgba(255,255,255,0.18)',
      gap: 4,
    },

    // ── Section headers ───────────────────────────
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: spacing.xl,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },

    // ── Today's Summary card ───────────────────────
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.xl,
      borderRadius: radius.lg,
      padding: spacing.base,
      backgroundColor: colors.surface,
      gap: spacing.md,
      elevation: 1,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    summaryIconBox: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: '#FFE8E8',
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryText: {
      flex: 1,
    },

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
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    workoutIconBox: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    workoutAccentBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
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
      shadowColor: '#000',
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
      shadowColor: '#000',
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
    },
    barWrapper: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
    },
    bar: {
      width: 16,
      borderRadius: radius.sm,
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

    // ── Quick Actions ──────────────────────────────
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
      shadowColor: '#000',
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
  });
};
