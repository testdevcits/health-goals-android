import { authenticatedRequest } from '../src/services/authenticatedApi';
import { fetchWallet } from '../src/services/wallet';

jest.mock('../src/services/authenticatedApi', () => ({
  authenticatedRequest: jest.fn(),
}));

const requestMock = authenticatedRequest as jest.Mock;

const walletResponse = {
  wallet: {
    id: 'wallet-1',
    userId: 'user-1',
    availablePoints: 47,
    lifetimeEarned: 47,
    lifetimeRedeemed: 0,
    createdAt: '2026-11-04T12:17:53.596Z',
    updatedAt: '2026-11-11T09:02:25.410Z',
  },
  transactions: [
    {
      id: 'transaction-1',
      type: 'EARN',
      amount: 5,
      balanceAfter: 47,
      referenceType: 'DAILY_SETTLEMENT',
      referenceId: '2026-11-10:daily-version',
      description: 'Daily activities 2026-11-10 (Asia/Kolkata)',
      idempotencyKey: 'daily:transaction-1',
      createdAt: '2026-11-11T07:14:53.186Z',
    },
  ],
  dailyActivity: {
    day: '2026-11-11',
    timezone: 'Asia/Kolkata',
    ruleVersion: 'daily-version',
    rules: {
      dailyCap: 20,
      stepsPerTier: 2000,
      stepTierCoins: 2,
      stepMaxCoins: 8,
      workoutMinutes: 20,
      workoutCoins: 5,
      meditationMinutes: 5,
      meditationCoins: 2,
      waterCheckinCoins: 1,
      sleepCheckinCoins: 2,
      version: 'daily-version',
      timezone: 'Asia/Kolkata',
    },
    state: 'RETRY',
    dueAt: '2026-11-11T18:30:00.000Z',
    creditedCoins: 0,
    entitledCoins: 5,
    pendingCoins: 5,
    totals: {
      steps: 0,
      workoutMinutes: 712.15,
      meditationMinutes: 0,
      breakdown: {
        steps: 0,
        workout: 5,
        meditation: 0,
        waterCheckin: 0,
        sleepCheckin: 0,
      },
      entitledCoins: 5,
    },
    needsSettlement: true,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('loads wallet balance, lifetime totals, transactions, and daily activity', async () => {
  requestMock.mockResolvedValue(walletResponse);

  await expect(fetchWallet()).resolves.toEqual(walletResponse);
  expect(requestMock).toHaveBeenCalledWith('GET', '/wallet');
});

test('rejects wallet data with an invalid time zone', async () => {
  requestMock.mockResolvedValue({
    ...walletResponse,
    dailyActivity: {
      ...walletResponse.dailyActivity,
      timezone: 'not/a-timezone',
    },
  });

  await expect(fetchWallet()).rejects.toThrow(
    'The server returned invalid wallet data.',
  );
});
