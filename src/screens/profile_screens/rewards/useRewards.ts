import { Alert } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
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
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [ticketClaims, setTicketClaims] = useState<TicketClaim[]>([]);
  const [revealedCodes, setRevealedCodes] = useState<string[]>([]);
  const [redeemingRewardId, setRedeemingRewardId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    const [walletResult, rewardsResult, redemptionsResult, ticketsResult] =
      await Promise.allSettled([
        authenticatedRequest<{
          wallet?: {
            availablePoints?: number;
            lifetimeEarned?: number;
            lifetimeRedeemed?: number;
          };
        }>('GET', '/wallet'),
        authenticatedRequest<{ rewards: Reward[] }>('GET', '/rewards'),
        authenticatedRequest<{ redemptions: Redemption[] }>(
          'GET',
          '/redemptions',
        ),
        authenticatedRequest<{ items: TicketClaim[] }>(
          'GET',
          '/rewards/leaderboard-tickets',
        ),
      ]);
    if (walletResult.status === 'fulfilled') {
      setPoints(walletResult.value.wallet?.availablePoints ?? 0);
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
    const failure = [
      walletResult,
      rewardsResult,
      redemptionsResult,
      ticketsResult,
    ].find(result => result.status === 'rejected');
    if (failure?.status === 'rejected') {
      showAppToast(
        'error',
        'Could not load rewards',
        apiErrorMessage(failure.reason),
      );
    }
    if (
      [walletResult, rewardsResult, redemptionsResult, ticketsResult].every(
        result => result.status === 'rejected',
      )
    ) {
      setLoadError(
        apiErrorMessage(
          failure?.status === 'rejected' ? failure.reason : undefined,
        ),
      );
    }
    setLoading(false);
  }, []);

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
        `/rewards/${encodeURIComponent(reward.id)}/redeem`,
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
        `/redemptions/${encodeURIComponent(redemption.id)}`,
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
    rewards,
    redemptions,
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
