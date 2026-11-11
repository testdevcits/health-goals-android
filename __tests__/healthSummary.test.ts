import { authenticatedRequest } from '../src/services/authenticatedApi';
import { fetchHealthSummary } from '../src/services/healthSummary';

jest.mock('../src/services/authenticatedApi', () => ({
  authenticatedRequest: jest.fn(),
}));

const requestMock = authenticatedRequest as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test('loads the all-time health summary', async () => {
  requestMock.mockResolvedValue({ steps: 12000, sleep: 420 });

  await expect(fetchHealthSummary()).resolves.toEqual({
    steps: 12000,
    sleep: 420,
  });
  expect(requestMock).toHaveBeenCalledWith('GET', '/health/summary');
});

test('rejects a summary containing invalid values', async () => {
  requestMock.mockResolvedValue({ steps: '12000' });

  await expect(fetchHealthSummary()).rejects.toThrow(
    'The server returned an invalid health summary.',
  );
});
