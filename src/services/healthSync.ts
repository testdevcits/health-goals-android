import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {
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
const MAX_BATCH_SIZE = 100;
const SNAPSHOT_WINDOW_DAYS = 7;

let activeSync: Promise<HealthSyncResult> | null = null;

type SnapshotRecord = {
  metricType: string;
  value: number;
  unit: string;
  recordedAt: string;
  startTime: string;
  endTime: string;
  source: string;
  sourceRecordId: string;
  sourceVersion: number;
  deviceId: string;
  metadata: Record<string, unknown>;
};

type HealthSyncResult = {
  synced: number;
  created: number;
  duplicates: number;
};

type SnapshotVersion = {
  fingerprint: string;
  sourceVersion: number;
  updatedAt: number;
};

type AggregationGroup = {
  startTime: string;
  result: Record<string, any>;
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
  const dates = Array.from({ length: days }, (_, index) => shiftDateKey(firstDay, index));

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

async function aggregateDaily(type: string, granted: Permission[], timeRangeFilter: any) {
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
  const dailyValues = new Map<string, { metricType: string; value: number; unit: string; metadata?: Record<string, unknown> }>();
  const keyOf = (date: string, metric: string) => `${date}|${metric}`;
  const put = (
    date: string,
    metricType: string,
    value: number,
    unit: string,
    places: number,
    metadata?: Record<string, unknown>,
    idMetric = metricType,
  ) => {
    if (!Number.isFinite(value) || value < 0) return;
    dailyValues.set(keyOf(date, idMetric), {
      metricType,
      value: roundValue(value, places),
      unit,
      ...(metadata ? { metadata } : {}),
    });
  };
  const groupByDate = (rows: AggregationGroup[]) => {
    const map = new Map<string, AggregationGroup>();
    rows.forEach(row => map.set(istDay(row.startTime), row));
    return map;
  };
  const groupsByDate = Object.fromEntries(
    Object.entries(groups).map(([metric, rows]) => [metric, groupByDate(rows)]),
  ) as Record<string, Map<string, AggregationGroup>>;
  const dailyTotalMetrics = [
    { recordType: 'Steps', metricType: 'steps', unit: 'count', places: 0, value: (row: AggregationGroup) => row.result.COUNT_TOTAL },
    { recordType: 'Distance', metricType: 'distance', unit: 'km', places: 3, value: (row: AggregationGroup) => row.result.DISTANCE.inMeters / 1000 },
    { recordType: 'TotalCaloriesBurned', metricType: 'calories', unit: 'kcal', places: 1, value: (row: AggregationGroup) => row.result.ENERGY_TOTAL.inKilocalories },
    { recordType: 'ExerciseSession', metricType: 'workout', unit: 'min', places: 1, value: (row: AggregationGroup) => row.result.EXERCISE_DURATION_TOTAL.inSeconds / 60 },
    { recordType: 'SleepSession', metricType: 'sleep', unit: 'min', places: 1, value: (row: AggregationGroup) => row.result.SLEEP_DURATION_TOTAL / 60 },
  ];

  dailyTotalMetrics.forEach(metric => {
    if (!hasReadPermission(granted, metric.recordType)) return;
    const rows = groupsByDate[metric.recordType] || new Map();
    dates.forEach(date => {
      const row = rows.get(date);
      // A zero snapshot clears a previous daily total after source records are removed.
      put(date, metric.metricType, row ? metric.value(row) : 0, metric.unit, metric.places);
    });
  });

  if (hasReadPermission(granted, 'HeartRate')) {
    const rows = groupsByDate.HeartRate || new Map();
    dates.forEach(date => {
      const row = rows.get(date);
      if (row && row.result.MEASUREMENTS_COUNT > 0) {
        put(date, 'heart_rate', row.result.BPM_AVG, 'bpm', 1, { aggregation: 'daily_average' });
      }
    });
  }

  if (hasReadPermission(granted, 'Weight')) {
    const rows = groupsByDate.Weight || new Map();
    dates.forEach(date => {
      const row = rows.get(date);
      if (row) put(date, 'weight', row.result.WEIGHT_AVG.inKilograms, 'kg', 3, { aggregation: 'daily_average' });
    });
  }

  if (hasReadPermission(granted, 'BloodPressure')) {
    const rows = groupsByDate.BloodPressure || new Map();
    dates.forEach(date => {
      const row = rows.get(date);
      if (!row) return;
      put(date, 'blood_pressure', row.result.SYSTOLIC_AVG.inMillimetersOfMercury, 'mmHg', 1, { aggregation: 'daily_average', component: 'systolic' }, 'blood_pressure_systolic');
      put(date, 'blood_pressure', row.result.DIASTOLIC_AVG.inMillimetersOfMercury, 'mmHg', 1, { aggregation: 'daily_average', component: 'diastolic' }, 'blood_pressure_diastolic');
    });
  }

  const oxygenByDate = new Map<string, { total: number; count: number }>();
  oxygenRecords.forEach(record => {
    const date = istDay(record.time);
    const value = Number(record.percentage);
    if (!dates.includes(date) || !Number.isFinite(value) || value < 0) return;
    const normalized = value <= 1 ? value * 100 : value;
    const current = oxygenByDate.get(date) || { total: 0, count: 0 };
    current.total += normalized;
    current.count += 1;
    oxygenByDate.set(date, current);
  });
  oxygenByDate.forEach((entry, date) => {
    put(date, 'oxygen_saturation', entry.total / entry.count, '%', 1, { aggregation: 'daily_average' });
  });

  return Array.from(dailyValues.entries()).map(([key, daily]) => {
    const [date, metricKey] = key.split('|');
    const start = Date.parse(`${date}T00:00:00.000Z`) - IST_OFFSET_MS;
    const metricId = metricKey.replace(/_/g, ':');
    return {
      metricType: daily.metricType,
      value: daily.value,
      unit: daily.unit,
      recordedAt: new Date(start).toISOString(),
      startTime: new Date(start).toISOString(),
      endTime: new Date(start + DAY_MS).toISOString(),
      source: SOURCE,
      sourceRecordId: `health_connect:${metricId}:ist:${date}`,
      sourceVersion: 1,
      deviceId,
      metadata: { aggregation: 'daily', timezone: 'Asia/Kolkata', ...(daily.metadata || {}) },
    } satisfies SnapshotRecord;
  });
}

async function applySnapshotVersions(records: SnapshotRecord[]) {
  const session = await readSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Please sign in to sync health data.');

  const credentials = await Keychain.getGenericPassword({ service: VERSION_STORE_SERVICE });
  let versions: Record<string, SnapshotVersion> = {};
  if (credentials && credentials.username === userId) {
    try {
      versions = JSON.parse(credentials.password) as Record<string, SnapshotVersion>;
    } catch {
      versions = {};
    }
  }

  const now = Date.now();
  const nextVersions: Record<string, SnapshotVersion> = Object.fromEntries(
    Object.entries(versions).filter(([, entry]) => now - entry.updatedAt <= 14 * DAY_MS),
  );

  records.forEach(record => {
    const fingerprint = JSON.stringify({
      metricType: record.metricType,
      value: record.value,
      unit: record.unit,
      recordedAt: record.recordedAt,
      metadata: record.metadata,
    });
    const previous = versions[record.sourceRecordId];
    const sourceVersion = previous
      ? previous.fingerprint === fingerprint ? previous.sourceVersion : previous.sourceVersion + 1
      : now;
    record.sourceVersion = sourceVersion;
    nextVersions[record.sourceRecordId] = { fingerprint, sourceVersion, updatedAt: now };
  });

  await Keychain.setGenericPassword(userId, JSON.stringify(nextVersions), {
    service: VERSION_STORE_SERVICE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
  });
  return records;
}

async function collectDailySnapshots(deviceId: string) {
  const granted = (await getGrantedPermissions()).filter(
    (permission): permission is Permission => 'accessType' in permission && 'recordType' in permission,
  );
  const range = getIstSnapshotRange(SNAPSHOT_WINDOW_DAYS);
  const aggregateTypes = [
    'Steps',
    'Distance',
    'TotalCaloriesBurned',
    'ExerciseSession',
    'SleepSession',
    'HeartRate',
    'Weight',
    'BloodPressure',
  ];
  const [aggregateResults, oxygenRecords] = await Promise.all([
    Promise.all(aggregateTypes.map(type => aggregateDaily(type, granted, range.timeRangeFilter))),
    readOxygenRecords(granted, range.timeRangeFilter),
  ]);
  const groups = Object.fromEntries(
    aggregateTypes.map((type, index) => [type, aggregateResults[index]]),
  ) as Record<string, AggregationGroup[]>;
  return applySnapshotVersions(
    makeDailySnapshots(deviceId, range.dates, granted, groups, oxygenRecords),
  );
}

async function uploadHealthBatch(batch: SnapshotRecord[]) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await authenticatedRequest<{ created?: number; duplicates?: number }>(
        'POST', '/health/sync', { records: batch }, 60_000,
      );
    } catch (error) {
      const retryableNetworkFailure = axios.isAxiosError(error)
        && !error.response
        && ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'].includes(error.code || '');
      if (attempt > 0 || !retryableNetworkFailure) throw error;
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
    }
  }
}

export function syncRecentHealthData(): Promise<HealthSyncResult> {
  if (activeSync) return activeSync;
  activeSync = (async () => {
    if (!(await ensureHealthConnectInitialized())) return emptySyncResult();
    const deviceId = await ensureHealthConnectDevice();
    const records = await collectDailySnapshots(deviceId);
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
    return { synced, created, duplicates };
  })().finally(() => { activeSync = null; });
  return activeSync;
}
