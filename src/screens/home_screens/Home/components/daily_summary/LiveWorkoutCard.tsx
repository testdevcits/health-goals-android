import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../assets/appicon/AppIcon';
import { useTheme } from '../../../../../theme/useTheme';
import {
  getElapsedMilliseconds,
  getWorkoutSession,
  subscribeToWorkoutSession,
  type WorkoutSession,
} from '../../../workout_sessions/workoutSessionStore';
import { getWorkoutActivity } from '../../../workout_sessions/workoutActivities';
import { createDailySummaryStyles } from './styles.DailySummary';

interface LiveWorkoutCardProps {
  navigation: any;
}

export const LiveWorkoutCard: React.FC<LiveWorkoutCardProps> = memo(
  ({ navigation }) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const styles = React.useMemo(
      () => createDailySummaryStyles(theme),
      [theme],
    );

    const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(
      null,
    );
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
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

    useEffect(() => {
      if (!workoutSession || workoutSession.startedAtMilliseconds === null) {
        return;
      }

      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }, [workoutSession]);

    const activity = workoutSession
      ? getWorkoutActivity(workoutSession.activityId)
      : null;
    const isRunning =
      workoutSession !== null && workoutSession.startedAtMilliseconds !== null;
    const elapsedSeconds = workoutSession
      ? Math.floor(getElapsedMilliseconds(workoutSession, now) / 1000)
      : 0;

    // Outdoor distance & calories:
    // If it's an outdoor activity and stored GPS distance is available, use it.
    // If phone is stationary (distance = 0), calories and distance must strictly be 0.
    const distanceKm = (() => {
      if (!activity) return '0.00';
      if (activity.isOutdoor) {
        const meters = workoutSession?.distanceMeters ?? 0;
        return (meters / 1000).toFixed(2);
      }
      return ((activity.speedKmh * elapsedSeconds) / 3600).toFixed(2);
    })();

    const workoutCalories = (() => {
      if (!activity) return 0;
      if (activity.isOutdoor) {
        if (workoutSession?.calories !== undefined) {
          return workoutSession.calories;
        }
        const distNum = parseFloat(distanceKm);
        if (distNum <= 0 || activity.speedKmh <= 0) {
          return 0; // Device not moving -> 0 kcal!
        }
        const movingMinutes = (distNum / activity.speedKmh) * 60;
        return Math.floor(movingMinutes * activity.caloriesPerMinute);
      }
      return Math.floor((elapsedSeconds / 60) * activity.caloriesPerMinute);
    })();
    const workoutStatus = !workoutSession
      ? 'Start workout'
      : isRunning
      ? 'In progress'
      : 'Paused';

    return (
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
            <ActivityIndicator size="small" />
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
    );
  },
);

export default LiveWorkoutCard;
