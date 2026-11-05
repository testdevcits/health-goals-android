import axios from 'axios';
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
};

type HealthSyncResult = {
  synced: number;
  created: number;
  duplicates: number;
  throttled?: boolean;
};

type DailyStepsUpload = {
  date: string;
  steps: number;
  dataOrigin: string;
  recordingMethod: 'automatic';
  deviceId: string;
};

type SnapshotVersion = {
  fingerprint: string;
  sourceVersion: number;
  updatedAt: number;
};

type SyncWatermark = { lastSuccessAt: number };

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
  if (!hasReadPermission(granted, 'ExerciseSession')) return [] as HealthConnectWorkout[];
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
  if (value === ExerciseType.BIKING || value === ExerciseType.BIKING_STATIONARY) return 'cycling';
  if (value === ExerciseType.YOGA) return 'yoga';
  if (value === ExerciseType.STRENGTH_TRAINING || value === ExerciseType.WEIGHTLIFTING) return 'strength';
  if (value === ExerciseType.SWIMMING_OPEN_WATER || value === ExerciseType.SWIMMING_POOL) return 'swimming';
  return 'other';
}

function makeWorkoutSnapshots(deviceId: string, workouts: HealthConnectWorkout[]) {
  const records: SnapshotRecord[] = [];
  workouts.forEach(workout => {
    const start = Date.parse(workout.startTime);
    const end = Math.min(Date.parse(workout.endTime), Date.now());
    const id = workout.metadata?.clientRecordId || workout.metadata?.id;
    const origin = workout.metadata?.dataOrigin;
    if (!id || !origin || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return;
    let cursor = start;
    while (cursor < end) {
      const date = istDay(new Date(cursor));
      const midnight = Date.parse(`${shiftDateKey(date, 1)}T00:00:00.000Z`) - IST_OFFSET_MS;
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
    if (!Number.isFinite(value) || value < 0) return;
    const normalizedValue = roundValue(value, places);
    const bounds = METRIC_BOUNDS[metricType];
    if (bounds && (normalizedValue < bounds.min || normalizedValue > bounds.max)) return;
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
    if (!dates.includes(date) || !Number.isFinite(value) || value < 0) return;
    const normalized = value <= 1 ? value * 100 : value;
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
      },
      'oxygen_saturation',
      [...entry.dataOrigins].sort()[0] || 'com.vitality',
    );
  });

  return Array.from(dailyValues.entries()).map(([key, daily]) => {
    const [date, metricKey] = key.split('|');
    const start = Date.parse(`${date}T00:00:00.000Z`) - IST_OFFSET_MS;
    const metricId = metricKey.replace(/_/g, ':');
    const durationMs = daily.metricType === 'workout'
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

async function applySnapshotVersions(records: SnapshotRecord[]) {
  const session = await readSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Please sign in to sync health data.');

  const credentials = await Keychain.getGenericPassword({
    service: VERSION_STORE_SERVICE,
  });
  let versions: Record<string, SnapshotVersion> = {};
  if (credentials && credentials.username === userId) {
    try {
      versions = JSON.parse(credentials.password) as Record<
        string,
        SnapshotVersion
      >;
    } catch {
      versions = {};
    }
  }

  const now = Date.now();
  const nextVersions: Record<string, SnapshotVersion> = Object.fromEntries(
    Object.entries(versions).filter(
      ([, entry]) => now - entry.updatedAt <= 14 * DAY_MS,
    ),
  );

  const changedRecords: SnapshotRecord[] = [];
  records.forEach(record => {
    const fingerprint = JSON.stringify({
      metricType: record.metricType,
      value: record.value,
      unit: record.unit,
      dataOrigin: record.dataOrigin,
      recordingMethod: record.recordingMethod,
      recordedAt: record.recordedAt,
      startTime: record.startTime,
      endTime: record.endTime,
      activityType: record.activityType,
      metadata: record.metadata,
    });
    const previous = versions[record.sourceRecordId];
    if (previous?.fingerprint === fingerprint) return;
    const sourceVersion = previous ? previous.sourceVersion + 1 : now;
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
    save: () => Keychain.setGenericPassword(userId, JSON.stringify(nextVersions), {
      service: VERSION_STORE_SERVICE,
      accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
    }),
  };
}

async function collectDailySnapshots(deviceId: string) {
  const granted = (await getGrantedPermissions()).filter(
    (permission): permission is Permission =>
      'accessType' in permission && 'recordType' in permission,
  );
  const range = getIstSnapshotRange(SNAPSHOT_WINDOW_DAYS);
  const aggregateTypes = [
    'Steps',
    'Distance',
    'TotalCaloriesBurned',
    'SleepSession',
    'HeartRate',
    'Weight',
    'BloodPressure',
  ];
  const [aggregateResults, oxygenRecords, workoutRecords] = await Promise.all([
    Promise.all(
      aggregateTypes.map(type =>
        aggregateDaily(type, granted, range.timeRangeFilter),
      ),
    ),
    readOxygenRecords(granted, range.timeRangeFilter),
    readWorkoutRecords(granted, range.timeRangeFilter),
  ]);
  const groups = Object.fromEntries(
    aggregateTypes.map((type, index) => [type, aggregateResults[index]]),
  ) as Record<string, AggregationGroup[]>;
  const stepsByDate = new Map(
    (groups.Steps || []).map(group => [istDay(group.startTime), group]),
  );
  const rawDailySteps = hasReadPermission(granted, 'Steps')
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
  const stepSnapshots: SnapshotRecord[] = rawDailySteps.map(record => {
    const start = Date.parse(`${record.date}T00:00:00.000Z`) - IST_OFFSET_MS;
    return {
      metricType: 'steps', value: record.steps, unit: 'count',
      recordedAt: new Date(start).toISOString(), startTime: new Date(start).toISOString(),
      endTime: new Date(start + 1).toISOString(), source: SOURCE,
      dataOrigin: record.dataOrigin, recordingMethod: 'automatic',
      sourceRecordId: `health_connect:steps:ist:${record.date}:${record.dataOrigin}`.slice(0, 256),
      sourceVersion: 1, deviceId, metadata: { aggregation: 'daily', timezone: 'Asia/Kolkata' },
    };
  });
  const versioned = await applySnapshotVersions([
    ...makeDailySnapshots(deviceId, range.dates, granted, groups, oxygenRecords),
    ...makeWorkoutSnapshots(deviceId, workoutRecords),
    ...stepSnapshots,
  ]);
  const changedStepIds = new Set(versioned.changedRecords.filter(record => record.metricType === 'steps').map(record => record.sourceRecordId));
  const dailySteps = rawDailySteps.filter(record => changedStepIds.has(`health_connect:steps:ist:${record.date}:${record.dataOrigin}`.slice(0, 256)));
  return {
    records: versioned.changedRecords.filter(record => record.metricType !== 'steps'),
    dailySteps,
    saveVersions: versioned.save,
  };
}

async function lastSuccessfulSyncAt(userId: string) {
  const credentials = await Keychain.getGenericPassword({ service: LAST_SYNC_STORE_SERVICE });
  if (!credentials || credentials.username !== userId) return 0;
  try { return (JSON.parse(credentials.password) as SyncWatermark).lastSuccessAt || 0; }
  catch { return 0; }
}

async function saveSuccessfulSyncAt(userId: string) {
  const watermark: SyncWatermark = { lastSuccessAt: Date.now() };
  await Keychain.setGenericPassword(userId, JSON.stringify(watermark), {
    service: LAST_SYNC_STORE_SERVICE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
  });
}

async function uploadHealthBatch(batch: SnapshotRecord[]) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await authenticatedRequest<{
        created?: number;
        duplicates?: number;
      }>('POST', '/health/sync', { records: batch, includeRecords: false }, 60_000);
    } catch (error) {
      if (attempt > 0 || !isRetryableNetworkFailure(error)) throw error;
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
    }
  }
}

function isRetryableNetworkFailure(error: unknown) {
  return axios.isAxiosError(error) && !error.response &&
    ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'].includes(error.code || '');
}

async function uploadDailySteps(records: DailyStepsUpload[]) {
  const result = { created: 0, duplicates: 0 };
  for (const record of records) {
    let response;
    for (let attempt = 0; ; attempt += 1) {
      try {
        response = await authenticatedRequest<{
          duplicate?: boolean;
          updated?: boolean;
        }>('POST', '/health/steps/daily', record);
        break;
      } catch (error) {
        if (attempt > 0 || !isRetryableNetworkFailure(error)) throw error;
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      }
    }
    if (response.duplicate) result.duplicates += 1;
    else if (!response.updated) result.created += 1;
  }
  return result;
}

export function syncRecentHealthData(options: { force?: boolean } = {}): Promise<HealthSyncResult> {
  if (activeSync) {
    if (options.force && !activeSyncForced) {
      return activeSync.then(() => syncRecentHealthData(options));
    }
    return activeSync;
  }
  activeSyncForced = Boolean(options.force);
  activeSync = (async () => {
    if (!(await ensureHealthConnectInitialized())) return emptySyncResult();
    const session = await readSession();
    const userId = session?.user?.id;
    if (!userId) throw new Error('Please sign in to sync health data.');
    if (!options.force && Date.now() - await lastSuccessfulSyncAt(userId) < MIN_SYNC_INTERVAL_MS) {
      return { ...emptySyncResult(), throttled: true };
    }
    const deviceId = await ensureHealthConnectDevice();
    const { records, dailySteps, saveVersions } = await collectDailySnapshots(deviceId);
    let synced = 0;
    let created = 0;
    let duplicates = 0;
    for (let offset = 0; offset < records.length; offset += MAX_BATCH_SIZE) {
      const batch = records.slice(offset, offset + MAX_BATCH_SIZE);
      const result = await uploadHealthBatch(batch);
      synced += batch.length;
      created += Number(result.created) || 0;
      duplicates += Number(result.duplicates) || 0;
    }
    const stepResult = await uploadDailySteps(dailySteps);
    created += stepResult.created;
    duplicates += stepResult.duplicates;
    await saveVersions();
    await saveSuccessfulSyncAt(userId);
    synced += dailySteps.length;
    return { synced, created, duplicates };
  })().finally(() => {
    activeSync = null;
    activeSyncForced = false;
  });
  return activeSync;
}
