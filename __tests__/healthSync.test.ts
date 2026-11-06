import { syncRecentHealthData } from '../src/services/healthSync';
import {
  aggregateGroupByDuration,
  getGrantedPermissions,
  readRecords,
} from 'react-native-health-connect';
import { authenticatedRequest } from '../src/services/authenticatedApi';

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn().mockResolvedValue(false),
  setGenericPassword: jest.fn().mockResolvedValue(true),
  ACCESSIBLE: { AFTER_FIRST_UNLOCK: 'unlocked' },
}));
jest.mock('react-native-health-connect', () => ({
  ExerciseType: {},
  getGrantedPermissions: jest.fn(),
  aggregateGroupByDuration: jest.fn(),
  readRecords: jest.fn().mockResolvedValue({ records: [] }),
}));
jest.mock('../src/services/authenticatedApi', () => ({
  authenticatedRequest: jest
    .fn()
    .mockResolvedValue({ created: 1, duplicates: 0 }),
}));
jest.mock('../src/services/devices', () => ({
  ensureHealthConnectDevice: jest.fn().mockResolvedValue('device'),
}));
jest.mock('../src/services/healthConnect', () => ({
  ensureHealthConnectInitialized: jest.fn().mockResolvedValue(true),
}));
jest.mock('../src/services/auth', () => ({
  readSession: jest.fn().mockResolvedValue({ user: { id: 'user' } }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  const keychain = require('react-native-keychain');
  keychain.getGenericPassword.mockResolvedValue(false);
  keychain.setGenericPassword.mockResolvedValue(true);
  (readRecords as jest.Mock).mockResolvedValue({ records: [] });
  (authenticatedRequest as jest.Mock).mockResolvedValue({
    created: 1,
    duplicates: 0,
  });
  require('../src/services/auth').readSession.mockResolvedValue({
    user: { id: 'user' },
  });
});
test('backfills IST days and uploads compact steps with metrics in one request', async () => {
  (getGrantedPermissions as jest.Mock).mockResolvedValue([
    { accessType: 'read', recordType: 'Steps' },
  ]);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(
    async ({ timeRangeFilter }) => [
      {
        startTime: timeRangeFilter.startTime,
        result: { COUNT_TOTAL: 4321, dataOrigins: ['phone'] },
      },
    ],
  );
  const result = await syncRecentHealthData({ force: true });
  expect(result.synced).toBe(30);
  expect(authenticatedRequest).toHaveBeenCalledTimes(1);
  const [method, path, payload] = (authenticatedRequest as jest.Mock).mock
    .calls[0];
  expect([method, path]).toEqual(['POST', '/health/sync']);
  expect(payload.includeRecords).toBe(false);
  expect(payload.records[0]).toMatchObject({
    metricType: 'steps',
    value: 4321,
  });
  expect(payload.records[0].sourceRecordId).toMatch(
    /^daily-steps:\d{4}-\d{2}-\d{2}:aggregate$/,
  );
  expect(payload.records[0].recordedAt).toMatch(/T18:30:00.000Z$/);
});
test('failed optional read does not erase totals or block steps', async () => {
  (getGrantedPermissions as jest.Mock).mockResolvedValue(
    ['Steps', 'Distance'].map(recordType => ({
      accessType: 'read',
      recordType,
    })),
  );
  (aggregateGroupByDuration as jest.Mock).mockImplementation(
    async ({ recordType }) => {
      if (recordType === 'Distance') throw new Error('provider unavailable');
      return [];
    },
  );
  const result = await syncRecentHealthData({ force: true });
  expect(result.failedMetrics).toEqual(['Distance']);
  const payload = (authenticatedRequest as jest.Mock).mock.calls[0][2];
  expect(
    payload.records.every(
      (row: { metricType: string }) => row.metricType === 'steps',
    ),
  ).toBe(true);
});

test('unchanged cumulative steps do not upload again as the clock advances', async () => {
  const keychain = require('react-native-keychain');
  const saved = new Map();
  keychain.getGenericPassword.mockImplementation(
    async ({ service }: { service: string }) => saved.get(service) || false,
  );
  keychain.setGenericPassword.mockImplementation(
    async (
      username: string,
      password: string,
      { service }: { service: string },
    ) => {
      saved.set(service, { username, password });
      return true;
    },
  );
  (getGrantedPermissions as jest.Mock).mockResolvedValue([
    { accessType: 'read', recordType: 'Steps' },
  ]);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async () => []);
  await syncRecentHealthData({ force: true });
  (authenticatedRequest as jest.Mock).mockClear();
  const result = await syncRecentHealthData({ force: true });
  expect(result.synced).toBe(0);
  expect(authenticatedRequest).not.toHaveBeenCalled();
});

test('no permissions produces an actionable error and sends no data', async () => {
  (getGrantedPermissions as jest.Mock).mockResolvedValue([]);
  await expect(syncRecentHealthData({ force: true })).rejects.toThrow(
    'Allow Health Connect read permissions',
  );
  expect(authenticatedRequest).not.toHaveBeenCalled();
});

const todayStart = () => {
  const key = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);
  return new Date(`${key}T00:00:00+05:30`).toISOString();
};
const keepSnapshots = () => {
  const keychain = require('react-native-keychain');
  const saved = new Map();
  keychain.getGenericPassword.mockImplementation(
    async ({ service }: { service: string }) => saved.get(service) || false,
  );
  keychain.setGenericPassword.mockImplementation(
    async (
      username: string,
      password: string,
      { service }: { service: string },
    ) => {
      saved.set(service, { username, password });
      return true;
    },
  );
};
const granted = (types: string[]) =>
  (getGrantedPermissions as jest.Mock).mockResolvedValue(
    types.map(recordType => ({ recordType, accessType: 'read' })),
  );
const vitalGroups = ({ recordType }: { recordType: string }) => [
  {
    startTime: todayStart(),
    result: (
      {
        HeartRate: { BPM_AVG: 72, MEASUREMENTS_COUNT: 20 },
        Weight: { WEIGHT_AVG: { inKilograms: 75 } },
        BloodPressure: {
          SYSTOLIC_AVG: { inMillimetersOfMercury: 120 },
          DIASTOLIC_AVG: { inMillimetersOfMercury: 80 },
        },
        Distance: { DISTANCE: { inMeters: 2500 } },
        TotalCaloriesBurned: { ENERGY_TOTAL: { inKilocalories: 2000 } },
        SleepSession: { SLEEP_DURATION_TOTAL: 28800 },
        Steps: { COUNT_TOTAL: 4567 },
      } as Record<string, unknown>
    )[recordType],
  },
];
test('all nine permitted Health Connect types convert and upload in bounded batches', async () => {
  granted([
    'Steps',
    'Distance',
    'TotalCaloriesBurned',
    'SleepSession',
    'HeartRate',
    'Weight',
    'BloodPressure',
    'OxygenSaturation',
    'ExerciseSession',
  ]);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async args =>
    vitalGroups(args),
  );
  (readRecords as jest.Mock).mockImplementation(
    async (type: string, options: { pageToken?: string }) => {
      if (type === 'OxygenSaturation')
        return {
          records: [
            {
              time: todayStart(),
              percentage: 98,
              metadata: { dataOrigin: 'watch' },
            },
          ],
          ...(options.pageToken ? {} : { pageToken: 'next' }),
        };
      return {
        records: [
          {
            startTime: todayStart(),
            endTime: new Date(Date.parse(todayStart()) + 60000).toISOString(),
            exerciseType: 999,
            metadata: { id: 'exercise-1', dataOrigin: 'watch' },
          },
        ],
      };
    },
  );
  await syncRecentHealthData({ force: true });
  const calls = (authenticatedRequest as jest.Mock).mock.calls;
  expect(calls.length).toBe(2);
  expect(
    calls.every(call => call[2].records.length <= 100 && call[4] === 'user'),
  ).toBe(true);
  const records = calls.flatMap(call => call[2].records);
  for (const [metric, value, unit] of [
    ['distance', 2.5, 'km'],
    ['calories', 2000, 'kcal'],
    ['sleep', 480, 'min'],
    ['heart_rate', 72, 'bpm'],
    ['weight', 75, 'kg'],
    ['oxygen_saturation', 98, '%'],
    ['workout', 1, 'min'],
  ])
    expect(records).toContainEqual(
      expect.objectContaining({ metricType: metric, value, unit }),
    );
  expect(
    records
      .filter(row => row.metricType === 'blood_pressure')
      .map(row => row.value)
      .sort(),
  ).toEqual([120, 80]);
  expect(
    (readRecords as jest.Mock).mock.calls.filter(
      call => call[0] === 'OxygenSaturation',
    ).length,
  ).toBe(2);
});
test('removed vitals create tombstones while revoked permissions preserve records', async () => {
  keepSnapshots();
  granted(['HeartRate', 'Weight', 'BloodPressure', 'OxygenSaturation']);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async args =>
    vitalGroups(args),
  );
  (readRecords as jest.Mock).mockResolvedValue({
    records: [{ time: todayStart(), percentage: 98 }],
  });
  await syncRecentHealthData({ force: true });
  (authenticatedRequest as jest.Mock).mockClear();
  granted(['HeartRate', 'Weight']);
  (aggregateGroupByDuration as jest.Mock).mockResolvedValue([]);
  await syncRecentHealthData({ force: true });
  const records = (authenticatedRequest as jest.Mock).mock.calls.flatMap(
    call => call[2].records,
  );
  expect(records.map(row => row.metricType).sort()).toEqual([
    'heart_rate',
    'weight',
  ]);
  expect(
    records.every(row => row.deleted === true && row.deviceId === 'device'),
  ).toBe(true);
});
test('a failed upload never advances local sync state', async () => {
  keepSnapshots();
  granted(['HeartRate']);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async args =>
    vitalGroups(args),
  );
  (authenticatedRequest as jest.Mock).mockRejectedValueOnce(
    new Error('offline'),
  );
  await expect(syncRecentHealthData({ force: true })).rejects.toThrow(
    'offline',
  );
  expect(
    require('react-native-keychain').setGenericPassword,
  ).not.toHaveBeenCalled();
  await syncRecentHealthData({ force: true });
  expect(authenticatedRequest).toHaveBeenCalledTimes(2);
});
test('changing accounts during a read prevents health upload', async () => {
  granted(['HeartRate']);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async () => {
    require('../src/services/auth').readSession.mockResolvedValue({
      user: { id: 'other-user' },
    });
    return [];
  });
  await expect(syncRecentHealthData({ force: true })).rejects.toThrow(
    'Account changed',
  );
  expect(authenticatedRequest).not.toHaveBeenCalled();
});

test('active minutes merge overlapping sessions and workout removals are synced', async () => {
  keepSnapshots();
  granted(['ExerciseSession']);
  const end = Date.parse(todayStart()) - 86400000;
  const workout = {
    startTime: new Date(end - 600000).toISOString(),
    endTime: new Date(end).toISOString(),
    exerciseType: 999,
    metadata: { id: 'one', dataOrigin: 'phone' },
  };
  (readRecords as jest.Mock).mockResolvedValue({
    records: [
      workout,
      { ...workout, metadata: { id: 'two', dataOrigin: 'watch' } },
    ],
  });
  await syncRecentHealthData({ force: true });
  const records = (authenticatedRequest as jest.Mock).mock.calls.flatMap(
    call => call[2].records,
  );
  expect(
    records
      .filter(row => row.metricType === 'active_minutes' && row.value > 0)
      .map(row => row.value),
  ).toEqual([10]);
  (authenticatedRequest as jest.Mock).mockClear();
  (readRecords as jest.Mock).mockResolvedValue({ records: [] });
  await syncRecentHealthData({ force: true });
  const removed = (authenticatedRequest as jest.Mock).mock.calls.flatMap(
    call => call[2].records,
  );
  expect(
    removed
      .filter(row => row.metricType === 'workout')
      .every(row => row.deleted === true),
  ).toBe(true);
  expect(removed.filter(row => row.metricType === 'workout')).toHaveLength(2);
  expect(
    removed
      .filter(row => row.metricType === 'active_minutes')
      .every(row => row.value === 0),
  ).toBe(true);
});
test('a failed vital read never turns the previous measurement into a deletion', async () => {
  keepSnapshots();
  granted(['HeartRate', 'Weight']);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async args =>
    vitalGroups(args),
  );
  await syncRecentHealthData({ force: true });
  (authenticatedRequest as jest.Mock).mockClear();
  (aggregateGroupByDuration as jest.Mock).mockImplementation(
    async ({ recordType }) => {
      if (recordType === 'HeartRate') throw new Error('provider unavailable');
      return [];
    },
  );
  const result = await syncRecentHealthData({ force: true });
  expect(result.failedMetrics).toContain('HeartRate');
  const records = (authenticatedRequest as jest.Mock).mock.calls.flatMap(
    call => call[2].records,
  );
  expect(records.some(row => row.metricType === 'heart_rate')).toBe(false);
  expect(records).toContainEqual(
    expect.objectContaining({ metricType: 'weight', deleted: true }),
  );
});

test('invalid steps do not block valid vitals or upload replacement step totals', async () => {
  granted(['Steps', 'HeartRate']);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(
    async ({ recordType }) =>
      recordType === 'Steps'
        ? [{ startTime: todayStart(), result: { COUNT_TOTAL: -1 } }]
        : vitalGroups({ recordType }),
  );
  const result = await syncRecentHealthData({ force: true });
  expect(result.failedMetrics).toContain('Steps');
  const rows = (authenticatedRequest as jest.Mock).mock.calls.flatMap(
    call => call[2].records,
  );
  expect(rows.some(row => row.metricType === 'steps')).toBe(false);
  expect(rows).toContainEqual(
    expect.objectContaining({ metricType: 'heart_rate', value: 72 }),
  );
});
test('malformed snapshot cache cannot block otherwise valid health reads', async () => {
  require('react-native-keychain').getGenericPassword.mockImplementation(
    async ({ service }: { service: string }) =>
      service.includes('snapshots')
        ? { username: 'user', password: 'null' }
        : false,
  );
  granted(['HeartRate']);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async args =>
    vitalGroups(args),
  );
  await expect(syncRecentHealthData({ force: true })).resolves.toMatchObject({
    synced: 1,
  });
});

test('a future watermark does not suppress automatic sync after a clock correction', async () => {
  require('react-native-keychain').getGenericPassword.mockImplementation(
    async ({ service }: { service: string }) =>
      service.includes('watermark')
        ? {
            username: 'user',
            password: JSON.stringify({
              schemaVersion: 3,
              lastSuccessAt: Date.now() + 86400000,
            }),
          }
        : false,
  );
  granted(['HeartRate']);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async args =>
    vitalGroups(args),
  );
  const result = await syncRecentHealthData();
  expect(result.throttled).not.toBe(true);
  expect(result.synced).toBe(1);
});
test('manual sync queued during a failing automatic sync still retries', async () => {
  granted(['HeartRate']);
  (aggregateGroupByDuration as jest.Mock).mockImplementation(async args =>
    vitalGroups(args),
  );
  (authenticatedRequest as jest.Mock).mockRejectedValueOnce(
    new Error('first upload failed'),
  );
  const automatic = syncRecentHealthData();
  const forced = syncRecentHealthData({ force: true });
  const [first, second] = await Promise.allSettled([automatic, forced]);
  expect(first.status).toBe('rejected');
  expect(second.status).toBe('fulfilled');
  expect(authenticatedRequest).toHaveBeenCalledTimes(2);
});
