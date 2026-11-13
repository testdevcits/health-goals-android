import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, DeviceEventEmitter } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
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
import { activities, type Activity, type WorkoutConfirmation } from './workoutSessionHelpers';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'WorkoutSession'>;

export default function useWorkoutSession(
  navigation: NavigationProp,
  routeParams?: { activityId?: string },
) {
  const requestedActivity =
    activities.find(activity => activity.id === routeParams?.activityId) ??
    activities[0];
  const [selectedActivity, setSelectedActivity] = useState<Activity>(requestedActivity);
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [confirmation, setConfirmation] = useState<WorkoutConfirmation | null>(null);
  const [savingWorkout, setSavingWorkout] = useState(false);
  const finishLock = useRef(false);
  const pendingWorkoutUpload = useRef<{
    sessionId: string;
    records: Array<Record<string, unknown>>;
  } | null>(null);

  const isRunning =
    workoutSession !== null && workoutSession.startedAtMilliseconds !== null;
  const hasStarted = workoutSession !== null;
  const currentActivity =
    activities.find(activity => activity.id === workoutSession?.activityId) ??
    selectedActivity;

  const returnToPreviousScreen = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('Home');
    }
  };

  const handleConfirmationAction = async (
    action: WorkoutConfirmation['actions'][number],
  ) => {
    setConfirmation(null);
    await action.onPress?.();
  };

  useEffect(() => {
    const activityId = routeParams?.activityId;
    const activity = activities.find(item => item.id === activityId);
    if (activity && !workoutSession) {
      setSelectedActivity(activity);
    }
  }, [routeParams?.activityId, workoutSession]);

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

  const distanceKm = Number(
    ((currentActivity.speedKmh * elapsedSeconds) / 3600).toFixed(2),
  );
  const calories = Math.floor(
    (elapsedSeconds / 60) * currentActivity.caloriesPerMinute,
  );

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
            if (finishLock.current) return;
            finishLock.current = true;
            setSavingWorkout(true);
            try {
              let records: Array<Record<string, unknown>> =
                pendingWorkoutUpload.current?.sessionId ===
                workoutSession.sessionId
                  ? pendingWorkoutUpload.current.records
                  : [];
              if (records.length === 0) {
                const finishedAt = Date.now();
                const durationMs = getElapsedMilliseconds(
                  workoutSession,
                  finishedAt,
                );
                const startMs = finishedAt - durationMs;
                const activityTypes: Record<string, string> = {
                  running: 'running',
                  walking: 'walking',
                  cycling: 'cycling',
                  strength: 'strength',
                  yoga: 'yoga',
                  hiit: 'other',
                  swimming: 'swimming',
                  stretch: 'other',
                  hiking: 'hiking',
                  machines: 'strength',
                };
                const activityType =
                  activityTypes[workoutSession.activityId] || 'other';
                const sourceRecordId = `android-workout:${workoutSession.sessionId}`;
                const offsetMs = 330 * 60 * 1000;
                let cursor = startMs;
                const newRecords: Array<Record<string, unknown>> = [];
                while (cursor < finishedAt) {
                  const day = new Date(cursor + offsetMs)
                    .toISOString()
                    .slice(0, 10);
                  const nextMidnight =
                    Date.parse(`${day}T00:00:00.000Z`) + 86400000 - offsetMs;
                  const end = Math.min(finishedAt, nextMidnight);
                  newRecords.push({
                    metricType: 'workout',
                    value: (end - cursor) / 60000,
                    unit: 'min',
                    recordedAt: new Date(cursor).toISOString(),
                    startTime: new Date(cursor).toISOString(),
                    endTime: new Date(end).toISOString(),
                    source: 'app',
                    sourceRecordId: `${sourceRecordId}:${day}`,
                    sourceVersion: 1,
                    activityType,
                    metadata: {
                      estimatedCalories: Math.floor(
                        ((end - cursor) / 60000) *
                        currentActivity.caloriesPerMinute,
                      ),
                      estimatedDistanceKm: Number(
                        (
                          (currentActivity.speedKmh * (end - cursor)) /
                          3600000
                        ).toFixed(2),
                      ),
                    },
                  });
                  cursor = end;
                }
                records = newRecords;
                pendingWorkoutUpload.current = {
                  sessionId: workoutSession.sessionId,
                  records,
                };
              }
              for (let offset = 0; offset < records.length; offset += 100) {
                await authenticatedRequest(
                  'POST',
                  API_ENDPOINTS.HEALTH.SYNC,
                  {
                    records: records.slice(offset, offset + 100),
                  },
                  60_000,
                );
              }
              DeviceEventEmitter.emit('activitySyncCompleted');
              await clearWorkoutSession();
              pendingWorkoutUpload.current = null;
              returnToPreviousScreen();
            } catch (error) {
              finishLock.current = false;
              setSavingWorkout(false);
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
            onPress: returnToPreviousScreen,
          },
          {
            label: 'Discard workout',
            destructive: true,
            onPress: async () => {
              try {
                await clearWorkoutSession();
                returnToPreviousScreen();
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

    returnToPreviousScreen();
  };

  return {
    selectedActivity,
    currentActivity,
    workoutSession,
    elapsedSeconds,
    isRunning,
    hasStarted,
    distanceKm,
    calories,
    confirmation,
    setConfirmation,
    savingWorkout,
    handleConfirmationAction,
    handleStartPause,
    handleSelectActivity,
    handleFinish,
    handleBack,
  };
}
