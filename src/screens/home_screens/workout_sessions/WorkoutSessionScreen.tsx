import React, { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {
  AppButton,
  AppHeader,
  AppText,
  ConfirmationModal,
} from '../../../components';
import { createWorkoutSessionStyles } from './styles.WorkoutSession';
import { useTheme } from '../../../theme/useTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
import HeartbeatAnimation from './components/HeartbeatAnimation';
import {
  clearWorkoutSession,
  getElapsedMilliseconds,
  getWorkoutSession,
  pauseWorkoutSession,
  resumeWorkoutSession,
  startWorkoutSession,
  subscribeToWorkoutSession,
  type WorkoutSession,
} from './workoutSessionStore';
import { WORKOUT_ACTIVITIES } from './workoutActivities';
import { authenticatedRequest } from '../../../services/authenticatedApi';

type Activity = (typeof WORKOUT_ACTIVITIES)[number] & { color: string };

interface WorkoutConfirmation {
  title: string;
  message: string;
  actions: {
    label: string;
    variant?: 'primary' | 'outline';
    destructive?: boolean;
    onPress?: () => void | Promise<void>;
  }[];
}

const generateActivityColor = (seed: number) => {
  const hue = (seed * 47 + Math.floor(Math.random() * 60)) % 360;
  const saturation = 72;
  const lightness = 58;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

const activities: Activity[] = WORKOUT_ACTIVITIES.map((activity, index) => ({
  ...activity,
  color: generateActivityColor(index + 1),
}));

type Props = NativeStackScreenProps<HomeStackParamList, 'WorkoutSession'>;

interface MetricCardProps {
  emoji: string;
  value: string;
  unit?: string;
  label: string;
  tint: string;
  backgroundColor: string;
  styles: ReturnType<typeof createWorkoutSessionStyles>;
}

const MetricCard = React.memo(
  ({
    emoji,
    value,
    unit,
    label,
    tint,
    backgroundColor,
    styles,
  }: MetricCardProps) => (
    <View style={[styles.metricCard, { backgroundColor }]}>
      <View style={[styles.metricIcon, { backgroundColor: tint }]}>
        <AppText style={styles.metricEmoji}>{emoji}</AppText>
      </View>

      <View style={styles.metricValueRow}>
        <AppText variant="h3">{value}</AppText>
        {unit ? (
          <AppText variant="caption" color="textSecondary">
            {unit}
          </AppText>
        ) : null}
      </View>

      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
    </View>
  ),
);

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
};

const WorkoutSessionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createWorkoutSessionStyles(colors);

  const requestedActivity =
    activities.find(activity => activity.id === route.params?.activityId) ??
    activities[0];
  const [selectedActivity, setSelectedActivity] = useState(requestedActivity);
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(
    null,
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [confirmation, setConfirmation] = useState<WorkoutConfirmation | null>(
    null,
  );
  const isRunning =
    workoutSession !== null && workoutSession.startedAtMilliseconds !== null;
  const hasStarted = workoutSession !== null;
  const currentActivity =
    activities.find(activity => activity.id === workoutSession?.activityId) ??
    selectedActivity;

  const handleConfirmationAction = async (
    action: WorkoutConfirmation['actions'][number],
  ) => {
    setConfirmation(null);
    await action.onPress?.();
  };

  useEffect(() => {
    const activityId = route.params?.activityId;
    const activity = activities.find(item => item.id === activityId);
    if (activity && !workoutSession) {
      setSelectedActivity(activity);
    }
  }, [route.params?.activityId, workoutSession]);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeToWorkoutSession(() => {
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
    });

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

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const updateElapsedTime = () => {
      setElapsedSeconds(
        workoutSession
          ? Math.floor(getElapsedMilliseconds(workoutSession) / 1000)
          : 0,
      );
    };

    updateElapsedTime();

    if (!isRunning || !workoutSession) {
      return;
    }

    const interval = setInterval(updateElapsedTime, 1000);
    const appStateSubscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        updateElapsedTime();
      }
    });

    return () => {
      clearInterval(interval);
      appStateSubscription.remove();
    };
  }, [isRunning, workoutSession]);

  // Basic estimates for running/walking/cycling.
  // Replace with GPS or activity-specific calculations when implemented.
  const distanceKm = Number(
    ((currentActivity.speedKmh * elapsedSeconds) / 3600).toFixed(2),
  );
  const calories = Math.floor(
    (elapsedSeconds / 60) * currentActivity.caloriesPerMinute,
  );

  // const handleStartPause = () => {
  //   if (isRunning) {
  //     elapsedBeforePauseRef.current = elapsedSeconds;
  //     startedAtRef.current = null;
  //     setIsRunning(false);
  //     return;
  //   }

  //   startedAtRef.current = Date.now();
  //   setHasStarted(true);
  //   setIsRunning(true);
  // };

  const handleStartPause = async () => {
    try {
      if (isRunning) {
        await pauseWorkoutSession();
      } else if (hasStarted) {
        await resumeWorkoutSession();
      } else {
        await startWorkoutSession(selectedActivity.id);
      }
    } catch (error) {
      Alert.alert(
        'Could not update workout',
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const handleSelectActivity = (activity: Activity) => {
    if (hasStarted) {
      setConfirmation({
        title: 'Change activity?',
        message: 'Changing activity will reset the current workout.',
        actions: [
          { label: 'Cancel', variant: 'outline' },
          {
            label: 'Reset and change',
            onPress: async () => {
              try {
                await clearWorkoutSession();
                setSelectedActivity(activity);
              } catch (error) {
                Alert.alert(
                  'Could not reset workout',
                  error instanceof Error ? error.message : String(error),
                );
              }
            },
          },
        ],
      });
      return;
    }

    setSelectedActivity(activity);
  };

  const handleFinish = () => {
    if (
      !workoutSession ||
      Math.floor(getElapsedMilliseconds(workoutSession) / 1000) === 0
    ) {
      Alert.alert(
        'No workout to save',
        'Start your activity and exercise for some time before saving.',
      );
      return;
    }

    setConfirmation({
      title: 'Finish workout?',
      message: `Save your ${currentActivity.name.toLowerCase()} session?`,
      actions: [
        { label: 'Continue workout', variant: 'outline' },
        {
          label: 'Finish & Save',
          onPress: async () => {
            try {
              const finishedAt = Date.now();
              const durationMs = getElapsedMilliseconds(workoutSession, finishedAt);
              const startMs = finishedAt - durationMs;
              const activityTypes: Record<string, string> = {
                running: 'running', walking: 'walking', cycling: 'cycling',
                strength: 'strength', yoga: 'yoga', hiit: 'other',
                swimming: 'swimming', stretch: 'other', hiking: 'hiking', machines: 'strength',
              };
              const activityType = activityTypes[workoutSession.activityId] || 'other';
              const sourceRecordId = `android-workout:${workoutSession.sessionId}`;
              const offsetMs = 330 * 60 * 1000;
              let cursor = startMs;
              const records: Array<Record<string, unknown>> = [];
              while (cursor < finishedAt) {
                const day = new Date(cursor + offsetMs).toISOString().slice(0, 10);
                const nextMidnight = Date.parse(`${day}T00:00:00.000Z`) + 86400000 - offsetMs;
                const end = Math.min(finishedAt, nextMidnight);
                records.push({
                  metricType: 'workout', value: (end - cursor) / 60000, unit: 'min',
                  recordedAt: new Date(cursor).toISOString(), startTime: new Date(cursor).toISOString(),
                  endTime: new Date(end).toISOString(), source: 'android_app',
                  sourceRecordId: `${sourceRecordId}:${day}`, sourceVersion: 1, activityType,
                  metadata: { estimatedCalories: Math.floor(((end - cursor) / 60000) * currentActivity.caloriesPerMinute), estimatedDistanceKm: Number((currentActivity.speedKmh * (end - cursor) / 3600000).toFixed(2)) },
                });
                cursor = end;
              }
              for (let offset = 0; offset < records.length; offset += 100) {
                await authenticatedRequest('POST', '/health/sync', { records: records.slice(offset, offset + 100) });
              }
              await clearWorkoutSession();
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                'Could not finish workout',
                error instanceof Error ? error.message : String(error),
              );
            }
          },
        },
      ],
    });
  };

  const handleBack = () => {
    if (hasStarted) {
      setConfirmation({
        title: 'Workout in progress',
        message: 'Your workout will keep running if you leave this screen.',
        actions: [
          { label: 'Stay', variant: 'outline' },
          {
            label: 'Keep running',
            onPress: () => navigation.goBack(),
          },
          {
            label: 'Discard workout',
            destructive: true,
            onPress: async () => {
              try {
                await clearWorkoutSession();
                navigation.goBack();
              } catch (error) {
                Alert.alert(
                  'Could not discard workout',
                  error instanceof Error ? error.message : String(error),
                );
              }
            },
          },
        ],
      });
      return;
    }

    navigation.goBack();
  };

  return (
    <View
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}

      <AppHeader
        title="Workout"
        subtitle="Track your session"
        onBackPress={handleBack}
      />

      <ConfirmationModal
        visible={confirmation !== null}
        onClose={() => setConfirmation(null)}
        title={confirmation?.title}
        message={confirmation?.message}
        position="center"
        showCloseButton={false}
      >
        {confirmation?.actions.map(action => (
          <AppButton
            key={action.label}
            title={action.label}
            variant={action.variant ?? 'primary'}
            onPress={() => handleConfirmationAction(action)}
            style={[
              styles.modalActionButton,
              action.destructive && styles.destructiveActionButton,
            ]}
          />
        ))}
      </ConfirmationModal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Activity selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitySelector}
        >
          {activities.map(activity => {
            const selected = currentActivity.id === activity.id;

            return (
              <Pressable
                key={activity.id}
                onPress={() => handleSelectActivity(activity)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${activity.name}`}
                accessibilityState={{ selected }}
                style={[
                  styles.activityChip,
                  {
                    backgroundColor: selected
                      ? colors.surface
                      : colors.surfaceElevated,
                    borderColor: selected ? colors.border : 'transparent',
                  },
                  selected && styles.selectedChip,
                ]}
              >
                <AppText style={styles.activityEmoji}>{activity.emoji}</AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Workout timer */}
        <View
          style={[
            styles.workoutHero,
            { backgroundColor: currentActivity.color },
          ]}
        >
          <AppText style={styles.heroEmoji}>{currentActivity.emoji}</AppText>

          <AppText variant="h3" style={styles.heroActivityName}>
            {currentActivity?.name?.toUpperCase()}
          </AppText>

          {/* Heartbeat-style decorative line */}

          <HeartbeatAnimation isRunning={isRunning} color={colors.white} />

          <AppText style={styles.timer}>{formatTime(elapsedSeconds)}</AppText>

          <AppText variant="caption" style={styles.timerStatus}>
            {isRunning
              ? 'Workout in progress'
              : hasStarted
              ? 'Workout paused'
              : 'Ready to start'}
          </AppText>
        </View>

        {/* Workout metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            emoji="📏"
            value={distanceKm.toFixed(2)}
            unit="km"
            label="Distance"
            tint={colors.primaryLight}
            backgroundColor={colors.surface}
            styles={styles}
          />
          <MetricCard
            emoji="🔥"
            value={String(calories)}
            unit="kcal"
            label="Calories"
            tint={colors.warningLight}
            backgroundColor={colors.surface}
            styles={styles}
          />
          <MetricCard
            emoji="❤️"
            value="--"
            unit="bpm"
            label="Heart rate"
            tint={colors.errorLight}
            backgroundColor={colors.surface}
            styles={styles}
          />
          <MetricCard
            emoji="⚡"
            value="--"
            label="Avg pace"
            tint={colors.infoLight}
            backgroundColor={colors.surface}
            styles={styles}
          />
        </View>

        {/* Workout controls */}

        <AppButton
          title={isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start'}
          onPress={handleStartPause}
          style={[
            styles.startButton,
            { backgroundColor: currentActivity.color },
          ]}
        />

        <Pressable
          onPress={handleFinish}
          accessibilityRole="button"
          style={styles.finishButton}
        >
          <AppText variant="subtitle2" style={{ color: colors.textPrimary }}>
            Finish & Save
          </AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default WorkoutSessionScreen;
