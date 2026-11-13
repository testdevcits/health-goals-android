import { Alert } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';
import { fetchActivityTransactions } from '../../../services/activityTransactions';
import type { WalletTransaction } from '../../../services/activityTransactions';
import { fetchWallet } from '../../../services/wallet';
import type { DailyActivity, Wallet } from '../../../services/wallet';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';

export type Reward = {
  id: string;
  title: string;
  description?: string;
  pointsRequired: number;
  provider?: string;
  stock?: number;
  availableVoucherCount?: number;
  terms?: string;
  endAt?: string;
};

export type Redemption = {
  id: string;
  pointsUsed: number;
  status: string;
  redemptionCode?: string;
  createdAt?: string;
  rewardId?: string;
  rewardTitle?: string;
  provider?: string;
  reward?: { title?: string; provider?: string };
  expiresAt?: string;
};

export type TicketClaim = {
  id?: string;
  month: string;
  winnerName?: string;
  groupName?: string;
  status: string;
  stepTotal?: number;
  ticketDate?: string;
  ticketNumber?: string;
  ticketCount?: number;
  bookingReference?: string;
  ticketImage?: string;
};

export const rewardIcon = (title: string) =>
  /coffee|cafe/i.test(title)
    ? '☕'
    : /fitness|band|wearable/i.test(title)
    ? '💪'
    : /donat|charity|health/i.test(title)
    ? '❤️'
    : '🎁';

export default function useRewards() {
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  const [loadingMoreTransactions, setLoadingMoreTransactions] = useState(false);
  const [ticketClaims, setTicketClaims] = useState<TicketClaim[]>([]);
  const [revealedCodes, setRevealedCodes] = useState<string[]>([]);
  const [redeemingRewardId, setRedeemingRewardId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const loadingMoreTransactionsRef = useRef(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    const [
      walletResult,
      rewardsResult,
      redemptionsResult,
      ticketsResult,
      transactionsResult,
    ] = await Promise.allSettled([
        fetchWallet(),
        authenticatedRequest<{ rewards: Reward[] }>(
          'GET',
          API_ENDPOINTS.REWARDS.LIST,
        ),
        authenticatedRequest<{ redemptions: Redemption[] }>(
          'GET',
          API_ENDPOINTS.REWARDS.REDEMPTIONS,
        ),
        authenticatedRequest<{ items: TicketClaim[] }>(
          'GET',
          API_ENDPOINTS.REWARDS.LEADERBOARD_TICKETS,
        ),
        fetchActivityTransactions(1),
      ]);
    if (walletResult.status === 'fulfilled') {
      setWallet(walletResult.value.wallet);
      setDailyActivity(walletResult.value.dailyActivity);
      setPoints(walletResult.value.wallet.availablePoints);
    }
    if (rewardsResult.status === 'fulfilled') {
      setRewards(rewardsResult.value.rewards || []);
    }
    if (redemptionsResult.status === 'fulfilled') {
      const currentRedemptions = redemptionsResult.value.redemptions || [];
      setRedemptions(currentRedemptions);
      setRevealedCodes(previous =>
        previous.filter(id => currentRedemptions.some(item => item.id === id)),
      );
    }
    if (ticketsResult.status === 'fulfilled') {
      setTicketClaims(ticketsResult.value.items || []);
    }
    if (transactionsResult.status === 'fulfilled') {
      setTransactions(transactionsResult.value.items);
      setTransactionsPage(transactionsResult.value.page);
      setTransactionsTotal(transactionsResult.value.total);
    }
    const failure = [
      walletResult,
      rewardsResult,
      redemptionsResult,
      ticketsResult,
      transactionsResult,
    ].find(result => result.status === 'rejected');
    if (failure?.status === 'rejected') {
      showAppToast(
        'error',
        'Could not load rewards',
        apiErrorMessage(failure.reason),
      );
    }
    if (
      [
        walletResult,
        rewardsResult,
        redemptionsResult,
        ticketsResult,
        transactionsResult,
      ].every(result => result.status === 'rejected')
    ) {
      setLoadError(
        apiErrorMessage(
          failure?.status === 'rejected' ? failure.reason : undefined,
        ),
      );
    }
    setLoading(false);
  }, []);

  const loadMoreTransactions = useCallback(async () => {
    if (
      loadingMoreTransactionsRef.current ||
      transactions.length >= transactionsTotal
    ) {
      return;
    }
    loadingMoreTransactionsRef.current = true;
    setLoadingMoreTransactions(true);
    try {
      const nextPage = await fetchActivityTransactions(transactionsPage + 1);
      setTransactions(current => {
        const existingIds = new Set(current.map(transaction => transaction.id));
        return [
          ...current,
          ...nextPage.items.filter(
            transaction => !existingIds.has(transaction.id),
          ),
        ];
      });
      setTransactionsPage(nextPage.page);
      setTransactionsTotal(nextPage.total);
    } catch (error) {
      showAppToast(
        'error',
        'Could not load points activity',
        apiErrorMessage(error),
      );
    } finally {
      loadingMoreTransactionsRef.current = false;
      setLoadingMoreTransactions(false);
    }
  }, [transactions.length, transactionsPage, transactionsTotal]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const toggleCode = (redemptionId: string) => {
    setRevealedCodes(previous =>
      previous.includes(redemptionId)
        ? previous.filter(id => id !== redemptionId)
        : [...previous, redemptionId],
    );
  };

  const redeem = async (reward: Reward) => {
    setRedeemingRewardId(reward.id);
    try {
      const result = await authenticatedRequest<{ redemption: Redemption }>(
        'POST',
        API_ENDPOINTS.REWARDS.REDEEM(reward.id),
      );
      if (!result.redemption?.id) {
        throw new Error('The server did not confirm this redemption.');
      }
      await refresh();
      showAppToast(
        'success',
        'Reward redeemed',
        `${reward.title} is now in Recent Redemptions. Tap it to reveal your code.`,
      );
    } catch (error) {
      await refresh();
      showAppToast(
        'error',
        'Could not confirm redemption',
        `${apiErrorMessage(
          error,
        )} If the request timed out, check Recent Redemptions before trying again.`,
      );
    } finally {
      setRedeemingRewardId(null);
    }
  };

  const refreshRedemption = async (redemption: Redemption) => {
    try {
      const result = await authenticatedRequest<{ redemption: Redemption }>(
        'GET',
        API_ENDPOINTS.REWARDS.REDEMPTION_DETAILS(redemption.id),
      );
      setRedemptions(previous =>
        previous.map(item =>
          item.id === redemption.id ? { ...item, ...result.redemption } : item,
        ),
      );
      if (result.redemption.redemptionCode) {
        toggleCode(redemption.id);
      } else {
        setRevealedCodes(previous =>
          previous.filter(id => id !== redemption.id),
        );
      }
    } catch (error) {
      showAppToast(
        'error',
        'Could not refresh redemption',
        apiErrorMessage(error),
      );
    }
  };

  const confirmRedeem = (reward: Reward) => {
    Alert.alert(
      'Redeem this reward?',
      `${
        reward.title
      } will use ${reward.pointsRequired.toLocaleString()} points. If successful, the code will appear in Recent Redemptions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Redeem', onPress: () => redeem(reward) },
      ],
    );
  };

  return {
    points,
    wallet,
    dailyActivity,
    rewards,
    redemptions,
    transactions,
    hasMoreTransactions: transactions.length < transactionsTotal,
    loadingMoreTransactions,
    loadMoreTransactions,
    ticketClaims,
    revealedCodes,
    redeemingRewardId,
    loading,
    loadError,
    refresh,
    confirmRedeem,
    refreshRedemption,
    toggleCode,
  };
}
