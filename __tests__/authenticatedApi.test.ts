import { authenticatedRequest } from '../src/services/authenticatedApi';
import { api } from '../src/services/api';
import {
  expireSession,
  readSession,
  refreshSession,
} from '../src/services/auth';
jest.mock('../src/services/api', () => ({ api: { request: jest.fn() } }));
jest.mock('../src/services/auth', () => ({
  expireSession: jest.fn(),
  isExpiredTokenResponse: (error: {
    response?: { status?: number; data?: { message?: string } };
  }) =>
    error.response?.status === 401 &&
    /invalid|expired/i.test(error.response?.data?.message ?? ''),
  readSession: jest.fn(),
  refreshSession: jest.fn(),
}));
beforeEach(() => jest.clearAllMocks());
test('health upload rejects a different signed in user before any request', async () => {
  (readSession as jest.Mock).mockResolvedValue({
    user: { id: 'other' },
    accessToken: 'other-token',
  });
  await expect(
    authenticatedRequest('POST', '/health/sync', {}, 1000, 'expected'),
  ).rejects.toThrow('Account changed');
  expect(api.request).not.toHaveBeenCalled();
});
test('refresh cannot replay health data into a different account', async () => {
  (readSession as jest.Mock).mockResolvedValue({
    user: { id: 'expected' },
    accessToken: 'original-token',
  });
  (api.request as jest.Mock).mockRejectedValue({
    isAxiosError: true,
    response: { status: 401 },
  });
  (refreshSession as jest.Mock).mockResolvedValue({
    user: { id: 'other' },
    accessToken: 'other-token',
  });
  await expect(
    authenticatedRequest('POST', '/health/sync', {}, 1000, 'expected'),
  ).rejects.toThrow('Account changed');
  expect(api.request).toHaveBeenCalledTimes(1);
});

test('expired access token signs the user out when refresh is unavailable', async () => {
  const expiredTokenError = {
    isAxiosError: true,
    response: {
      status: 401,
      data: { message: 'Invalid or expired token' },
    },
  };
  (readSession as jest.Mock).mockResolvedValue({
    user: { id: 'user-1' },
    accessToken: 'expired-token',
  });
  (api.request as jest.Mock).mockRejectedValue(expiredTokenError);
  (refreshSession as jest.Mock).mockResolvedValue(null);

  await expect(authenticatedRequest('GET', '/private')).rejects.toBe(
    expiredTokenError,
  );
  expect(expireSession).toHaveBeenCalledTimes(1);
});

test('does not expire session for unrelated unauthorized errors', async () => {
  const unauthorizedError = {
    isAxiosError: true,
    response: { status: 401, data: { message: 'Access denied' } },
  };
  (readSession as jest.Mock).mockResolvedValue({
    user: { id: 'user-1' },
    accessToken: 'token',
  });
  (api.request as jest.Mock).mockRejectedValue(unauthorizedError);
  (refreshSession as jest.Mock).mockResolvedValue(null);

  await expect(authenticatedRequest('GET', '/private')).rejects.toBe(
    unauthorizedError,
  );
  expect(expireSession).not.toHaveBeenCalled();
});
