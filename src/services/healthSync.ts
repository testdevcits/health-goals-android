import axios from 'axios';
import { DeviceEventEmitter } from 'react-native';
import * as Keychain from 'react-native-keychain';
import {
  ExerciseType,
  aggregateGroupByDuration,
  getGrantedPermissions,
  readRecords,
} from 'react-native-health-connect';
import type { Permission } from 'react-native-health-connect';
import { authenticatedRequest } from './authenticatedApi';
import { ensureHealthConnectDevice } from './devices';
import { ensureHealthConnectInitialized } from './healthConnect';
import { readSession } from './auth';
import { API_ENDPOINTS } from '../constants/endpoints';

const IST_OFFSET_MS = 330 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const SOURCE = 'health_connect';
const VERSION_STORE_SERVICE = 'com.vitality.health-sync-snapshots';
const LAST_SYNC_STORE_SERVICE = 'com.vitality.health-sync-watermark';
const MAX_BATCH_SIZE = 100;
const SNAPSHOT_WINDOW_DAYS = 7;
const MIN_SYNC_INTERVAL_MS = 5 * 60 * 1000;
const METRIC_BOUNDS: Record<string, { min: number; max: number }> = {
  distance: { min: 0, max: 500 },
  calories: { min: 0, max: 50_000 },
  sleep: { min: 0, max: 1440 },
  heart_rate: { min: 20, max: 250 },
  weight: { min: 1, max: 700 },
  blood_pressure: { min: 1, max: 400 },
  oxygen_saturation: { min: 50, max: 100 },
  workout: { min: 0, max: 1440 },
  active_minutes: { min: 0, max: 1440 },
};

let activeSync: Promise<HealthSyncResult> | null = null;
let activeSyncForced = false;

type SnapshotRecord = {
  metricType: string;
  value: number;
  unit: string;
  recordedAt: string;
  startTime: string;
  endTime: string;
  source: string;
  dataOrigin: string;
  recordingMethod: 'automatic';
  sourceRecordId: string;
  sourceVersion: number;
  deviceId: string;
  metadata: Record<string, unknown>;
  activityType?: string;
  deleted?: boolean;
};

type HealthSyncResult = {
  synced: number;
  created: number;
  duplicates: number;
  throttled?: boolean;
  failedMetrics?: string[];
};

type SnapshotVersion = {
  fingerprint: string;
  sourceVersion: number;
  updatedAt: number;
};

type SyncWatermark = { lastSuccessAt: number; schemaVersion: 3 };

type AggregationGroup = {
  startTime: string;
  result: Record<string, any>;
};

type HealthConnectWorkout = {
  startTime: string;
  endTime: string;
  exerciseType: number;
  metadata?: Record<string, any>;
};

const emptySyncResult = (): HealthSyncResult => ({
  synced: 0,
  created: 0,
  duplicates: 0,
});

const istDay = (time: string | Date) =>
  new Date(new Date(time).getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);

const shiftDateKey = (key: string, amount: number) => {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};

function getIstSnapshotRange(days: number) {
  const today = istDay(new Date());
  const firstDay = shiftDateKey(today, -(days - 1));
  const endDay = shiftDateKey(today, 1);
  const startMs = Date.parse(`${firstDay}T00:00:00.000Z`) - IST_OFFSET_MS;
  const endMs = Date.parse(`${endDay}T00:00:00.000Z`) - IST_OFFSET_MS;
  const dates = Array.from({ length: days }, (_, index) =>
    shiftDateKey(firstDay, index),
  );

  return {
    dates,
    startTime: new Date(startMs).toISOString(),
    endTime: new Date(endMs).toISOString(),
    timeRangeFilter: {
      operator: 'between' as const,
      startTime: new Date(startMs).toISOString(),
      endTime: new Date(endMs).toISOString(),
    },
  };
}

const hasReadPermission = (granted: Permission[], type: string) =>
  granted.some(row => row.accessType === 'read' && row.recordType === type);

async function aggregateDaily(
  type: string,
  granted: Permission[],
  timeRangeFilter: any,
) {
  if (!hasReadPermission(granted, type)) return [] as AggregationGroup[];

  return aggregateGroupByDuration({
    recordType: type as any,
    timeRangeFilter,
    // The range starts at IST midnight, so fixed 24-hour buckets match backend day keys.
    timeRangeSlicer: { duration: 'DAYS', length: 1 },
  } as any) as Promise<AggregationGroup[]>;
}

async function readOxygenRecords(
  granted: Permission[],
  timeRangeFilter: ReturnType<typeof getIstSnapshotRange>['timeRangeFilter'],
) {
  if (!hasReadPermission(granted, 'OxygenSaturation')) return [] as any[];

  const records: any[] = [];
  let pageToken: string | undefined;
  do {
    const result = await readRecords('OxygenSaturation', {
      timeRangeFilter,
      pageSize: 1000,
      ...(pageToken ? { pageToken } : {}),
    });
    records.push(...result.records);
    pageToken = result.pageToken || undefined;
  } while (pageToken);

  return records;
}

async function readWorkoutRecords(
  granted: Permission[],
  timeRangeFilter: ReturnType<typeof getIstSnapshotRange>['timeRangeFilter'],
) {
  if (!hasReadPermission(granted, 'ExerciseSession'))
    return [] as HealthConnectWorkout[];
  const records: HealthConnectWorkout[] = [];
  let pageToken: string | undefined;
  do {
    const result = await readRecords('ExerciseSession', {
      timeRangeFilter,
      pageSize: 1000,
      ...(pageToken ? { pageToken } : {}),
    } as any);
    records.push(...(result.records as HealthConnectWorkout[]));
    pageToken = result.pageToken || undefined;
  } while (pageToken);
  return records;
}

function workoutActivityType(value: number) {
  if (value === ExerciseType.WALKING) return 'walking';
  if (value === ExerciseType.RUNNING) return 'running';
  if (value === ExerciseType.RUNNING_TREADMILL) return 'treadmill';
  if (value === ExerciseType.HIKING) return 'hiking';
  if (value === ExerciseType.BIKING || value === ExerciseType.BIKING_STATIONARY)
    return 'cycling';
  if (value === ExerciseType.YOGA) return 'yoga';
  if (
    value === ExerciseType.STRENGTH_TRAINING ||
    value === ExerciseType.WEIGHTLIFTING
  )
    return 'strength';
  if (
    value === ExerciseType.SWIMMING_OPEN_WATER ||
    value === ExerciseType.SWIMMING_POOL
  )
    return 'swimming';
  return 'other';
}

function makeWorkoutSnapshots(
  deviceId: string,
  workouts: HealthConnectWorkout[],
) {
  const records: SnapshotRecord[] = [];
  workouts.forEach(workout => {
    const start = Date.parse(workout.startTime);
    const end = Math.min(Date.parse(workout.endTime), Date.now());
    const id = workout.metadata?.id || workout.metadata?.clientRecordId;
    const origin = workout.metadata?.dataOrigin;
    if (
      !id ||
      !origin ||
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      end <= start
    )
      throw new Error('Invalid workout record.');
    let cursor = start;
    while (cursor < end) {
      const date = istDay(new Date(cursor));
      const midnight =
        Date.parse(`${shiftDateKey(date, 1)}T00:00:00.000Z`) - IST_OFFSET_MS;
      const segmentEnd = Math.min(end, midnight);
      if (segmentEnd <= cursor) break;
      records.push({
        metricType: 'workout',
        value: roundValue((segmentEnd - cursor) / 60_000, 2),
        unit: 'min',
        recordedAt: new Date(cursor).toISOString(),
        startTime: new Date(cursor).toISOString(),
        endTime: new Date(segmentEnd).toISOString(),
        source: SOURCE,
        dataOrigin: origin,
        recordingMethod: 'automatic',
        sourceRecordId: `health_connect:workout:${id}:${date}`.slice(0, 256),
        sourceVersion: 1,
        deviceId,
        metadata: { aggregation: 'session', origin },
        activityType: workoutActivityType(workout.exerciseType),
      } as SnapshotRecord);
      cursor = segmentEnd;
    }
  });
  return records;
}

function roundValue(value: number, places: number) {
  const multiplier = 10 ** places;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

function makeDailySnapshots(
  deviceId: string,
  dates: string[],
  granted: Permission[],
  groups: Record<string, AggregationGroup[]>,
  oxygenRecords: any[],
) {
  const dailyValues = new Map<
    string,
    {
      metricType: string;
      value: number;
      unit: string;
      dataOrigin: string;
      metadata?: Record<string, unknown>;
    }
  >();
  const keyOf = (date: string, metric: string) => `${date}|${metric}`;
  const put = (
    date: string,
    metricType: string,
    value: number,
    unit: string,
    places: number,
    metadata?: Record<string, unknown>,
    idMetric = metricType,
    dataOrigin = 'com.vitality',
  ) => {
    if (!Number.isFinite(value) || value < 0)
      throw new Error('Invalid Health Connect reading.');
    const normalizedValue = roundValue(value, places);
    const bounds = METRIC_BOUNDS[metricType];
    if (
      bounds &&
      (normalizedValue < bounds.min || normalizedValue > bounds.max)
    )
      throw new Error('Health Connect reading is outside the supported range.');
    dailyValues.set(keyOf(date, idMetric), {
      metricType,
      value: normalizedValue,
      unit,
      dataOrigin,
      ...(metadata ? { metadata } : {}),
    });
  };
  const originForGroup = (row?: AggregationGroup) =>
    [...(row?.result.dataOrigins || [])].sort()[0] || 'com.vitality';
  const groupByDate = (rows: AggregationGroup[]) => {
    const map = new Map<string, AggregationGroup>();
    rows.forEach(row => map.set(istDay(row.startTime), row));
    return map;
  };
  const groupsByDate = Object.fromEntries(
    Object.entries(groups).map(([metric, rows]) => [metric, groupByDate(rows)]),
  ) as Record<string, Map<string, AggregationGroup>>;
  const dailyTotalMetrics = [
    {
      recordType: 'Distance',
      metricType: 'distance',
      unit: 'km',
      places: 3,
      value: (row: AggregationGroup) => row.result.DISTANCE.inMeters / 1000,
    },
    {
      recordType: 'TotalCaloriesBurned',
      metricType: 'calories',
      unit: 'kcal',
      places: 1,
      value: (row: AggregationGroup) => row.result.ENERGY_TOTAL.inKilocalories,
    },
    {
      recordType: 'SleepSession',
      metricType: 'sleep',
      unit: 'min',
      places: 1,
      value: (row: AggregationGroup) => row.result.SLEEP_DURATION_TOTAL / 60,
    },
  ];

  dailyTotalMetrics.forEach(metric => {
    if (!hasReadPermission(granted, metric.recordType)) return;
    const rows = groupsByDate[metric.recordType] || new Map();
    dates.forEach(date => {
      const row = rows.get(date);
      // A zero snapshot clears a previous daily total after source records are removed.
      put(
        date,
        metric.metricType,
        row ? metric.value(row) : 0,
        metric.unit,
        metric.places,
        undefined,
        metric.metricType,
        originForGroup(row),
      );
    });
  });

  if (hasReadPermission(granted, 'HeartRate')) {
    const rows = groupsByDate.HeartRate || new Map();
    dates.forEach(date => {
      const row = rows.get(date);
      if (row && row.result.MEASUREMENTS_COUNT > 0) {
        put(
          date,
          'heart_rate',
          row.result.BPM_AVG,
          'bpm',
          1,
          {
            aggregation: 'daily_average',
            sampleCount: row.result.MEASUREMENTS_COUNT,
          },
          'heart_rate',
          originForGroup(row),
        );
      }
    });
  }

  if (hasReadPermission(granted, 'Weight')) {
    const rows = groupsByDate.Weight || new Map();
    dates.forEach(date => {
      const row = rows.get(date);
      if (row)
        put(
          date,
          'weight',
          row.result.WEIGHT_AVG.inKilograms,
          'kg',
          3,
          {
            aggregation: 'daily_average',
          },
          'weight',
          originForGroup(row),
        );
    });
  }

  if (hasReadPermission(granted, 'BloodPressure')) {
    const rows = groupsByDate.BloodPressure || new Map();
    dates.forEach(date => {
      const row = rows.get(date);
      if (!row) return;
      put(
        date,
        'blood_pressure',
        row.result.SYSTOLIC_AVG.inMillimetersOfMercury,
        'mmHg',
        1,
        { aggregation: 'daily_average', component: 'systolic' },
        'blood_pressure_systolic',
        originForGroup(row),
      );
      put(
        date,
        'blood_pressure',
        row.result.DIASTOLIC_AVG.inMillimetersOfMercury,
        'mmHg',
        1,
        { aggregation: 'daily_average', component: 'diastolic' },
        'blood_pressure_diastolic',
        originForGroup(row),
      );
    });
  }

  const oxygenByDate = new Map<
    string,
    { total: number; count: number; dataOrigins: Set<string> }
  >();
  oxygenRecords.forEach(record => {
    const date = istDay(record.time);
    const value = Number(record.percentage);
    if (!dates.includes(date)) return;
    if (!Number.isFinite(value) || value < 0)
      throw new Error('Invalid oxygen reading.');
    const normalized = value <= 1 ? value * 100 : value;
    if (normalized < 50 || normalized > 100)
      throw new Error('Invalid oxygen reading.');
    const current = oxygenByDate.get(date) || {
      total: 0,
      count: 0,
      dataOrigins: new Set<string>(),
    };
    current.total += normalized;
    current.count += 1;
    if (typeof record.metadata?.dataOrigin === 'string') {
      current.dataOrigins.add(record.metadata.dataOrigin);
    }
    oxygenByDate.set(date, current);
  });
  oxygenByDate.forEach((entry, date) => {
    put(
      date,
      'oxygen_saturation',
      entry.total / entry.count,
      '%',
      1,
      {
        aggregation: 'daily_average',
        sampleCount: entry.count,
      },
      'oxygen_saturation',
      [...entry.dataOrigins].sort()[0] || 'com.vitality',
    );
  });

  return Array.from(dailyValues.entries()).map(([key, daily]) => {
    const [date, metricKey] = key.split('|');
    const start = Date.parse(`${date}T00:00:00.000Z`) - IST_OFFSET_MS;
    const metricId = metricKey.replace(/_/g, ':');
    const durationMs =
      daily.metricType === 'workout'
        ? Math.max(1, Math.round(daily.value * 60_000))
        : 1;
    return {
      metricType: daily.metricType,
      value: daily.value,
      unit: daily.unit,
      recordedAt: new Date(start).toISOString(),
      startTime: new Date(start).toISOString(),
      endTime: new Date(start + durationMs).toISOString(),
      source: SOURCE,
      dataOrigin: daily.dataOrigin,
      recordingMethod: 'automatic',
      sourceRecordId: `health_connect:${metricId}:ist:${date}`,
      sourceVersion: 1,
      deviceId,
      metadata: {
        aggregation: 'daily',
        timezone: 'Asia/Kolkata',
        ...(daily.metadata || {}),
        origin: daily.dataOrigin,
      },
    } satisfies SnapshotRecord;
  });
}

async function applySnapshotVersions(
  records: SnapshotRecord[],
  userId: string,
  deviceId: string,
  dates: string[],
  readableMetrics: Set<string>,
) {
  const session = await readSession();
  if (session?.user?.id !== userId)
    throw new Error('Account changed. Please retry health sync.');

  const credentials = await Keychain.getGenericPassword({
    service: VERSION_STORE_SERVICE,
  });
  let versions: Record<string, SnapshotVersion> = {};
  if (credentials && credentials.username === userId) {
    try {
      const parsed: unknown = JSON.parse(credentials.password);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        versions = Object.fromEntries(
          Object.entries(parsed).filter(
            ([, entry]) =>
              entry &&
              typeof entry === 'object' &&
              typeof entry.fingerprint === 'string' &&
              Number.isSafeInteger(entry.sourceVersion) &&
              entry.sourceVersion > 0 &&
              Number.isFinite(entry.updatedAt),
          ),
        );
      }
    } catch {
      versions = {};
    }
  }

  const now = Date.now();
  const nextVersions: Record<string, SnapshotVersion> = Object.fromEntries(
    Object.entries(versions).filter(
      ([, entry]) => now - entry.updatedAt <= 35 * DAY_MS,
    ),
  );

  // Absence is a deletion only after a complete, successful read with permission.
  // Failed/revoked reads and dates outside the current read window preserve history.
  const present = new Set(records.map(record => record.sourceRecordId));
  for (const [id, previous] of Object.entries(versions)) {
    if (present.has(id)) continue;
    try {
      const old = JSON.parse(previous.fingerprint) as SnapshotRecord;
      if (
        old.deleted ||
        !readableMetrics.has(old.metricType) ||
        !dates.includes(istDay(old.recordedAt))
      )
        continue;
      // Daily totals have explicit zero snapshots; missing vital/session snapshots use tombstones.
      if (
        ![
          'heart_rate',
          'weight',
          'blood_pressure',
          'oxygen_saturation',
          'workout',
        ].includes(old.metricType)
      )
        continue;
      records.push({
        ...old,
        source: SOURCE,
        sourceRecordId: id,
        sourceVersion: previous.sourceVersion,
        deviceId,
        deleted: true,
      });
    } catch {
      /* Ignore an invalid local cache entry; never infer a deletion from it. */
    }
  }
  const changedRecords: SnapshotRecord[] = [];
  records.forEach(record => {
    const fingerprint = JSON.stringify({
      deviceId: record.deviceId,
      deleted: record.deleted || false,
      metricType: record.metricType,
      value: record.value,
      unit: record.unit,
      dataOrigin: record.dataOrigin,
      recordingMethod: record.recordingMethod,
      recordedAt: record.recordedAt,
      startTime: record.startTime,
      // Cumulative steps change only when their count or origin changes.
      endTime: record.metricType === 'steps' ? undefined : record.endTime,
      activityType: record.activityType,
      metadata: record.metadata,
    });
    const previous = versions[record.sourceRecordId];
    if (previous?.fingerprint === fingerprint) return;
    const sourceVersion = Math.max(now, (previous?.sourceVersion || 0) + 1);
    record.sourceVersion = sourceVersion;
    changedRecords.push(record);
    nextVersions[record.sourceRecordId] = {
      fingerprint,
      sourceVersion,
      updatedAt: now,
    };
  });

  return {
    changedRecords,
    save: () =>
      Keychain.setGenericPassword(userId, JSON.stringify(nextVersions), {
        service: VERSION_STORE_SERVICE,
        accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
      }),
  };
}

async function collectDailySnapshots(
  deviceId: string,
  days: number,
  userId: string,
) {
  const granted = (await getGrantedPermissions()).filter(
    (permission): permission is Permission =>
      'accessType' in permission && 'recordType' in permission,
  );
  if (!granted.some(permission => permission.accessType === 'read')) {
    throw new Error(
      'Allow Health Connect read permissions to sync your health data.',
    );
  }
  const range = getIstSnapshotRange(days);
  const aggregateTypes = [
    'Steps',
    'Distance',
    'TotalCaloriesBurned',
    'SleepSession',
    'HeartRate',
    'Weight',
    'BloodPressure',
  ];
  // Keep successful metrics even when an optional provider cannot read one type.
  const reads = await Promise.allSettled([
    ...aggregateTypes.map(type =>
      aggregateDaily(type, granted, range.timeRangeFilter),
    ),
    readOxygenRecords(granted, range.timeRangeFilter),
    readWorkoutRecords(granted, range.timeRangeFilter),
  ]);
  const readTypes = [...aggregateTypes, 'OxygenSaturation', 'ExerciseSession'];
  const failedMetrics = reads.flatMap((result, index) =>
    result.status === 'rejected' ? [readTypes[index]] : [],
  );
  const successfulPermissions = granted.filter(
    permission => !failedMetrics.includes(permission.recordType),
  );
  const values = reads.map(result =>
    result.status === 'fulfilled' ? result.value : [],
  );
  const aggregateResults = values.slice(
    0,
    aggregateTypes.length,
  ) as AggregationGroup[][];
  const oxygenRecords = values[aggregateTypes.length];
  const workoutRecords = values[
    aggregateTypes.length + 1
  ] as HealthConnectWorkout[];
  const groups = Object.fromEntries(
    aggregateTypes.map((type, index) => [type, aggregateResults[index]]),
  ) as Record<string, AggregationGroup[]>;
  const stepsByDate = new Map(
    (groups.Steps || []).map(group => [istDay(group.startTime), group]),
  );
  let stepSnapshots: SnapshotRecord[] = [];
  try {
    const rawDailySteps = hasReadPermission(successfulPermissions, 'Steps')
      ? range.dates.map(date => {
          const group = stepsByDate.get(date);
          const steps = Number(group?.result.COUNT_TOTAL ?? 0);
          if (!Number.isSafeInteger(steps) || steps < 0 || steps > 200_000) {
            throw new Error(`Invalid Health Connect step total for ${date}.`);
          }
          const dataOrigins = group?.result.dataOrigins || [];
          return {
            date,
            steps,
            dataOrigin: [...dataOrigins].sort()[0] || 'com.vitality',
            recordingMethod: 'automatic' as const,
            deviceId,
          };
        })
      : [];
    stepSnapshots = rawDailySteps.map(record => {
      const start = Date.parse(`${record.date}T00:00:00.000Z`) - IST_OFFSET_MS;
      return {
        metricType: 'steps',
        value: record.steps,
        unit: 'count',
        recordedAt: new Date(start).toISOString(),
        startTime: new Date(start).toISOString(),
        endTime: new Date(
          Math.max(start + 1, Math.min(start + DAY_MS, Date.now())),
        ).toISOString(),
        source: SOURCE,
        dataOrigin: 'com.vitality.aggregate',
        recordingMethod: 'automatic',
        sourceRecordId: `daily-steps:${record.date}:aggregate`.slice(0, 256),
        sourceVersion: 1,
        deviceId,
        metadata: {
          aggregation: 'daily_total',
          aggregationScope: 'health_connect',
          timezone: 'Asia/Kolkata',
        },
      };
    });
  } catch {
    stepSnapshots = [];
    if (!failedMetrics.includes('Steps')) failedMetrics.push('Steps');
  }
  const metricTypes: Record<string, string> = {
    Steps: 'steps',
    Distance: 'distance',
    TotalCaloriesBurned: 'calories',
    SleepSession: 'sleep',
    HeartRate: 'heart_rate',
    Weight: 'weight',
    BloodPressure: 'blood_pressure',
    OxygenSaturation: 'oxygen_saturation',
    ExerciseSession: 'workout',
  };
  const dailySnapshots: SnapshotRecord[] = [];
  for (const type of readTypes.filter(
    type => !['Steps', 'ExerciseSession'].includes(type),
  )) {
    try {
      dailySnapshots.push(
        ...makeDailySnapshots(
          deviceId,
          range.dates,
          successfulPermissions.filter(
            permission => permission.recordType === type,
          ),
          groups,
          type === 'OxygenSaturation' ? oxygenRecords : [],
        ),
      );
    } catch {
      if (!failedMetrics.includes(type)) failedMetrics.push(type);
    }
  }
  let workoutSnapshots: SnapshotRecord[] = [];
  try {
    workoutSnapshots = makeWorkoutSnapshots(deviceId, workoutRecords).filter(
      record => range.dates.includes(istDay(record.recordedAt)),
    );
  } catch {
    if (!failedMetrics.includes('ExerciseSession'))
      failedMetrics.push('ExerciseSession');
  }
  const activeMinuteSnapshots: SnapshotRecord[] = [];
  if (
    hasReadPermission(successfulPermissions, 'ExerciseSession') &&
    !failedMetrics.includes('ExerciseSession')
  ) {
    for (const date of range.dates) {
      const sessions = workoutSnapshots
        .filter(record => istDay(record.recordedAt) === date)
        .sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
      let coveredUntil = 0,
        duration = 0;
      for (const session of sessions) {
        const start = Date.parse(session.startTime),
          end = Date.parse(session.endTime);
        duration += Math.max(0, end - Math.max(start, coveredUntil));
        coveredUntil = Math.max(coveredUntil, end);
      }
      const start = Date.parse(`${date}T00:00:00+05:30`);
      activeMinuteSnapshots.push({
        metricType: 'active_minutes',
        value: roundValue(duration / 60000, 2),
        unit: 'min',
        recordedAt: new Date(start).toISOString(),
        startTime: new Date(start).toISOString(),
        endTime: new Date(start + 1).toISOString(),
        source: SOURCE,
        dataOrigin: 'com.vitality.aggregate',
        recordingMethod: 'automatic',
        sourceRecordId: `health_connect:active:minutes:ist:${date}`,
        sourceVersion: 1,
        deviceId,
        metadata: { aggregation: 'daily', timezone: 'Asia/Kolkata' },
      });
    }
  }
  const readableMetrics = new Set(
    successfulPermissions
      .filter(permission => !failedMetrics.includes(permission.recordType))
      .filter(permission => permission.accessType === 'read')
      .map(permission => metricTypes[permission.recordType])
      .filter(Boolean),
  );
  const versioned = await applySnapshotVersions(
    [
      ...dailySnapshots,
      ...activeMinuteSnapshots,
      ...workoutSnapshots,
      ...stepSnapshots,
    ],
    userId,
    deviceId,
    range.dates,
    readableMetrics,
  );
  return {
    records: versioned.changedRecords,
    failedMetrics,
    saveVersions: versioned.save,
  };
}

async function lastSuccessfulSyncAt(userId: string) {
  const credentials = await Keychain.getGenericPassword({
    service: LAST_SYNC_STORE_SERVICE,
  });
  if (!credentials || credentials.username !== userId) return 0;
  try {
    const watermark = JSON.parse(credentials.password) as SyncWatermark;
    return watermark.schemaVersion === 3 &&
      Number.isFinite(watermark.lastSuccessAt) &&
      watermark.lastSuccessAt > 0 &&
      watermark.lastSuccessAt <= Date.now()
      ? watermark.lastSuccessAt
      : 0;
  } catch {
    return 0;
  }
}

async function saveSuccessfulSyncAt(userId: string) {
  const watermark: SyncWatermark = {
    lastSuccessAt: Date.now(),
    schemaVersion: 3,
  };
  await Keychain.setGenericPassword(userId, JSON.stringify(watermark), {
    service: LAST_SYNC_STORE_SERVICE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
  });
}

async function uploadHealthBatch(batch: SnapshotRecord[], userId: string) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await authenticatedRequest<{
        created?: number;
        duplicates?: number;
      }>(
        'POST',
        API_ENDPOINTS.HEALTH.SYNC,
        { records: batch, includeRecords: false },
        60_000,
        userId,
      );
    } catch (error) {
      if (attempt > 0 || !isRetryableNetworkFailure(error)) throw error;
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
    }
  }
}

function isRetryableNetworkFailure(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    !error.response &&
    ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'].includes(error.code || '')
  );
}

export function syncRecentHealthData(
  options: { force?: boolean } = {},
): Promise<HealthSyncResult> {
  if (activeSync) {
    if (options.force && !activeSyncForced) {
      return activeSync.then(
        () => syncRecentHealthData(options),
        () => syncRecentHealthData(options),
      );
    }
    return activeSync;
  }
  activeSyncForced = Boolean(options.force);
  activeSync = (async () => {
    if (!(await ensureHealthConnectInitialized())) return emptySyncResult();
    const session = await readSession();
    const userId = session?.user?.id;
    if (!userId) throw new Error('Please sign in to sync health data.');
    if (
      !options.force &&
      Date.now() - (await lastSuccessfulSyncAt(userId)) < MIN_SYNC_INTERVAL_MS
    ) {
      return { ...emptySyncResult(), throttled: true };
    }
    const deviceId = await ensureHealthConnectDevice();
    const lastSync = await lastSuccessfulSyncAt(userId);
    // Backfill up to 30 days on first sync or after a gap; reread seven days for corrections.
    const days = Math.min(
      30,
      Math.max(
        SNAPSHOT_WINDOW_DAYS,
        lastSync ? Math.ceil((Date.now() - lastSync) / DAY_MS) + 1 : 30,
      ),
    );
    const { records, failedMetrics, saveVersions } =
      await collectDailySnapshots(deviceId, days, userId);
    let synced = 0;
    let created = 0;
    let duplicates = 0;
    for (let offset = 0; offset < records.length; offset += MAX_BATCH_SIZE) {
      const batch = records.slice(offset, offset + MAX_BATCH_SIZE);
      const result = await uploadHealthBatch(batch, userId);
      synced += batch.length;
      created += Number(result.created) || 0;
      duplicates += Number(result.duplicates) || 0;
    }
    if ((await readSession())?.user?.id !== userId)
      throw new Error('Account changed. Please retry health sync.');
    await saveVersions();
    if (!failedMetrics.length) await saveSuccessfulSyncAt(userId);
    DeviceEventEmitter.emit('activitySyncCompleted');
    return {
      synced,
      created,
      duplicates,
      ...(failedMetrics.length ? { failedMetrics } : {}),
    };
  })().finally(() => {
    activeSync = null;
    activeSyncForced = false;
  });
  return activeSync;
}
