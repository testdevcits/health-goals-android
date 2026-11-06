import { readTodayHealthData } from '../src/services/healthConnect';
import {
  aggregateRecord,
  aggregateGroupByDuration,
  getGrantedPermissions,
  readRecords,
} from 'react-native-health-connect';
import { istDateKey, recentIstDates } from '../src/utils/healthDates';
jest.mock('react-native', () => ({ Platform: { OS: 'android' } }));
jest.mock('react-native-health-connect', () => ({
  ExerciseType: {},
  getSdkStatus: jest.fn().mockResolvedValue(3),
  initialize: jest.fn().mockResolvedValue(true),
  SdkAvailabilityStatus: {
    SDK_UNAVAILABLE: 1,
    SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED: 2,
  },
  aggregateRecord: jest.fn(),
  aggregateGroupByDuration: jest.fn(),
  getGrantedPermissions: jest.fn(),
  readRecords: jest.fn(),
}));
beforeEach(() => {
  jest.clearAllMocks();
  (getGrantedPermissions as jest.Mock).mockResolvedValue(
    ['Steps', 'Distance', 'TotalCaloriesBurned', 'ExerciseSession'].map(
      recordType => ({ recordType, accessType: 'read' }),
    ),
  );
  (readRecords as jest.Mock).mockResolvedValue({ records: [] });
  (aggregateGroupByDuration as jest.Mock).mockResolvedValue([]);
});
test('a failed dashboard metric does not discard successful readings', async () => {
  (aggregateRecord as jest.Mock).mockImplementation(async ({ recordType }) => {
    if (recordType === 'Distance') throw new Error('unavailable');
    return {
      COUNT_TOTAL: 743,
      ENERGY_TOTAL: { inKilocalories: 500 },
      EXERCISE_DURATION_TOTAL: { inSeconds: 600 },
    };
  });
  const data = await readTodayHealthData();
  expect(data.steps).toBe(743);
  expect(data.calories).toBe(500);
  expect(data.distanceMeters).toBeNull();
  expect(data.failedMetrics).toEqual(['Distance']);
});
test('workout lists read every page and hourly buckets stay in IST', async () => {
  (aggregateRecord as jest.Mock).mockResolvedValue({
    COUNT_TOTAL: 100,
    DISTANCE: { inMeters: 1000 },
    ENERGY_TOTAL: { inKilocalories: 500 },
    EXERCISE_DURATION_TOTAL: { inSeconds: 600 },
  });
  (aggregateGroupByDuration as jest.Mock).mockResolvedValue([
    {
      startTime: '2024-01-01T18:30:00Z',
      result: {
        COUNT_TOTAL: 100,
        ENERGY_TOTAL: { inKilocalories: 5 },
        EXERCISE_DURATION_TOTAL: { inSeconds: 600 },
      },
    },
  ]);
  (readRecords as jest.Mock).mockImplementation(async (_type, options) => ({
    records: [
      {
        exerciseType: 999,
        startTime: '2024-01-01T18:30:00Z',
        endTime: '2024-01-01T18:40:00Z',
      },
    ],
    ...(options.pageToken ? {} : { pageToken: 'second' }),
  }));
  const data = await readTodayHealthData(true);
  expect(readRecords).toHaveBeenCalledTimes(2);
  expect(data.workouts).toHaveLength(2);
  expect(data.hourlySteps?.[0]).toBe(100);
  expect(data.hourlySteps?.[18]).toBe(0);
});
test('report date ranges change at IST midnight regardless of device timezone', () => {
  expect(istDateKey('2026-11-05T18:29:59Z')).toBe('2026-11-05');
  expect(istDateKey('2026-11-05T18:30:00Z')).toBe('2026-11-06');
  expect(recentIstDates(3, new Date('2026-11-05T18:30:00Z'))).toEqual([
    '2026-11-04',
    '2026-11-05',
    '2026-11-06',
  ]);
});
