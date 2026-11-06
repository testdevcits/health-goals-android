import { authenticatedRequest } from '../src/services/authenticatedApi';
import { api } from '../src/services/api';
import { readSession, refreshSession } from '../src/services/auth';
jest.mock('../src/services/api', () => ({ api: { request: jest.fn() } }));
jest.mock('../src/services/auth', () => ({ readSession: jest.fn(), refreshSession: jest.fn() }));
beforeEach(() => jest.clearAllMocks());
test('health upload rejects a different signed in user before any request', async () => {
  (readSession as jest.Mock).mockResolvedValue({ user: { id: 'other' }, accessToken: 'other-token' });
  await expect(authenticatedRequest('POST', '/health/sync', {}, 1000, 'expected')).rejects.toThrow('Account changed');
  expect(api.request).not.toHaveBeenCalled();
});
test('refresh cannot replay health data into a different account', async () => {
  (readSession as jest.Mock).mockResolvedValue({ user: { id: 'expected' }, accessToken: 'original-token' });
  (api.request as jest.Mock).mockRejectedValue({ isAxiosError: true, response: { status: 401 } });
  (refreshSession as jest.Mock).mockResolvedValue({ user: { id: 'other' }, accessToken: 'other-token' });
  await expect(authenticatedRequest('POST', '/health/sync', {}, 1000, 'expected')).rejects.toThrow('Account changed');
  expect(api.request).toHaveBeenCalledTimes(1);
});
