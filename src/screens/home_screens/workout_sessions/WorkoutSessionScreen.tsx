import React, { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { AppButton, AppHeader, AppText } from '../../../components';
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

type Activity = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

const generateActivityColor = (seed: number) => {
  const hue = (seed * 47 + Math.floor(Math.random() * 60)) % 360;
  const saturation = 72;
  const lightness = 58;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

const activities: Activity[] = [
  { id: 'running', name: 'Running', emoji: '🏃', color: generateActivityColor(1) },
  { id: 'walking', name: 'Walking', emoji: '🚶', color: generateActivityColor(2) },
  { id: 'cycling', name: 'Cycling', emoji: '🚴', color: generateActivityColor(3) },
  { id: 'strength', name: 'Strength', emoji: '🏋️', color: generateActivityColor(4) },
  { id: 'yoga', name: 'Yoga', emoji: '🧘', color: generateActivityColor(5) },
  { id: 'hiit', name: 'HIIT', emoji: '🔥', color: generateActivityColor(6) },
  { id: 'swimming', name: 'Swimming', emoji: '🏊', color: generateActivityColor(7) },
  { id: 'stretch', name: 'Stretch', emoji: '🤸', color: generateActivityColor(8) },
  { id: 'hiking', name: 'Hiking', emoji: '🥾', color: generateActivityColor(9) },
  { id: 'machines', name: 'Weight machines', emoji: '🏋🏻', color: generateActivityColor(10) },
];

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
  ({ emoji, value, unit, label, tint, backgroundColor, styles }: MetricCardProps) => (
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

const WorkoutSessionScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createWorkoutSessionStyles(colors);

  const [selectedActivity, setSelectedActivity] = useState(activities[0]);
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(
    null,
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const isRunning =
    workoutSession !== null && workoutSession.startedAtMilliseconds !== null;
  const hasStarted = workoutSession !== null;
  const currentActivity =
    activities.find(activity => activity.id === workoutSession?.activityId) ??
    selectedActivity;

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
  const speedKmh =
    currentActivity.id === 'running'
      ? 9.6
      : currentActivity.id === 'walking'
      ? 5
      : currentActivity.id === 'cycling'
      ? 18
      : 0;

  const distanceKm = Number(((speedKmh * elapsedSeconds) / 3600).toFixed(2));

  const caloriesPerMinute =
    currentActivity.id === 'running'
      ? 10
      : currentActivity.id === 'walking'
      ? 4
      : currentActivity.id === 'cycling'
      ? 8
      : currentActivity.id === 'strength'
      ? 5
      : currentActivity.id === 'hiit'
      ? 12
      : 3;

  const calories = Math.floor((elapsedSeconds / 60) * caloriesPerMinute);

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
      Alert.alert(
        'Change activity?',
        'Changing activity will reset the current workout.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset and change',
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
      );
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

    Alert.alert(
      'Finish workout?',
      `Save your ${currentActivity.name.toLowerCase()} session?`,
      [
        { text: 'Continue workout', style: 'cancel' },
        {
          text: 'Finish & Save',
          onPress: async () => {
            try {
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
    );
  };

  const handleBack = () => {
    if (hasStarted) {
      Alert.alert(
        'Workout in progress',
        'Your workout will keep running if you leave this screen.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Keep running',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Discard workout',
            style: 'destructive',
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
      );
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
            {currentActivity.name.toUpperCase()}
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
