import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
} from '../../../components';
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

export type RewardsTab = 'Rewards' | 'My Vouchers' | 'History' | 'Tickets';

const REWARDS_TABS: RewardsTab[] = [
  'Rewards',
  'My Vouchers',
  'History',
  'Tickets',
];

const RewardsScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);
  const [activeTab, setActiveTab] = useState<RewardsTab>('Rewards');

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
          {/* Persistent Balance & Wallet Summary Hero Card */}
          <PointsHeroCard points={points} wallet={wallet} />

          {/* 4 Interactive Segmented Tabs */}
          <View style={styles.tabBar} accessibilityRole="tablist">
            {REWARDS_TABS.map(tab => {
              const isSelected = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tabItem, isSelected && styles.tabItemActive]}
                >
                  <AppText
                    style={[
                      styles.tabLabel,
                      isSelected && styles.tabLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {tab}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {/* Tab 1: Available Rewards to Redeem & Daily Earning Rules */}
          {activeTab === 'Rewards' ? (
            <>
              {dailyActivity ? (
                <DailyActivityCard dailyActivity={dailyActivity} />
              ) : null}

              <AvailableRewardsSection
                rewards={rewards}
                points={points}
                redeemingRewardId={redeemingRewardId}
                onRedeem={confirmRedeem}
              />
            </>
          ) : null}

          {/* Tab 2: User's Claimed Vouchers & Promo Codes */}
          {activeTab === 'My Vouchers' ? (
            <RecentRedemptionsSection
              redemptions={redemptions}
              revealedCodes={revealedCodes}
              onRefreshRedemption={refreshRedemption}
            />
          ) : null}

          {/* Tab 3: Points Activity Ledger & Transaction Passbook */}
          {activeTab === 'History' ? (
            <PointsActivitySection
              transactions={transactions}
              hasMoreTransactions={hasMoreTransactions}
              loadingMoreTransactions={loadingMoreTransactions}
              onLoadMore={loadMoreTransactions}
            />
          ) : null}

          {/* Tab 4: Raffle & Competition Tickets */}
          {activeTab === 'Tickets' ? (
            <LeaderboardTicketSection ticketClaims={ticketClaims} />
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

export default RewardsScreen;
