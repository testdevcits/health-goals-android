import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';

export const createWorkoutSessionStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      padding: spacing.base,
      paddingBottom: spacing.md,
    },
    activitySelector: {
      alignItems: 'center',
      gap: spacing.sm,
      paddingBottom: spacing.base,
    },
    activityChip: {
      width: 36,
      height: 36,
      borderWidth: 1,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedChip: {
      elevation: 2,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    activityEmoji: {
      fontSize: 17,
      lineHeight: 23,
    },
    workoutHero: {
      minHeight: 257,
      borderRadius: radius.xl,
      padding: spacing.base,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      elevation: 5,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 9 },
      shadowOpacity: 0.18,
      shadowRadius: 13,
    },
    heroEmoji: {
      fontSize: 40,
      lineHeight: 49,
    },
    heroActivityName: {
      letterSpacing: 0.3,
      marginTop: spacing.xs,
      color: colors.white,
    },
    heartbeat: {
      height: 38,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
    },
    heartbeatLine: {
      flex: 0.23,
      height: 2,
      backgroundColor: colors.white,
      opacity: 0.65,
    },
    heartbeatPeakOne: {
      width: 24,
      height: 20,
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderColor: colors.white,
      opacity: 0.7,
      transform: [{ skewY: '-28deg' }],
      marginTop: -7,
    },
    heartbeatPeakTwo: {
      width: 24,
      height: 23,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderColor: colors.white,
      opacity: 0.7,
      transform: [{ skewY: '28deg' }],
      marginTop: 8,
    },
    heartbeatLineEnd: {
      flex: 0.77,
      height: 2,
      backgroundColor: colors.white,
      opacity: 0.65,
    },
    timer: {
      color: colors.white,
      fontSize: 42,
      lineHeight: 50,
      fontWeight: '700',
      letterSpacing: 1,
      fontVariant: ['tabular-nums'],
    },
    timerStatus: {
      color: colors.white,
      marginTop: spacing.xs,
      fontWeight: '500',
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      marginTop: spacing.base,
    },
    metricCard: {
      width: '48%',
      flexGrow: 1,
      flexBasis: '40%',
      minHeight: 120,
      padding: spacing.md,
      borderRadius: radius.lg,
      justifyContent: 'center',
      elevation: 2,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.04,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 3 },
    },
    metricIcon: {
      width: 38,
      height: 38,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    metricEmoji: {
      fontSize: 21,
      lineHeight: 27,
    },
    metricValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: spacing.xs,
    },
    startButton: {
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
    },
    startButtonText: {
      color: colors.white,
    },
    modalActionButton: {
      marginTop: spacing.sm,
    },
    destructiveActionButton: {
      backgroundColor: colors.error,
    },
    finishButton: {
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
  });

export default createWorkoutSessionStyles;
