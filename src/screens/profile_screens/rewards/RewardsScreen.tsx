import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
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
import {
  ProfileScreenNavigation,
  ProfileSectionLabel,
} from '../components/ProfileScreenLayout';
import useRewards, { rewardIcon } from './useRewards';
import createStyles from './styles.Rewards';

const RewardsScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const {
    points,
    wallet,
    dailyActivity,
    rewards,
    redemptions,
    transactions,
    hasMoreTransactions,
    loadingMoreTransactions,
    ticketClaims,
    revealedCodes,
    redeemingRewardId,
    loading,
    loadError,
    refresh,
    confirmRedeem,
    refreshRedemption,
    loadMoreTransactions,
  } = useRewards();
  const activityStatusColor =
    dailyActivity?.state === 'SETTLED'
      ? colors.success
      : dailyActivity?.state === 'RETRY'
      ? colors.warning
      : colors.info;
  const activityStatusBackground =
    dailyActivity?.state === 'SETTLED'
      ? colors.successLight
      : dailyActivity?.state === 'RETRY'
      ? colors.warningLight
      : colors.infoLight;

  return (
    <View style={styles.container}>
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
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.pointsCard}>
            <AppText variant="caption" color="white" bold>
              Available Points
            </AppText>
            <AppText variant="display" color="white" style={styles.pointsValue}>
              {points.toLocaleString()}
            </AppText>
            <AppText variant="caption" color="white">
              Earn points by hitting goals and winning challenges
            </AppText>
            {wallet ? (
              <View style={styles.lifetimeRow}>
                <View style={styles.lifetimeMetric}>
                  <AppText variant="subtitle2" color="white" bold>
                    {wallet.lifetimeEarned.toLocaleString()}
                  </AppText>
                  <AppText variant="caption" color="white">
                    Lifetime earned
                  </AppText>
                </View>
                <View style={styles.lifetimeDivider} />
                <View style={styles.lifetimeMetric}>
                  <AppText variant="subtitle2" color="white" bold>
                    {wallet.lifetimeRedeemed.toLocaleString()}
                  </AppText>
                  <AppText variant="caption" color="white">
                    Lifetime redeemed
                  </AppText>
                </View>
              </View>
            ) : null}
          </View>
          {dailyActivity ? (
            <ProfileCard style={styles.dailyActivityCard}>
              <View style={styles.dailyActivityHeading}>
                <View style={styles.dailyActivityTitle}>
                  <AppText variant="subtitle2" bold>
                    Today&apos;s activity
                  </AppText>
                  <AppText variant="caption" secondary>
                    {new Date(
                      `${dailyActivity.day}T12:00:00Z`,
                    ).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: dailyActivity.timezone,
                    })}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.activityStateBadge,
                    { backgroundColor: activityStatusBackground },
                  ]}
                >
                  <AppText
                    variant="caption"
                    bold
                    style={{ color: activityStatusColor }}
                  >
                    {dailyActivity.state.replace(/_/g, ' ')}
                  </AppText>
                </View>
              </View>
              <View style={styles.dailyActivityMetrics}>
                <View style={styles.dailyActivityMetric}>
                  <AppText variant="subtitle2" bold>
                    {dailyActivity.creditedCoins.toLocaleString()}
                  </AppText>
                  <AppText variant="caption" secondary>
                    Credited
                  </AppText>
                </View>
                <View style={styles.dailyActivityMetric}>
                  <AppText variant="subtitle2" bold>
                    {dailyActivity.pendingCoins.toLocaleString()}
                  </AppText>
                  <AppText variant="caption" secondary>
                    Pending
                  </AppText>
                </View>
                <View style={styles.dailyActivityMetric}>
                  <AppText variant="subtitle2" bold>
                    {dailyActivity.entitledCoins.toLocaleString()}
                  </AppText>
                  <AppText variant="caption" secondary>
                    Eligible
                  </AppText>
                </View>
              </View>
              {dailyActivity.needsSettlement ? (
                <AppText variant="caption" secondary>
                  Points are awaiting settlement. Expected by{' '}
                  {new Date(dailyActivity.dueAt).toLocaleTimeString(
                    undefined,
                    {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZone: dailyActivity.timezone,
                    },
                  )}{' '}
                  ({dailyActivity.timezone}).
                </AppText>
              ) : null}
            </ProfileCard>
          ) : null}
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
                    <View style={styles.rewardIcon}>
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
          <ProfileSectionLabel>Points Activity</ProfileSectionLabel>
          <ProfileCard>
            {transactions.length === 0 ? (
              <AppEmptyState
                title="No points activity yet"
                description="Earned and spent points will appear here."
              />
            ) : (
              transactions.map((transaction, index) => {
                const transactionIcons = {
                  EARN: '🪙',
                  BONUS: '🎉',
                  REDEEM: '🎁',
                  ADJUSTMENT: '⚖️',
                  REVERSAL: '↩️',
                  EXPIRATION: '⌛',
                } as const;
                const amount =
                  transaction.amount > 0
                    ? `+${transaction.amount}`
                    : String(transaction.amount);
                const date = transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleDateString(
                      undefined,
                      { month: 'short', day: 'numeric', year: 'numeric' },
                    )
                  : '';
                return (
                  <ProfileListRow
                    key={transaction.id}
                    icon={transactionIcons[transaction.type]}
                    title={
                      transaction.description ||
                      transaction.type.replace(/_/g, ' ')
                    }
                    detail={`${transaction.type}${
                      date ? ` · ${date}` : ''
                    }${
                      transaction.referenceType
                        ? ` · ${transaction.referenceType.replace(/_/g, ' ')}`
                        : ''
                    } · Balance ${transaction.balanceAfter.toLocaleString()} pts`}
                    action={`${amount} pts`}
                    last={index === transactions.length - 1}
                  />
                );
              })
            )}
            {hasMoreTransactions ? (
              <Pressable
                onPress={loadMoreTransactions}
                disabled={loadingMoreTransactions}
                style={styles.loadMoreButton}
                accessibilityRole="button"
              >
                <AppText variant="caption" primary bold>
                  {loadingMoreTransactions
                    ? 'Loading…'
                    : 'Load more points activity'}
                </AppText>
              </Pressable>
            ) : null}
          </ProfileCard>
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

export default RewardsScreen;
