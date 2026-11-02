import { Platform } from 'react-native';
import {
  aggregateGroupByDuration,
  aggregateRecord,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  readRecords,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { ExerciseType } from 'react-native-health-connect';
import type { Permission } from 'react-native-health-connect';

export const HEALTH_PERMISSIONS: Permission[] = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'Distance' },
  { accessType: 'read', recordType: 'TotalCaloriesBurned' },
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'ExerciseSession' },
  { accessType: 'read', recordType: 'Weight' },
  { accessType: 'read', recordType: 'OxygenSaturation' },
  { accessType: 'read', recordType: 'BloodPressure' },
];

export interface TodayHealthData {
  status: 'ready' | 'permission-required' | 'unavailable' | 'unsupported';
  steps: number | null;
  distanceMeters: number | null;
  calories: number | null;
  exerciseMinutes: number | null;
  workouts: WorkoutReportSession[] | null;
  hourlySteps: number[] | null;
  hourlyCalories: number[] | null;
  hourlyExerciseMinutes: number[] | null;
}

export interface WorkoutReportSession {
  activity: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

const EXERCISE_NAMES = new Map<number, string>([
  [ExerciseType.BIKING, 'Cycling'],
  [ExerciseType.BIKING_STATIONARY, 'Indoor cycling'],
  [ExerciseType.DANCING, 'Dance'],
  [ExerciseType.ELLIPTICAL, 'Elliptical'],
  [ExerciseType.HIGH_INTENSITY_INTERVAL_TRAINING, 'HIIT'],
  [ExerciseType.HIKING, 'Hiking'],
  [ExerciseType.RUNNING, 'Running'],
  [ExerciseType.RUNNING_TREADMILL, 'Treadmill running'],
  [ExerciseType.STRENGTH_TRAINING, 'Strength training'],
  [ExerciseType.STRETCHING, 'Stretching'],
  [ExerciseType.SWIMMING_OPEN_WATER, 'Open-water swimming'],
  [ExerciseType.SWIMMING_POOL, 'Pool swimming'],
  [ExerciseType.WALKING, 'Walking'],
  [ExerciseType.WEIGHTLIFTING, 'Weightlifting'],
  [ExerciseType.YOGA, 'Yoga'],
]);

const EMPTY_HOURS = () => Array.from({ length: 24 }, () => 0);

const hasReadPermission = (permissions: Permission[], recordType: string) =>
  permissions.some(
    permission =>
      permission.accessType === 'read' && permission.recordType === recordType,
  );

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    operator: 'between' as const,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
};

const createEmptyData = (
  status: TodayHealthData['status'],
): TodayHealthData => ({
  status,
  steps: null,
  distanceMeters: null,
  calories: null,
  exerciseMinutes: null,
  workouts: null,
  hourlySteps: null,
  hourlyCalories: null,
  hourlyExerciseMinutes: null,
});

export const readTodayHealthData = async (
  includeHourlyData = false,
): Promise<TodayHealthData> => {
  if (Platform.OS !== 'android') {
    return createEmptyData('unsupported');
  }

  const sdkStatus = await getSdkStatus();
  if (
    sdkStatus === SdkAvailabilityStatus.SDK_UNAVAILABLE ||
    sdkStatus === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
  ) {
    return createEmptyData('unavailable');
  }

  const initialized = await initialize();
  if (!initialized) {
    throw new Error('Health Connect could not be initialized.');
  }

  const grantedPermissions = (await getGrantedPermissions()).filter(
    (permission): permission is Permission =>
      'accessType' in permission && 'recordType' in permission,
  );
  const hasSteps = hasReadPermission(grantedPermissions, 'Steps');
  const hasDistance = hasReadPermission(grantedPermissions, 'Distance');
  const hasCalories = hasReadPermission(
    grantedPermissions,
    'TotalCaloriesBurned',
  );
  const hasExercise = hasReadPermission(grantedPermissions, 'ExerciseSession');
  const hasHeartRate = hasReadPermission(grantedPermissions, 'HeartRate');
  const hasSleep = hasReadPermission(grantedPermissions, 'SleepSession');
  const hasWeight = hasReadPermission(grantedPermissions, 'Weight');
  const hasOxygen = hasReadPermission(grantedPermissions, 'OxygenSaturation');
  const hasBloodPressure = hasReadPermission(grantedPermissions, 'BloodPressure');
  const hasAnyPermission =
    hasSteps || hasDistance || hasCalories || hasExercise || hasHeartRate ||
    hasSleep || hasWeight || hasOxygen || hasBloodPressure;

  if (!hasAnyPermission) {
    return createEmptyData('permission-required');
  }

  const timeRangeFilter = getTodayRange();
  const hourlyFilter = {
    timeRangeFilter,
    timeRangeSlicer: { duration: 'HOURS' as const, length: 1 },
  };

  const [
    stepsResult,
    distanceResult,
    caloriesResult,
    exerciseResult,
    hourlyStepsResult,
    hourlyCaloriesResult,
    hourlyExerciseResult,
    workoutRecords,
  ] = await Promise.all([
    hasSteps ? aggregateRecord({ recordType: 'Steps', timeRangeFilter }) : null,
    hasDistance
      ? aggregateRecord({ recordType: 'Distance', timeRangeFilter })
      : null,
    hasCalories
      ? aggregateRecord({ recordType: 'TotalCaloriesBurned', timeRangeFilter })
      : null,
    hasExercise
      ? aggregateRecord({ recordType: 'ExerciseSession', timeRangeFilter })
      : null,
    includeHourlyData && hasSteps
      ? aggregateGroupByDuration({
          recordType: 'Steps',
          ...hourlyFilter,
        })
      : null,
    includeHourlyData && hasCalories
      ? aggregateGroupByDuration({
          recordType: 'TotalCaloriesBurned',
          ...hourlyFilter,
        })
      : null,
    includeHourlyData && hasExercise
      ? aggregateGroupByDuration({
          recordType: 'ExerciseSession',
          ...hourlyFilter,
        })
      : null,
    hasExercise
      ? readRecords('ExerciseSession', {
          timeRangeFilter,
          ascendingOrder: true,
          pageSize: 1000,
        })
      : null,
  ]);

  const toHourlyValues = <T extends { startTime: string }>(
    results: T[] | null,
    valueFor: (result: T) => number,
  ) => {
    if (!results) {
      return null;
    }

    const values = EMPTY_HOURS();
    results.forEach(result => {
      values[new Date(result.startTime).getHours()] += valueFor(result);
    });
    return values;
  };

  return {
    status: 'ready',
    steps: stepsResult?.COUNT_TOTAL ?? null,
    distanceMeters: distanceResult?.DISTANCE.inMeters ?? null,
    calories: caloriesResult?.ENERGY_TOTAL.inKilocalories ?? null,
    exerciseMinutes: exerciseResult
      ? exerciseResult.EXERCISE_DURATION_TOTAL.inSeconds / 60
      : null,
    workouts: workoutRecords
      ? workoutRecords.records.map(record => ({
          activity:
            record.title?.trim() ||
            EXERCISE_NAMES.get(record.exerciseType) ||
            'Workout',
          startTime: record.startTime,
          endTime: record.endTime,
          durationMinutes:
            (new Date(record.endTime).getTime() -
              new Date(record.startTime).getTime()) /
            60000,
        }))
      : null,
    hourlySteps: toHourlyValues(
      hourlyStepsResult,
      result => result.result.COUNT_TOTAL,
    ),
    hourlyCalories: toHourlyValues(
      hourlyCaloriesResult,
      result => result.result.ENERGY_TOTAL.inKilocalories,
    ),
    hourlyExerciseMinutes: toHourlyValues(
      hourlyExerciseResult,
      result => result.result.EXERCISE_DURATION_TOTAL.inSeconds / 60,
    ),
  };
};
