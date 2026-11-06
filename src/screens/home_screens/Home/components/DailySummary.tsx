// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { ChevronRight } from 'lucide-react-native';
// import { AppText, SectionHeader } from '../../../../components';
// import { useTheme } from '../../../../theme/useTheme';
// // import { createHomeStyles } from '../styles.Home';

// const DailySummary: React.FC<{ onViewDetails: () => void }> = ({
//   onViewDetails,
// }) => {
//   const { theme } = useTheme();
//   // const styles = createHomeStyles(theme);

//   return (
//     <>
//       <SectionHeader
//         sectionTitle="Today's Summary"
//         rightText="View Details"
//         onRightPress={onViewDetails}
//       />
//       <TouchableOpacity
//         onPress={onViewDetails}
//         activeOpacity={0.85}
//         style={styles.summaryCard}
//         accessibilityRole="button"
//         accessibilityLabel="Daily activity: 2,038 steps and 21 active minutes"
//       >
//         <View style={styles.summaryIconBox}>
//           <Text style={styles.summaryEmoji}>❤️</Text>
//         </View>
//         <View style={styles.summaryText}>
//           <AppText variant="subtitle2" bold mb={2}>
//             Daily Activity
//           </AppText>
//           <AppText variant="caption" secondary>
//             2,038 steps · 21 active mins
//           </AppText>
//         </View>
//         <ChevronRight size={18} color={theme.colors.textTertiary} />
//       </TouchableOpacity>
//     </>
//   );
// };

// export default DailySummary;
// const { theme } = useTheme();

// const { spacing, radius, colors } = theme;
// const styles = StyleSheet.create({
//   // ── Today's Summary card ───────────────────────
//   summaryCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: spacing.xl,
//     borderRadius: radius.lg,
//     padding: spacing.base,
//     backgroundColor: colors.surface,
//     gap: spacing.md,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   summaryIconBox: {
//     width: 44,
//     height: 44,
//     borderRadius: radius.md,
//     backgroundColor: '#FFE8E8',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   summaryEmoji: {
//     fontSize: 24,
//   },
//   summaryText: {
//     flex: 1,
//   },
// });

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText, SectionHeader } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import {
  getElapsedMilliseconds,
  getWorkoutSession,
  subscribeToWorkoutSession,
  type WorkoutSession,
} from '../../workout_sessions/workoutSessionStore';
import { getWorkoutActivity } from '../../workout_sessions/workoutActivities';
import { useTodayHealthData } from '../../../../hooks/useTodayHealthData';
import AppIcon from '../../../../assets/appicon/AppIcon';

const DailySummary: React.FC<{
  onViewDetails: () => void;
  navigation: any;
}> = ({ onViewDetails, navigation }) => {
  const { theme } = useTheme();
  const { spacing, radius, colors } = theme;
  const healthDataState = useTodayHealthData();
  const healthData = healthDataState.data;

  const [workoutSession, setWorkoutSession] =
    React.useState<WorkoutSession | null>(null);
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    let mounted = true;
    const refreshSession = () => {
      getWorkoutSession()
        .then(session => {
          if (mounted) {
            setWorkoutSession(session);
          }
        })
        .catch(error => {
          Alert.alert(
            'Workout session unavailable',
            error instanceof Error ? error.message : String(error),
          );
        });
    };

    const unsubscribe = subscribeToWorkoutSession(refreshSession);
    refreshSession();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (!workoutSession || workoutSession.startedAtMilliseconds === null) {
      return;
    }

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [workoutSession]);

  const styles = StyleSheet.create({
    summaryContainer: {
      marginHorizontal: spacing.xl,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    summaryCard: {
      flex: 1,
      minHeight: 135,
      padding: spacing.base,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    runningHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    metricRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: spacing.xs,
    },
    bottomIcon: {
      position: 'absolute',
      right: spacing.base,
      bottom: spacing.base,
    },
    playButton: {
      position: 'absolute',
      right: spacing.base,
      bottom: spacing.base,
      width: 24,
      height: 24,
      borderRadius: 17,
      backgroundColor: colors.coral,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const activity = workoutSession
    ? getWorkoutActivity(workoutSession.activityId)
    : null;
  const isRunning =
    workoutSession !== null && workoutSession.startedAtMilliseconds !== null;
  const elapsedSeconds = workoutSession
    ? Math.floor(getElapsedMilliseconds(workoutSession, now) / 1000)
    : 0;
  const workoutCalories = activity
    ? Math.floor((elapsedSeconds / 60) * activity.caloriesPerMinute)
    : 0;
  const distanceKm = activity
    ? ((activity.speedKmh * elapsedSeconds) / 3600).toFixed(2)
    : '0.00';
  const workoutStatus = !workoutSession
    ? 'Start workout'
    : isRunning
    ? 'In progress'
    : 'Paused';

  return (
    <View style={styles.summaryContainer}>
      <SectionHeader
        sectionTitle="Today's Summary"
        rightText="View Details"
        onRightPress={onViewDetails}
        customStyles={{ marginHorizontal: 0 }}
      />

      <View style={styles.summaryRow}>
        {/* Daily Activity */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={onViewDetails}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Daily activity, ${
            healthData?.steps?.toLocaleString('en-US') ?? 'unavailable'
          } steps, ${
            healthData?.exerciseMinutes ?? 'unavailable'
          } active minutes`}
        >
          <AppText variant="subtitle2" bold>
            Daily Activity
          </AppText>

          <View style={styles.metricRow}>
            <AppText variant="body2" bold>
              {healthDataState.loading
                ? '…'
                : healthData?.steps?.toLocaleString('en-US') ?? '—'}
            </AppText>
            <AppText variant="caption" secondary>
              {' '}
              steps
            </AppText>
          </View>

          <AppText variant="caption" secondary>
            {healthDataState.loading
              ? 'Loading health data…'
              : healthData?.status === 'permission-required'
              ? 'Connect Health Connect in Profile'
              : healthDataState.error
              ? healthDataState.error
              : healthData?.exerciseMinutes === null ||
                healthData?.exerciseMinutes === undefined
              ? 'Exercise data unavailable'
              : `${Math.round(healthData?.exerciseMinutes ?? 0)} active mins`}
          </AppText>

          <View style={styles.bottomIcon}>
            <AppIcon
              name="Heart"
              size={20}
              color={colors.coral}
              fill={colors.coral}
            />
          </View>
        </TouchableOpacity>

        {/* Running Activity */}
        <TouchableOpacity
          activeOpacity={0.85}
          accessibilityRole="button"
          onPress={() => navigation.navigate('WorkoutSession')}
          style={styles.summaryCard}
          accessibilityLabel={`${workoutStatus}: ${workoutCalories} kcal, ${distanceKm} kilometers${
            activity ? `, ${activity.name}` : ''
          }`}
        >
          <View style={styles.runningHeader}>
            <AppText variant="subtitle2" secondary>
              {workoutStatus}
            </AppText>
            {workoutStatus === 'In progress' ? (
              <ActivityIndicator size={'small'} />
            ) : (
              <AppIcon name="Footprints" size={16} color={colors.warning} />
            )}
          </View>

          <View style={styles.metricRow}>
            <AppText variant="body2" bold>
              {workoutCalories}
            </AppText>
            <AppText variant="caption" secondary>
              {' '}
              kcal
            </AppText>
          </View>

          <AppText variant="caption" secondary>
            {activity
              ? `${distanceKm} km · ${activity.name}`
              : 'Tap to start a workout'}
          </AppText>

          <View style={styles.playButton} accessible={false}>
            {workoutStatus === 'In progress' ? (
              <AppIcon
                name="Pause"
                size={14}
                color={colors.white}
                fill={colors.white}
              />
            ) : (
              <AppIcon
                name="Play"
                size={14}
                color={colors.white}
                fill={colors.white}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DailySummary;
