import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LatLng } from 'react-native-maps';
import BackgroundGeolocation from 'react-native-background-geolocation';
import type { HomeStackParamList } from '../../../navigations/HomeStack';
import {
  clearWorkoutSession,
  getElapsedMilliseconds,
  getWorkoutSession,
  pauseWorkoutSession,
  resumeWorkoutSession,
  startWorkoutSession,
  subscribeToWorkoutSession,
  updateWorkoutMetrics,
  type WorkoutSession,
} from './workoutSessionStore';
import {
  activities,
  type Activity,
  type WorkoutConfirmation,
} from './workoutSessionHelpers';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'WorkoutSession'
>;

export default function useWorkoutSession(
  navigation: NavigationProp,
  routeParams?: { activityId?: string },
) {
  const requestedActivity =
    activities.find(activity => activity.id === routeParams?.activityId) ??
    activities[0];
  const [selectedActivity, setSelectedActivity] =
    useState<Activity>(requestedActivity);
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(
    null,
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [confirmation, setConfirmation] = useState<WorkoutConfirmation | null>(
    null,
  );
  const [savingWorkout, setSavingWorkout] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [gpsDistanceMeters, setGpsDistanceMeters] = useState(0);
  const [currentSpeedMps, setCurrentSpeedMps] = useState(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const stillCountRef = useRef(0);
  const movingCountRef = useRef(0);
  const isAutoPausedRef = useRef(false);
  isAutoPausedRef.current = isAutoPaused;
  const lastPositionRef = useRef<LatLng | null>(null);
  const hasEverMovedRef = useRef(false);
  const initialStationaryAlertShownRef = useRef(false);
  const [completedWorkout, setCompletedWorkout] = useState<{
    activityName: string;
    activityEmoji: string;
    durationSeconds: number;
    calories: number;
    distanceKm: number;
  } | null>(null);
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
    if (action.label === 'Finish & Save') {
      await action.onPress?.();
      return;
    }
    setConfirmation(null);
    await action.onPress?.();
  };

  useEffect(() => {
    const activityId = routeParams?.activityId;
    const activity = activities.find(item => item?.id === activityId);
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
      // If auto-paused due to user being stationary, freeze timer increment
      if (isAutoPausedRef.current) {
        return;
      }
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

  // Track GPS location, movement distance, and motion for outdoor activities when workout is running
  useEffect(() => {
    const isOutdoor = Boolean(currentActivity.isOutdoor);
    if (!isRunning || !isOutdoor) {
      setIsAutoPaused(false);
      stillCountRef.current = 0;
      movingCountRef.current = 0;
      lastPositionRef.current = null;
      return;
    }

    let isMounted = true;
    let locationSubscription: { remove: () => void } | null = null;
    let motionSubscription: { remove: () => void } | null = null;

    // Helper to calculate distance in meters between two lat/lng coords (Haversine formula)
    const calculateDistanceMeters = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ): number => {
      const R = 6371e3; // Earth radius in meters
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const setupGeolocation = async () => {
      try {
        // Subscribe to live location updates
        locationSubscription = BackgroundGeolocation.onLocation(
          location => {
            if (!isMounted || !location?.coords) return;
            const speed = Math.max(0, location.coords.speed ?? 0); // Speed in m/s
            setCurrentSpeedMps(speed);
            const currentLat = location.coords.latitude;
            const currentLon = location.coords.longitude;
            const accuracy = location.coords.accuracy ?? 15;

            // Check distance delta from last observed position
            let distanceDelta = 0;
            if (lastPositionRef.current) {
              distanceDelta = calculateDistanceMeters(
                lastPositionRef.current.latitude,
                lastPositionRef.current.longitude,
                currentLat,
                currentLon,
              );
            }

            // Real-world noise rejection:
            // If GPS accuracy is poor (> 35m) and displacement is huge, ignore spurious jump
            if (accuracy > 35 && distanceDelta > 80) {
              return;
            }

            // User is moving if:
            // 1. GPS speed is at least 0.5 m/s (~1.8 km/h), OR
            // 2. Physical displacement between fixes is >= 4 meters
            const isMoving = speed >= 0.5 || distanceDelta >= 4.0;

            if (isMoving) {
              movingCountRef.current += 1;
              stillCountRef.current = 0;
              hasEverMovedRef.current = true;
              initialStationaryAlertShownRef.current = false;

              // Accumulate real measured GPS distance when moving
              if (lastPositionRef.current && distanceDelta >= 2 && distanceDelta < 150) {
                setGpsDistanceMeters(prev => prev + distanceDelta);
              }

              lastPositionRef.current = { latitude: currentLat, longitude: currentLon };

              // Unpause smoothly if auto-paused
              if (isAutoPausedRef.current && movingCountRef.current >= 1) {
                setIsAutoPaused(false);
              }
            } else {
              // Device is stationary or placed in one spot
              movingCountRef.current = 0;
              stillCountRef.current += 1;

              // After 2 consecutive stationary fixes (~2-4s), smoothly freeze the timer
              if (stillCountRef.current >= 2 && !isAutoPausedRef.current) {
                setIsAutoPaused(true);
              }
            }

            const nextCoord: LatLng = {
              latitude: currentLat,
              longitude: currentLon,
            };

            // Only record GPS trail if moving
            setRouteCoordinates(prev => {
              if (!isMoving && prev.length > 0) {
                return prev;
              }
              const last = prev[prev.length - 1];
              if (
                last &&
                Math.abs(last.latitude - nextCoord.latitude) < 0.00001 &&
                Math.abs(last.longitude - nextCoord.longitude) < 0.00001
              ) {
                return prev;
              }
              return [...prev, nextCoord];
            });
          },
          error => {
            console.log('Location watch notice:', error);
          },
        );

        // Also listen to hardware activity recognition (still vs on_foot/running/walking)
        motionSubscription = BackgroundGeolocation.onMotionChange(event => {
          if (!isMounted) return;
          if (!event.isMoving) {
            setIsAutoPaused(true);
            stillCountRef.current = 2;
            movingCountRef.current = 0;
          } else {
            setIsAutoPaused(false);
            stillCountRef.current = 0;
            movingCountRef.current = 1;
            hasEverMovedRef.current = true;
            initialStationaryAlertShownRef.current = false;
          }
        });

        // Fetch current position right away to center the map immediately
        const currentLocation = await BackgroundGeolocation.getCurrentPosition({
          persist: false,
          samples: 1,
        });
        if (isMounted && currentLocation?.coords) {
          lastPositionRef.current = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          };
          setRouteCoordinates(prev => {
            if (prev.length === 0) {
              return [
                {
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                },
              ];
            }
            return prev;
          });
        }
      } catch (err) {
        console.log('Unable to initialize workout GPS:', err);
      }
    };

    setupGeolocation();

    return () => {
      isMounted = false;
      if (locationSubscription && typeof locationSubscription.remove === 'function') {
        locationSubscription.remove();
      }
      if (motionSubscription && typeof motionSubscription.remove === 'function') {
        motionSubscription.remove();
      }
    };
  }, [isRunning, currentActivity.isOutdoor]);

  // Professional real-world metric calculation:
  // For outdoor activities:
  // - Distance is calculated from real GPS coordinates walked/run (gpsDistanceMeters),
  //   or 0 if phone remained placed in one spot without moving!
  // - For indoor activities (yoga, gym): estimated from duration and nominal activity rate.
  const distanceKm = currentActivity.isOutdoor
    ? Number((gpsDistanceMeters / 1000).toFixed(2))
    : Number(((currentActivity.speedKmh * elapsedSeconds) / 3600).toFixed(2));

  // Calories calculation:
  // For outdoor activities (running, walking, cycling, hiking):
  // Calories should ONLY burn when the user is actually moving/covering distance!
  // If the phone is sitting on a table (distance = 0), burned calories are 0.
  // Standard MET/exercise formula: Calories ~ distance (km) * factor, or rate scaled by movement
  const calories = (() => {
    if (currentActivity.isOutdoor) {
      if (distanceKm <= 0 || currentActivity.speedKmh <= 0) {
        return 0;
      }
      // Calories based on actual distance covered:
      // (distanceKm / speedKmh) gives actual moving hours * 60 * caloriesPerMinute
      const movingMinutes = (distanceKm / currentActivity.speedKmh) * 60;
      return Math.floor(movingMinutes * currentActivity.caloriesPerMinute);
    }
    // Indoor activities (e.g. Yoga, Strength, HIIT, Swimming): based on active elapsed time
    return Math.floor((elapsedSeconds / 60) * currentActivity.caloriesPerMinute);
  })();

  // Keep shared workout store metrics in sync so LiveWorkoutCard mirrors real-time distance and calories
  useEffect(() => {
    if (isRunning) {
      updateWorkoutMetrics(gpsDistanceMeters, calories);
    }
  }, [isRunning, gpsDistanceMeters, calories]);

  // Average Pace: min / km based on real distance covered
  const avgPace = (() => {
    if (distanceKm <= 0.05 || elapsedSeconds < 10) {
      return '--';
    }
    const paceSecondsPerKm = elapsedSeconds / distanceKm;
    if (!Number.isFinite(paceSecondsPerKm) || paceSecondsPerKm > 3600) {
      return '--';
    }
    const paceMinutes = Math.floor(paceSecondsPerKm / 60);
    const paceRemainingSeconds = Math.floor(paceSecondsPerKm % 60);
    return `${paceMinutes}'${String(paceRemainingSeconds).padStart(2, '0')}"`;
  })();

  const handleStartPause = async () => {
    try {
      if (isRunning) {
        await pauseWorkoutSession();
        // If workout is paused and tracking was active, stop background tracking
        try {
          await BackgroundGeolocation.stop();
        } catch {
          // ignore
        }
      } else if (hasStarted) {
        await resumeWorkoutSession();
        if (selectedActivity.isOutdoor) {
          try {
            await BackgroundGeolocation.start();
          } catch {
            // ignore
          }
        }
      } else {
        // If outdoor activity, check smartwatch connection:
        // If no smartwatch, ensure phone's background GPS tracking is started!
        if (selectedActivity.isOutdoor) {
          const savedWatchJson = await AsyncStorage.getItem(
            'vitality:connected_watch',
          );
          const hasConnectedWatch = Boolean(savedWatchJson);

          if (!hasConnectedWatch) {
            // User doesn't have a smartwatch connected: start phone's background GPS tracking directly
            try {
              await BackgroundGeolocation.start();
            } catch (geoError) {
              console.log('Phone background GPS start notice:', geoError);
            }
          }
        }
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
                      estimatedCalories: currentActivity.isOutdoor
                        ? distanceKm <= 0 || currentActivity.speedKmh <= 0
                          ? 0
                          : Math.floor(
                              ((distanceKm * (end - cursor)) /
                                Math.max(1, finishedAt - startMs) /
                                currentActivity.speedKmh) *
                                60 *
                                currentActivity.caloriesPerMinute,
                            )
                        : Math.floor(
                            ((end - cursor) / 60000) *
                              currentActivity.caloriesPerMinute,
                          ),
                      estimatedDistanceKm: currentActivity.isOutdoor
                        ? Number(
                            (
                              (distanceKm * (end - cursor)) /
                              Math.max(1, finishedAt - startMs)
                            ).toFixed(2),
                          )
                        : Number(
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
              finishLock.current = false;
              setSavingWorkout(false);
              setConfirmation(null);

              // Trigger Celebration Modal with summary stats
              setCompletedWorkout({
                activityName: currentActivity.name,
                activityEmoji: currentActivity.emoji,
                durationSeconds: elapsedSeconds,
                calories,
                distanceKm,
              });
            } catch (error) {
              finishLock.current = false;
              setSavingWorkout(false);
              setConfirmation(null);
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
    isAutoPaused,
    distanceKm,
    currentSpeedMps,
    calories,
    avgPace,
    confirmation,
    setConfirmation,
    savingWorkout,
    completedWorkout,
    closeCelebration: () => {
      setCompletedWorkout(null);
      returnToPreviousScreen();
    },
    routeCoordinates,
    handleConfirmationAction,
    handleStartPause,
    handleSelectActivity,
    handleFinish,
    handleBack,
  };
}
