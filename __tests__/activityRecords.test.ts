import { authenticatedRequest } from '../src/services/authenticatedApi';
import { fetchActivityRecords } from '../src/services/activityRecords';

jest.mock('../src/services/authenticatedApi', () => ({
  authenticatedRequest: jest.fn(),
}));

const requestMock = authenticatedRequest as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test('requests filtered activity records with page metadata', async () => {
  const page = {
    items: [
      {
        id: 'record-1',
        metricType: 'sleep',
        value: 420,
        unit: 'min',
        recordedAt: '2026-11-06T10:00:00.000Z',
        source: 'health_connect',
      },
    ],
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
  requestMock.mockResolvedValue(page);

  await expect(
    fetchActivityRecords('sleep', '2026-11-05', '2026-11-06', 1),
  ).resolves.toEqual(page);
  expect(requestMock).toHaveBeenCalledWith(
    'GET',
    '/activity/records?metricType=sleep&from=2026-11-05&to=2026-11-06&page=1&limit=20',
  );
});

test('rejects malformed activity record entries', async () => {
  requestMock.mockResolvedValue({
    items: [{}],
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  await expect(
    fetchActivityRecords('sleep', '2026-11-05', '2026-11-06', 1),
  ).rejects.toThrow('The server returned an invalid activity records page.');
});
