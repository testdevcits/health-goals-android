import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  AppHeader,
  AppEmptyState,
  AppErrorView,
  AppLoader,
  AppText,
  ProfileCard,
  ProfileListRow,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import {
  ProfileScreenNavigation,
  ProfileSectionLabel,
} from '../components/ProfileScreenLayout';

type Reward = {
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
type Redemption = {
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
type TicketClaim = {
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
const rewardIcon = (title: string) =>
  /coffee|cafe/i.test(title)
    ? '☕'
    : /fitness|band|wearable/i.test(title)
    ? '💪'
    : /donat|charity|health/i.test(title)
    ? '❤️'
    : '🎁';

const RewardsScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
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
    if (walletResult.status === 'fulfilled')
      setPoints(walletResult.value.wallet?.availablePoints ?? 0);
    if (rewardsResult.status === 'fulfilled')
      setRewards(rewardsResult.value.rewards || []);
    if (redemptionsResult.status === 'fulfilled') {
      const currentRedemptions = redemptionsResult.value.redemptions || [];
      setRedemptions(currentRedemptions);
      setRevealedCodes(previous =>
        previous.filter(id => currentRedemptions.some(item => item.id === id)),
      );
    }
    if (ticketsResult.status === 'fulfilled')
      setTicketClaims(ticketsResult.value.items || []);
    const failure = [
      walletResult,
      rewardsResult,
      redemptionsResult,
      ticketsResult,
    ].find(result => result.status === 'rejected');
    if (failure?.status === 'rejected')
      showAppToast(
        'error',
        'Could not load rewards',
        apiErrorMessage(failure.reason),
      );
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
      void refresh();
    }, [refresh]),
  );

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
        {
          text: 'Redeem',
          onPress: () => {
            void redeem(reward);
          },
        },
      ],
    );
  };

  const toggleCode = (redemptionId: string) => {
    setRevealedCodes(previous =>
      previous.includes(redemptionId)
        ? previous.filter(id => id !== redemptionId)
        : [...previous, redemptionId],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Rewards & Redemption"
        subtitle="Redeem your hard-earned points"
        onBackPress={() => navigation.goBack()}
      />
      {loading ? (
        <AppLoader message="Loading your rewards…" />
      ) : loadError ? (
        <AppErrorView
          message={loadError}
          onRefresh={() => {
            refresh();
          }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
            padding: 16,
          }}
        >
          <View
            style={[
              styles.pointsCard,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <AppText variant="caption" color="white" bold>
              Available Points
            </AppText>
            <AppText variant="display" color="white" style={styles.pointsValue}>
              {points.toLocaleString()}
            </AppText>
            <AppText variant="caption" color="white">
              Earn points by hitting goals and winning challenges
            </AppText>
          </View>
          <ProfileSectionLabel>Leaderboard Ticket Rewards</ProfileSectionLabel>
          <View style={styles.rewardList}>
            {ticketClaims.length === 0 ? (
              <AppEmptyState
                title="No ticket rewards yet"
                description="Leaderboard ticket rewards will appear here if you qualify."
              />
            ) : (
              ticketClaims.map((claim, index) => {
                const issued =
                  claim.status === 'SENT' || Boolean(claim.ticketImage);
                return (
                  <ProfileCard key={claim.id || `${claim.month}:${index}`}>
                    <View style={styles.ticketCard}>
                      <AppText variant="subtitle2" bold>
                        {claim.groupName ||
                          claim.winnerName ||
                          'Leaderboard reward'}
                      </AppText>
                      <AppText variant="caption" secondary>
                        {claim.month} ·{' '}
                        {claim.stepTotal?.toLocaleString() ?? '—'} steps
                      </AppText>
                      <AppText variant="caption" primary>
                        {issued ? 'Ticket sent' : 'Reward being prepared'}
                      </AppText>
                      {issued ? (
                        <>
                          {claim.ticketDate ? (
                            <AppText variant="caption" secondary>
                              Date: {claim.ticketDate}
                            </AppText>
                          ) : null}
                          {claim.ticketNumber ? (
                            <AppText variant="caption" secondary>
                              Ticket: {claim.ticketNumber}
                            </AppText>
                          ) : null}
                          {claim.ticketCount ? (
                            <AppText variant="caption" secondary>
                              Tickets: {claim.ticketCount}
                            </AppText>
                          ) : null}
                          {claim.bookingReference ? (
                            <AppText variant="caption" secondary>
                              Booking reference: {claim.bookingReference}
                            </AppText>
                          ) : null}
                          {claim.ticketImage ? (
                            <Image
                              source={{ uri: claim.ticketImage }}
                              style={styles.ticketImage}
                              resizeMode="contain"
                              accessibilityLabel="Leaderboard ticket"
                            />
                          ) : null}
                        </>
                      ) : null}
                    </View>
                  </ProfileCard>
                );
              })
            )}
          </View>
          <ProfileSectionLabel>Available Rewards</ProfileSectionLabel>
          <View style={styles.rewardList}>
            {rewards.length === 0 ? (
              <AppEmptyState
                title="No rewards available"
                description="New rewards will appear here when available."
              />
            ) : (
              rewards.map(reward => (
                <ProfileCard key={reward.id}>
                  <View style={styles.rewardRow}>
                    <View
                      style={[
                        styles.rewardIcon,
                        { backgroundColor: theme.colors.primaryLight },
                      ]}
                    >
                      <AppText variant="h3">{rewardIcon(reward.title)}</AppText>
                    </View>
                    <View style={styles.rewardCopy}>
                      <AppText variant="subtitle2" bold>
                        {reward.title}
                      </AppText>
                      <AppText variant="caption" secondary>
                        {reward.description || reward.provider || ''}
                      </AppText>
                    </View>
                    <Pressable
                      onPress={() => confirmRedeem(reward)}
                      disabled={
                        points < reward.pointsRequired ||
                        reward.stock === 0 ||
                        reward.availableVoucherCount === 0 ||
                        redeemingRewardId === reward.id
                      }
                      style={styles.redeemAction}
                    >
                      <AppText
                        variant="subtitle2"
                        color={
                          points < reward.pointsRequired ||
                          reward.stock === 0 ||
                          reward.availableVoucherCount === 0
                            ? 'textTertiary'
                            : 'warning'
                        }
                        bold
                      >
                        {reward.pointsRequired.toLocaleString()} pts
                      </AppText>
                      <AppText
                        variant="caption"
                        color={
                          points < reward.pointsRequired ||
                          reward.stock === 0 ||
                          reward.availableVoucherCount === 0
                            ? 'textTertiary'
                            : 'primary'
                        }
                        bold
                      >
                        {redeemingRewardId === reward.id
                          ? 'Processing'
                          : reward.stock === 0 ||
                            reward.availableVoucherCount === 0
                          ? 'Out of stock'
                          : points < reward.pointsRequired
                          ? 'Not enough points'
                          : 'Redeem'}
                      </AppText>
                    </Pressable>
                  </View>
                </ProfileCard>
              ))
            )}
          </View>
          <ProfileSectionLabel>Recent Redemptions</ProfileSectionLabel>
          <ProfileCard>
            {redemptions.length === 0 ? (
              <AppEmptyState
                title="No redemptions yet"
                description="Rewards you redeem will appear here."
              />
            ) : null}
            {redemptions.slice(0, 5).map((redemption, index) => (
              <ProfileListRow
                key={redemption.id}
                icon="🎁"
                title={
                  redemption.redemptionCode &&
                  revealedCodes.includes(redemption.id)
                    ? redemption.redemptionCode
                    : redemption.rewardTitle ||
                      redemption.reward?.title ||
                      redemption.provider ||
                      redemption.reward?.provider ||
                      'Reward redemption'
                }
                detail={`${redemption.status}${
                  redemption.createdAt
                    ? ` · ${new Date(
                        redemption.createdAt,
                      ).toLocaleDateString()}`
                    : ''
                }${
                  redemption.redemptionCode
                    ? revealedCodes.includes(redemption.id)
                      ? ' · Tap to hide code'
                      : ' · Tap to reveal code'
                    : ''
                }${
                  redemption.expiresAt
                    ? ` · Expires ${new Date(
                        redemption.expiresAt,
                      ).toLocaleDateString()}`
                    : ''
                }`}
                action={`−${redemption.pointsUsed.toLocaleString()}`}
                onPress={
                  redemption.redemptionCode
                    ? () => {
                        refreshRedemption(redemption);
                      }
                    : undefined
                }
                last={index === Math.min(redemptions.length, 5) - 1}
              />
            ))}
          </ProfileCard>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pointsCard: { borderRadius: 22, padding: 20, marginBottom: 4 },
  pointsValue: { marginVertical: 2 },
  rewardList: { gap: 10 },
  rewardRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  rewardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardCopy: { flex: 1 },
  redeemAction: { alignItems: 'flex-end' },
  ticketCard: { gap: 6, padding: 14 },
  ticketImage: { width: '100%', height: 180, marginTop: 8 },
});

export default RewardsScreen;
