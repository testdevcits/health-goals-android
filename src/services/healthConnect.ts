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
import { localDateKey } from '../utils/healthDates';

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
  failedMetrics?: string[];
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

export interface DailyStepTotal {
  date: string;
  value: number;
  count: number;
  unit: 'steps';
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
const IST_OFFSET_MS = 330 * 60 * 1000;

const istDateKey = (time: string | Date) =>
  new Date(new Date(time).getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);

const shiftDateKey = (key: string, amount: number) => {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};

let initializationPromise: Promise<boolean> | null = null;

export async function ensureHealthConnectInitialized(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      const sdkStatus = await getSdkStatus();
      if (
        sdkStatus === SdkAvailabilityStatus.SDK_UNAVAILABLE ||
        sdkStatus ===
          SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
      ) {
        return false;
      }

      return initialize();
    })()
      .then(initialized => {
        if (!initialized) {
          initializationPromise = null;
        }
        return initialized;
      })
      .catch(error => {
        initializationPromise = null;
        throw error;
      });
  }

  return initializationPromise;
}

const hasReadPermission = (permissions: Permission[], recordType: string) =>
  permissions.some(
    permission =>
      permission.accessType === 'read' && permission.recordType === recordType,
  );

const getTodayRange = () => {
  const today = istDateKey(new Date());
  const start = new Date(Date.parse(`${today}T00:00:00.000Z`) - IST_OFFSET_MS);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

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

  const initialized = await ensureHealthConnectInitialized();
  if (!initialized) {
    return createEmptyData('unavailable');
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
  const hasBloodPressure = hasReadPermission(
    grantedPermissions,
    'BloodPressure',
  );
  const hasAnyPermission =
    hasSteps ||
    hasDistance ||
    hasCalories ||
    hasExercise ||
    hasHeartRate ||
    hasSleep ||
    hasWeight ||
    hasOxygen ||
    hasBloodPressure;

  if (!hasAnyPermission) {
    return createEmptyData('permission-required');
  }

  const timeRangeFilter = getTodayRange();
  const hourlyFilter = {
    timeRangeFilter,
    timeRangeSlicer: { duration: 'HOURS' as const, length: 1 },
  };

  const failedMetrics: string[] = [];
  const safeRead = async <T>(
    type: string,
    read: () => Promise<T>,
  ): Promise<T | null> => {
    try {
      return await read();
    } catch {
      if (!failedMetrics.includes(type)) failedMetrics.push(type);
      return null;
    }
  };
  const readWorkouts = async () => {
    const records: Awaited<
      ReturnType<typeof readRecords<'ExerciseSession'>>
    >['records'] = [];
    let pageToken: string | undefined;
    do {
      const page = await readRecords('ExerciseSession', {
        timeRangeFilter,
        ascendingOrder: true,
        pageSize: 1000,
        ...(pageToken ? { pageToken } : {}),
      });
      records.push(...page.records);
      pageToken = page.pageToken || undefined;
    } while (pageToken);
    return { records };
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
    hasSteps
      ? safeRead('Steps', () =>
          aggregateRecord({ recordType: 'Steps', timeRangeFilter }),
        )
      : null,
    hasDistance
      ? safeRead('Distance', () =>
          aggregateRecord({ recordType: 'Distance', timeRangeFilter }),
        )
      : null,
    hasCalories
      ? safeRead('TotalCaloriesBurned', () =>
          aggregateRecord({
            recordType: 'TotalCaloriesBurned',
            timeRangeFilter,
          }),
        )
      : null,
    hasExercise
      ? safeRead('ExerciseSession', () =>
          aggregateRecord({ recordType: 'ExerciseSession', timeRangeFilter }),
        )
      : null,
    includeHourlyData && hasSteps
      ? safeRead('Steps', () =>
          aggregateGroupByDuration({ recordType: 'Steps', ...hourlyFilter }),
        )
      : null,
    includeHourlyData && hasCalories
      ? safeRead('TotalCaloriesBurned', () =>
          aggregateGroupByDuration({
            recordType: 'TotalCaloriesBurned',
            ...hourlyFilter,
          }),
        )
      : null,
    includeHourlyData && hasExercise
      ? safeRead('ExerciseSession', () =>
          aggregateGroupByDuration({
            recordType: 'ExerciseSession',
            ...hourlyFilter,
          }),
        )
      : null,
    hasExercise ? safeRead('ExerciseSession', readWorkouts) : null,
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
      values[
        new Date(Date.parse(result.startTime) + IST_OFFSET_MS).getUTCHours()
      ] += valueFor(result);
    });
    return values;
  };

  return {
    status: 'ready',
    ...(failedMetrics.length ? { failedMetrics } : {}),
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

/** Read daily totals through Health Connect aggregation so overlapping sources
 * follow the same deduplication and app-priority rules as its own step total. */
export const readStepsHistory = async (
  days = 7,
  range?: { from: Date; to: Date },
): Promise<DailyStepTotal[]> => {
  if (Platform.OS !== 'android' || days < 1) return [];

  if (!(await ensureHealthConnectInitialized())) return [];

  const granted = (await getGrantedPermissions()).filter(
    (permission): permission is Permission =>
      'accessType' in permission && 'recordType' in permission,
  );
  if (!hasReadPermission(granted, 'Steps')) return [];

  const today = istDateKey(new Date());
  const firstDay = range
    ? localDateKey(range.from)
    : shiftDateKey(today, -(days - 1));
  const lastDay = range ? localDateKey(range.to) : today;
  const rangeDays =
    Math.floor(
      (Date.parse(`${lastDay}T00:00:00.000Z`) -
        Date.parse(`${firstDay}T00:00:00.000Z`)) /
        (24 * 60 * 60 * 1000),
    ) + 1;
  if (rangeDays < 1) return [];
  const start = new Date(
    Date.parse(`${firstDay}T00:00:00.000Z`) - IST_OFFSET_MS,
  );
  const end = new Date(
    Date.parse(
      `${shiftDateKey(lastDay, 1)}T00:00:00.000Z`,
    ) - IST_OFFSET_MS,
  );

  const grouped = await aggregateGroupByDuration({
    recordType: 'Steps',
    timeRangeFilter: {
      operator: 'between',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    },
    // Anchor fixed 24-hour buckets at IST midnight; period buckets otherwise
    // follow the handset timezone and can disagree with the backend's day key.
    timeRangeSlicer: { duration: 'DAYS', length: 1 },
  });
  const totals = new Map<string, number>();
  grouped.forEach(group => {
    const key = istDateKey(group.startTime);
    totals.set(key, (totals.get(key) || 0) + group.result.COUNT_TOTAL);
  });

  return Array.from({ length: range ? rangeDays : days }, (_, index) => {
    const key = shiftDateKey(firstDay, index);
    return {
      date: key,
      value: totals.get(key) || 0,
      count: 0,
      unit: 'steps' as const,
    };
  });
};
