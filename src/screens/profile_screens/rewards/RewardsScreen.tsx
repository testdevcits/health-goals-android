import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppErrorView, AppHeader, AppLoader } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import type { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import {
  AvailableRewardsSection,
  DailyActivityCard,
  LeaderboardTicketSection,
  PointsActivitySection,
  PointsHeroCard,
  RecentRedemptionsSection,
} from './components';
import createStyles from './styles.Rewards';
import useRewards from './useRewards';

const RewardsScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <PointsHeroCard points={points} wallet={wallet} />

          {dailyActivity ? (
            <DailyActivityCard dailyActivity={dailyActivity} />
          ) : null}

          <LeaderboardTicketSection ticketClaims={ticketClaims} />

          <AvailableRewardsSection
            rewards={rewards}
            points={points}
            redeemingRewardId={redeemingRewardId}
            onRedeem={confirmRedeem}
          />

          <PointsActivitySection
            transactions={transactions}
            hasMoreTransactions={hasMoreTransactions}
            loadingMoreTransactions={loadingMoreTransactions}
            onLoadMore={loadMoreTransactions}
          />

          <RecentRedemptionsSection
            redemptions={redemptions}
            revealedCodes={revealedCodes}
            onRefreshRedemption={refreshRedemption}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default RewardsScreen;
