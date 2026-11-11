import { authenticatedRequest } from '../src/services/authenticatedApi';
import { fetchHealthTrend } from '../src/services/healthTrends';

jest.mock('../src/services/authenticatedApi', () => ({
  authenticatedRequest: jest.fn(),
}));

const requestMock = authenticatedRequest as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test('requests the selected metric and preserves missing measurements', async () => {
  requestMock.mockResolvedValue({
    metricType: 'sleep',
    from: '2026-11-05',
    to: '2026-11-06',
    timezone: 'Asia/Kolkata',
    series: [
      { date: '2026-11-05', value: 420, unit: 'minutes', count: 1 },
      { date: '2026-11-06', value: null, unit: 'minutes', count: 0 },
    ],
  });

  const result = await fetchHealthTrend('sleep', '2026-11-05', '2026-11-06');

  expect(requestMock).toHaveBeenCalledWith(
    'GET',
    '/health/trends?metricType=sleep&from=2026-11-05&to=2026-11-06',
  );
  expect(result.series[1].value).toBeNull();
});

test('rejects a response without a trend series', async () => {
  requestMock.mockResolvedValue({ metricType: 'sleep' });

  await expect(
    fetchHealthTrend('sleep', '2026-11-05', '2026-11-06'),
  ).rejects.toThrow('The server returned an invalid health trend.');
});
