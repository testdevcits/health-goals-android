import {
  ExerciseType,
  getGrantedPermissions,
  readRecords,
  RecordingMethod,
} from 'react-native-health-connect';
import type { Permission } from 'react-native-health-connect';
import { authenticatedRequest } from './authenticatedApi';
import { ensureHealthConnectDevice } from './devices';
import { ensureHealthConnectInitialized } from './healthConnect';

const OFFSET_MS = 330 * 60 * 1000;
const SOURCE = 'health_connect';
let activeSync: Promise<HealthSyncResult> | null = null;
let lastSuccessfulSync = 0;

const WALKING_TYPES = new Set<number>([ExerciseType.WALKING]);
const RUNNING_TYPES = new Set<number>([ExerciseType.RUNNING]);
const TREADMILL_TYPES = new Set<number>([ExerciseType.RUNNING_TREADMILL]);
const HIKING_TYPES = new Set<number>([ExerciseType.HIKING]);
const CYCLING_TYPES = new Set<number>([
  ExerciseType.BIKING,
  ExerciseType.BIKING_STATIONARY,
]);
const YOGA_TYPES = new Set<number>([ExerciseType.YOGA]);
const STRENGTH_TYPES = new Set<number>([
  ExerciseType.STRENGTH_TRAINING,
  ExerciseType.WEIGHTLIFTING,
]);
const SWIMMING_TYPES = new Set<number>([
  ExerciseType.SWIMMING_OPEN_WATER,
  ExerciseType.SWIMMING_POOL,
]);

type RecordType =
  | 'Steps'
  | 'Distance'
  | 'TotalCaloriesBurned'
  | 'ExerciseSession'
  | 'SleepSession'
  | 'HeartRate'
  | 'Weight'
  | 'OxygenSaturation'
  | 'BloodPressure';

type ApiRecord = {
  metricType: string;
  value: number;
  unit: string;
  recordedAt: string;
  source: string;
  sourceRecordId: string;
  sourceVersion: number;
  dataOrigin?: string;
  recordingMethod?: 'automatic' | 'active' | 'manual';
  startTime?: string;
  endTime?: string;
  activityType?: string;
  deviceId: string;
  metadata: Record<string, unknown>;
};

const hasPermission = (granted: Permission[], type: string) =>
  granted.some(row => row.accessType === 'read' && row.recordType === type);

function istDay(time: string | Date) {
  return new Date(new Date(time).getTime() + OFFSET_MS).toISOString().slice(0, 10);
}

function sourceIdentity(recordType: string, record: any) {
  const origin = record.metadata?.dataOrigin;
  const id = record.metadata?.clientRecordId || record.metadata?.id;
  if (!id) return null;
  return `${recordType}:${origin || 'unknown'}:${id}`.slice(0, 256);
}

function versionOf(record: any) {
  const clientVersion = Number(record.metadata?.clientRecordVersion);
  if (Number.isSafeInteger(clientVersion) && clientVersion > 0) return clientVersion;
  const modified = Date.parse(record.metadata?.lastModifiedTime || '');
  return Number.isSafeInteger(modified) && modified > 0 ? modified : 1;
}

function recordingMethodOf(record: any): ApiRecord['recordingMethod'] {
  switch (record.metadata?.recordingMethod) {
    case RecordingMethod.RECORDING_METHOD_AUTOMATICALLY_RECORDED: return 'automatic';
    case RecordingMethod.RECORDING_METHOD_ACTIVELY_RECORDED: return 'active';
    default: return 'manual';
  }
}

function baseRecord(
  recordType: string,
  record: any,
  deviceId: string,
  metricType: string,
  value: number,
  unit: string,
  recordedAt: string,
): ApiRecord | null {
  if (!Number.isFinite(value) || value < 0) return null;
  const sourceRecordId = sourceIdentity(recordType, record);
  if (!sourceRecordId) return null;
  return {
    metricType, value, unit, recordedAt,
    source: SOURCE,
    sourceRecordId,
    sourceVersion: versionOf(record),
    dataOrigin: record.metadata?.dataOrigin || 'unknown',
    recordingMethod: recordingMethodOf(record),
    deviceId,
    metadata: { origin: record.metadata?.dataOrigin || null },
  };
}

function splitInterval(
  base: ApiRecord,
  startTime: string,
  endTime: string,
  splitSteps: boolean,
): ApiRecord[] {
  const start = Date.parse(startTime);
  const end = Date.parse(endTime);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];
  const segments: ApiRecord[] = [];
  let cursor = start;
  let remaining = base.value;
  const duration = end - start;
  while (cursor < end && segments.length < 8) {
    const day = istDay(new Date(cursor));
    const nextMidnight = Date.parse(`${day}T00:00:00.000Z`) + 86400000 - OFFSET_MS;
    const segmentEnd = Math.min(end, nextMidnight);
    const portion = segmentEnd - cursor;
    const value = segmentEnd === end
      ? remaining
      : splitSteps
      ? Math.floor(base.value * portion / duration)
      : Math.max(0, portion / 60000);
    remaining -= value;
    segments.push({
      ...base,
      value,
      recordedAt: new Date(cursor).toISOString(),
      startTime: new Date(cursor).toISOString(),
      endTime: new Date(segmentEnd).toISOString(),
      sourceRecordId: `${base.sourceRecordId}:${day}`.slice(0, 256),
    });
    cursor = segmentEnd;
  }
  return segments;
}

function kcal(energy: any) {
  if (!energy) return NaN;
  if (Number.isFinite(energy.inKilocalories)) return energy.inKilocalories;
  if (!Number.isFinite(energy.value)) return NaN;
  switch (energy.unit) {
    case 'calories': return energy.value / 1000;
    case 'joules': return energy.value / 4184;
    case 'kilojoules': return energy.value / 4.184;
    default: return energy.value;
  }
}

function kilograms(mass: any) {
  if (!mass) return NaN;
  if (Number.isFinite(mass.inKilograms)) return mass.inKilograms;
  if (!Number.isFinite(mass.value)) return NaN;
  switch (mass.unit) {
    case 'grams': return mass.value / 1000;
    case 'milligrams': return mass.value / 1000000;
    case 'micrograms': return mass.value / 1000000000;
    case 'pounds': return mass.value * 0.45359237;
    case 'ounces': return mass.value * 0.0283495231;
    default: return mass.value;
  }
}

function workoutType(exerciseType: number) {
  if (WALKING_TYPES.has(exerciseType)) return 'walking';
  if (RUNNING_TYPES.has(exerciseType)) return 'running';
  if (TREADMILL_TYPES.has(exerciseType)) return 'treadmill';
  if (HIKING_TYPES.has(exerciseType)) return 'hiking';
  if (CYCLING_TYPES.has(exerciseType)) return 'cycling';
  if (YOGA_TYPES.has(exerciseType)) return 'yoga';
  if (STRENGTH_TYPES.has(exerciseType)) return 'strength';
  if (SWIMMING_TYPES.has(exerciseType)) return 'swimming';
  return 'other';
}

async function readType(type: RecordType, granted: Permission[], range: any) {
  if (!hasPermission(granted, type)) return [] as any[];
  const records: any[] = [];
  let pageToken: string | undefined;

  do {
    const result = await readRecords(type as any, {
      timeRangeFilter: range,
      pageSize: 1000,
      ...(pageToken ? { pageToken } : {}),
    } as any);
    records.push(...result.records);
    pageToken = result.pageToken;
  } while (pageToken);

  return records;
}

async function collectRecords(deviceId: string) {
  const granted = (await getGrantedPermissions()).filter(
    (permission): permission is Permission => 'accessType' in permission && 'recordType' in permission,
  );
  const now = Date.now();
  const range = {
    operator: 'between' as const,
    startTime: new Date(now - 7 * 86400000).toISOString(),
    endTime: new Date(now).toISOString(),
  };
  const types: RecordType[] = ['Steps', 'Distance', 'TotalCaloriesBurned', 'ExerciseSession', 'SleepSession', 'HeartRate', 'Weight', 'OxygenSaturation', 'BloodPressure'];
  const groups = await Promise.all(types.map(type => readType(type, granted, range)));
  const records: ApiRecord[] = [];
  const add = (record?: ApiRecord | null) => { if (record && records.length < 1000) records.push(record); };

  for (const row of groups[0]) {
    // Do not submit unaffiliated step totals that cannot be traced to a Health Connect source.
    if (!row.metadata?.dataOrigin || !Number.isSafeInteger(Number(row.count)) || row.count < 0) continue;
    const base = baseRecord('Steps', row, deviceId, 'steps', row.count, 'count', row.startTime);
    if (base) records.push(...splitInterval(base, row.startTime, row.endTime, true));
  }
  for (const row of groups[1]) {
    const base = baseRecord('Distance', row, deviceId, 'distance', row.distance?.inMeters / 1000, 'km', row.startTime);
    add(base);
  }
  for (const row of groups[2]) {
    const base = baseRecord('TotalCaloriesBurned', row, deviceId, 'calories', kcal(row.energy), 'kcal', row.startTime);
    add(base);
  }
  for (const row of groups[3]) {
    const base = baseRecord('ExerciseSession', row, deviceId, 'workout', (Date.parse(row.endTime) - Date.parse(row.startTime)) / 60000, 'min', row.startTime);
    if (base) {
      base.activityType = workoutType(row.exerciseType);
      records.push(...splitInterval(base, row.startTime, row.endTime, false));
    }
  }
  for (const row of groups[4]) {
    const duration = (Date.parse(row.endTime) - Date.parse(row.startTime)) / 60000;
    add(baseRecord('SleepSession', row, deviceId, 'sleep', duration, 'min', row.startTime));
  }
  for (const row of groups[5]) {
    const id = sourceIdentity('HeartRate', row);
    if (!id || !Array.isArray(row.samples)) continue;
    for (const [index, sample] of row.samples.entries()) {
      const base = baseRecord('HeartRate', row, deviceId, 'heart_rate', sample.beatsPerMinute, 'bpm', sample.time);
      if (base) add({ ...base, sourceRecordId: `${id}:${sample.time || index}`.slice(0, 256) });
    }
  }
  for (const row of groups[6]) {
    add(baseRecord('Weight', row, deviceId, 'weight', kilograms(row.weight), 'kg', row.time));
  }
  for (const row of groups[7]) {
    const raw = Number(row.percentage);
    add(baseRecord('OxygenSaturation', row, deviceId, 'oxygen_saturation', raw <= 1 ? raw * 100 : raw, '%', row.time));
  }
  for (const row of groups[8]) {
    const systolic = row.systolic?.inMillimetersOfMercury ?? row.systolic?.value;
    const diastolic = row.diastolic?.inMillimetersOfMercury ?? row.diastolic?.value;
    const base = baseRecord('BloodPressure', row, deviceId, 'blood_pressure', systolic, 'mmHg', row.time);
    if (base) {
      add({ ...base, sourceRecordId: `${base.sourceRecordId}:systolic` });
      add({ ...base, value: diastolic, sourceRecordId: `${base.sourceRecordId}:diastolic` });
    }
  }

  return records
    .filter(record => Number.isFinite(record.value) && record.value >= 0)
    .sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt))
    .slice(-1000);
}

type HealthSyncResult = { synced: number; created: number; duplicates: number };

const emptySyncResult = (): HealthSyncResult => ({ synced: 0, created: 0, duplicates: 0 });

export function syncRecentHealthData(force = false): Promise<HealthSyncResult> {
  if (activeSync) return activeSync;
  if (!force && Date.now() - lastSuccessfulSync < 30000) return Promise.resolve(emptySyncResult());
  activeSync = (async () => {
    if (!(await ensureHealthConnectInitialized())) return emptySyncResult();
    const deviceId = await ensureHealthConnectDevice();
    const records = await collectRecords(deviceId);
    let synced = 0;
    let created = 0;
    let duplicates = 0;
    for (let offset = 0; offset < records.length; offset += 100) {
      const batch = records.slice(offset, offset + 100);
      const result = await authenticatedRequest<{ created?: number; duplicates?: number }>(
        'POST', '/health/sync', { records: batch },
      );
      synced += batch.length;
      created += Number(result.created) || 0;
      duplicates += Number(result.duplicates) || 0;
    }
    lastSuccessfulSync = Date.now();
    return { synced, created, duplicates };
  })().finally(() => { activeSync = null; });
  return activeSync;
}
