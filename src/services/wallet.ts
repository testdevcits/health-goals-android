import { authenticatedRequest } from './authenticatedApi';
import { API_ENDPOINTS } from '../constants/endpoints';
import type {
  WalletTransaction,
  WalletTransactionType,
} from './activityTransactions';

export type Wallet = {
  id: string;
  userId: string;
  availablePoints: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  createdAt: string;
  updatedAt: string;
};

export type DailyActivity = {
  day: string;
  timezone: string;
  ruleVersion: string;
  rules: {
    dailyCap: number;
    stepsPerTier: number;
    stepTierCoins: number;
    stepMaxCoins: number;
    workoutMinutes: number;
    workoutCoins: number;
    meditationMinutes: number;
    meditationCoins: number;
    waterCheckinCoins: number;
    sleepCheckinCoins: number;
    version: string;
    timezone: string;
  };
  state: string;
  dueAt: string;
  creditedCoins: number;
  entitledCoins: number;
  pendingCoins: number;
  totals: {
    steps: number;
    workoutMinutes: number;
    meditationMinutes: number;
    breakdown: {
      steps: number;
      workout: number;
      meditation: number;
      waterCheckin: number;
      sleepCheckin: number;
    };
    entitledCoins: number;
  };
  needsSettlement: boolean;
};

export type WalletResponse = {
  wallet: Wallet;
  transactions: WalletTransaction[];
  dailyActivity: DailyActivity;
};

const transactionTypes: WalletTransactionType[] = [
  'EARN',
  'BONUS',
  'REDEEM',
  'ADJUSTMENT',
  'REVERSAL',
  'EXPIRATION',
];

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isValidDate = (value: string) => !Number.isNaN(Date.parse(value));

const isValidTimeZone = (value: string) => {
  try {
    Intl.DateTimeFormat('en', { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
};

const isWalletTransaction = (value: unknown): value is WalletTransaction => {
  if (!value || typeof value !== 'object') return false;
  const transaction = value as Partial<WalletTransaction>;
  return (
    typeof transaction.id === 'string' &&
    transactionTypes.includes(transaction.type as WalletTransactionType) &&
    isFiniteNumber(transaction.amount) &&
    isFiniteNumber(transaction.balanceAfter) &&
    typeof transaction.description === 'string' &&
    typeof transaction.createdAt === 'string' &&
    isValidDate(transaction.createdAt)
  );
};

export async function fetchWallet(): Promise<WalletResponse> {
  const result = await authenticatedRequest<WalletResponse>(
    'GET',
    API_ENDPOINTS.REWARDS.WALLET,
  );
  const wallet = result?.wallet;
  const activity = result?.dailyActivity;
  if (
    !wallet ||
    typeof wallet.id !== 'string' ||
    typeof wallet.userId !== 'string' ||
    !isFiniteNumber(wallet.availablePoints) ||
    !isFiniteNumber(wallet.lifetimeEarned) ||
    !isFiniteNumber(wallet.lifetimeRedeemed) ||
    typeof wallet.createdAt !== 'string' ||
    !isValidDate(wallet.createdAt) ||
    typeof wallet.updatedAt !== 'string' ||
    !isValidDate(wallet.updatedAt) ||
    !Array.isArray(result.transactions) ||
    result.transactions.some(transaction => !isWalletTransaction(transaction)) ||
    !activity ||
    typeof activity.day !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(activity.day) ||
    typeof activity.timezone !== 'string' ||
    !isValidTimeZone(activity.timezone) ||
    typeof activity.ruleVersion !== 'string' ||
    !activity.rules ||
    typeof activity.state !== 'string' ||
    typeof activity.dueAt !== 'string' ||
    !isValidDate(activity.dueAt) ||
    typeof activity.needsSettlement !== 'boolean' ||
    !isFiniteNumber(activity.creditedCoins) ||
    !isFiniteNumber(activity.entitledCoins) ||
    !isFiniteNumber(activity.pendingCoins) ||
    !isFiniteNumber(activity.totals?.steps) ||
    !isFiniteNumber(activity.totals?.workoutMinutes) ||
    !isFiniteNumber(activity.totals?.meditationMinutes) ||
    !isFiniteNumber(activity.totals?.entitledCoins) ||
    !isFiniteNumber(activity.totals?.breakdown?.steps) ||
    !isFiniteNumber(activity.totals?.breakdown?.workout) ||
    !isFiniteNumber(activity.totals?.breakdown?.meditation) ||
    !isFiniteNumber(activity.totals?.breakdown?.waterCheckin) ||
    !isFiniteNumber(activity.totals?.breakdown?.sleepCheckin) ||
    !isFiniteNumber(activity.rules.dailyCap) ||
    !isFiniteNumber(activity.rules.stepsPerTier) ||
    !isFiniteNumber(activity.rules.stepTierCoins) ||
    !isFiniteNumber(activity.rules.stepMaxCoins) ||
    !isFiniteNumber(activity.rules.workoutMinutes) ||
    !isFiniteNumber(activity.rules.workoutCoins) ||
    !isFiniteNumber(activity.rules.meditationMinutes) ||
    !isFiniteNumber(activity.rules.meditationCoins) ||
    !isFiniteNumber(activity.rules.waterCheckinCoins) ||
    !isFiniteNumber(activity.rules.sleepCheckinCoins) ||
    typeof activity.rules.version !== 'string' ||
    typeof activity.rules.timezone !== 'string' ||
    !isValidTimeZone(activity.rules.timezone)
  ) {
    throw new Error('The server returned invalid wallet data.');
  }
  return result;
}
