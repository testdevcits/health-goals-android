import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  AppHeader,
  AppText,
  ProfileCard,
  ProfileListRow,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import {
  ProfileScreenNavigation,
  ProfileSectionLabel,
} from '../components/ProfileScreenLayout';

type Reward = { id: string; title: string; description?: string; pointsRequired: number; provider?: string; stock?: number };
type Redemption = { id: string; pointsUsed: number; status: string; redemptionCode?: string; createdAt?: string; rewardId?: string };
const rewardIcon = (title: string) => /coffee|cafe/i.test(title) ? '☕' : /fitness|band|wearable/i.test(title) ? '💪' : /donat|charity|health/i.test(title) ? '❤️' : '🎁';

const RewardsScreen: React.FC<{ navigation: ProfileScreenNavigation }> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  const refresh = useCallback(async () => {
    const [walletResult, rewardsResult, redemptionsResult] = await Promise.allSettled([
      authenticatedRequest<{ wallet?: { availablePoints?: number } }>('GET', '/wallet'),
      authenticatedRequest<{ rewards: Reward[] }>('GET', '/rewards'),
      authenticatedRequest<{ redemptions: Redemption[] }>('GET', '/redemptions'),
    ]);
    if (walletResult.status === 'fulfilled') setPoints(walletResult.value.wallet?.availablePoints ?? 0);
    if (rewardsResult.status === 'fulfilled') setRewards(rewardsResult.value.rewards || []);
    if (redemptionsResult.status === 'fulfilled') setRedemptions(redemptionsResult.value.redemptions || []);
    const failure = [walletResult, rewardsResult, redemptionsResult].find(result => result.status === 'rejected');
    if (failure?.status === 'rejected') Alert.alert('Could not load rewards', apiErrorMessage(failure.reason));
  }, []);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const redeem = async (reward: Reward) => {
    try {
      const result = await authenticatedRequest<{ redemption: Redemption }>('POST', `/rewards/${encodeURIComponent(reward.id)}/redeem`);
      await refresh();
      Alert.alert('Reward redeemed', result.redemption?.redemptionCode ? `Your code: ${result.redemption.redemptionCode}` : `${reward.title} has been redeemed.`);
    } catch (error) {
      Alert.alert('Could not redeem reward', apiErrorMessage(error));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <AppHeader
        title="Rewards & Redemption"
        subtitle="Redeem your hard-earned points"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, padding: 16 }}
      >
        <View
          style={[styles.pointsCard, { backgroundColor: theme.colors.primary }]}
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
        <ProfileSectionLabel>Available Rewards</ProfileSectionLabel>
        <View style={styles.rewardList}>
          {rewards.length === 0 ? <ProfileCard><AppText variant="caption" secondary>No rewards available yet.</AppText></ProfileCard> : rewards.map(reward => (
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
                  onPress={() => void redeem(reward)}
                  disabled={points < reward.pointsRequired || reward.stock === 0}
                  style={styles.redeemAction}
                >
                  <AppText variant="subtitle2" color={points < reward.pointsRequired || reward.stock === 0 ? 'textTertiary' : 'warning'} bold>
                    {reward.pointsRequired.toLocaleString()} pts
                  </AppText>
                  <AppText variant="caption" color={points < reward.pointsRequired || reward.stock === 0 ? 'textTertiary' : 'primary'} bold>
                    {reward.stock === 0 ? 'Out of stock' : points < reward.pointsRequired ? 'Not enough points' : 'Redeem'}
                  </AppText>
                </Pressable>
              </View>
            </ProfileCard>
          ))}
        </View>
        <ProfileSectionLabel>Recent Redemptions</ProfileSectionLabel>
        <ProfileCard>
          {redemptions.length === 0 ? <ProfileListRow icon="🎁" title="No redemptions yet" detail="Your reward history will appear here" last /> : null}
          {redemptions.slice(0, 5).map((redemption, index) => (
            <ProfileListRow
              key={redemption.id}
              icon="🎁"
              title={redemption.redemptionCode || 'Reward redemption'}
              detail={`${redemption.status}${redemption.createdAt ? ` · ${new Date(redemption.createdAt).toLocaleDateString()}` : ''}`}
              action={`−${redemption.pointsUsed.toLocaleString()}`}
              last={index === Math.min(redemptions.length, 5) - 1}
            />
          ))}
        </ProfileCard>
      </ScrollView>
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
});

export default RewardsScreen;
