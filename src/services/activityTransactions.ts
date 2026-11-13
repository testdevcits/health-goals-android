import { authenticatedRequest } from './authenticatedApi';
import { API_ENDPOINTS } from '../constants/endpoints';

export type WalletTransactionType =
  | 'EARN'
  | 'BONUS'
  | 'REDEEM'
  | 'ADJUSTMENT'
  | 'REVERSAL'
  | 'EXPIRATION';

export type WalletTransaction = {
  id: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: string;
  description: string;
  idempotencyKey?: string;
  createdAt: string;
};

export type ActivityTransactionsPage = {
  items: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
};

export async function fetchActivityTransactions(
  page: number,
  limit = 20,
): Promise<ActivityTransactionsPage> {
  const result = await authenticatedRequest<ActivityTransactionsPage>(
    'GET',
    API_ENDPOINTS.ACTIVITY.TRANSACTIONS(page, limit),
  );
  if (
    !Array.isArray(result?.items) ||
    !Number.isSafeInteger(result.total) ||
    result.total < 0 ||
    !Number.isSafeInteger(result.page) ||
    result.page < 1 ||
    !Number.isSafeInteger(result.limit) ||
    result.limit < 1 ||
    result.items.some(
      transaction =>
        !transaction ||
        typeof transaction.id !== 'string' ||
        ![
          'EARN',
          'BONUS',
          'REDEEM',
          'ADJUSTMENT',
          'REVERSAL',
          'EXPIRATION',
        ].includes(transaction.type) ||
        !Number.isFinite(transaction.amount) ||
        !Number.isFinite(transaction.balanceAfter) ||
        typeof transaction.description !== 'string' ||
        typeof transaction.createdAt !== 'string',
    )
  ) {
    throw new Error('The server returned an invalid points activity page.');
  }
  return result;
}
