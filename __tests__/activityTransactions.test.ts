import { authenticatedRequest } from '../src/services/authenticatedApi';
import { fetchActivityTransactions } from '../src/services/activityTransactions';

jest.mock('../src/services/authenticatedApi', () => ({
  authenticatedRequest: jest.fn(),
}));

const requestMock = authenticatedRequest as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test('requests a page and preserves the backend signed transaction amount', async () => {
  const page = {
    items: [
      {
        id: 'transaction-1',
        type: 'REDEEM',
        amount: -5,
        balanceAfter: 15,
        description: 'Reward redemption',
        createdAt: '2026-11-06T10:00:00.000Z',
      },
    ],
    total: 21,
    page: 2,
    limit: 20,
  };
  requestMock.mockResolvedValue(page);

  await expect(fetchActivityTransactions(2)).resolves.toEqual(page);
  expect(requestMock).toHaveBeenCalledWith(
    'GET',
    '/activity/transactions?page=2&limit=20',
  );
});

test('rejects an invalid transaction page response', async () => {
  requestMock.mockResolvedValue({ items: [] });

  await expect(fetchActivityTransactions(1)).rejects.toThrow(
    'The server returned an invalid points activity page.',
  );
});
